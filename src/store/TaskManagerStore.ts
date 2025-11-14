/**
 * Store para gestión de múltiples tareas de generación de IA en background
 * Permite polling simultáneo de varias tareas sin bloquear la UI
 */

import type { Task } from 'src/types/task-manager';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { checkTaskStatus, parseGeneratedContent } from 'src/services/ai-service';

// ============================================================================
// TIPOS DEL STORE
// ============================================================================

interface TaskManagerState {
  // Estado de tareas
  tasks: Task[];
  pollingIntervals: Map<string, NodeJS.Timeout>; // Map de taskId -> intervalId

  // Computed getters
  getActiveTasks: () => Task[];
  getCompletedTasks: () => Task[];
  getTaskById: (taskId: string) => Task | undefined;

  // Newsletter getters
  getTasksByNewsletterId: (newsletterId: string) => Task[];
  getNewsletterProgress: (newsletterId: string) => {
    completed: number;
    total: number;
    overallProgress: number;
  };
  areAllNewsletterTasksCompleted: (newsletterId: string) => boolean;
  removeNewsletterTasks: (newsletterId: string) => void;

  // Actions
  addTask: (task: Omit<Task, 'updatedAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  removeTask: (taskId: string) => void;
  startPolling: (taskId: string) => void;
  stopPolling: (taskId: string) => void;
  stopAllPolling: () => void;
  stopNewsletterOnTaskFailure: (taskId: string, errorMessage: string) => void;
  recoverTasksFromStorage: () => void;
  clearCompletedTasks: () => void;

  // Helpers privados
  _persistTasks: () => void;
  _loadTasksFromStorage: () => Task[];
}

// ============================================================================
// CONSTANTES
// ============================================================================

const STORAGE_KEY = 'ai-tasks';
const POLLING_INTERVAL = 20000; // 20 segundos
// ⚠️ NO hay timeout máximo - las tareas pueden durar lo que sea necesario
// Solo se detienen si el backend retorna un error explícito

// ============================================================================
// STORE
// ============================================================================

const useTaskManagerStore = create<TaskManagerState>()(
  devtools(
    (set, get) => ({
      // Estado inicial
      tasks: [],
      pollingIntervals: new Map(),

      // ========================================================================
      // COMPUTED GETTERS
      // ========================================================================

      getActiveTasks: () => {
        const { tasks } = get();
        return tasks.filter(
          (t) => t.status !== 'COMPLETED' && t.status !== 'ERROR' && t.status !== 'FAILED'
        );
      },

      getCompletedTasks: () => {
        const { tasks } = get();
        return tasks.filter((t) => t.status === 'COMPLETED');
      },

      getTaskById: (taskId: string) => {
        const { tasks } = get();
        return tasks.find((t) => t.taskId === taskId);
      },

      // ========================================================================
      // NEWSLETTER GETTERS
      // ========================================================================

      getTasksByNewsletterId: (newsletterId: string) => {
        const { tasks } = get();
        return tasks.filter((t) => t.newsletterId === newsletterId);
      },

      getNewsletterProgress: (newsletterId: string) => {
        const { tasks } = get();
        const newsletterTasks = tasks.filter((t) => t.newsletterId === newsletterId);

        if (newsletterTasks.length === 0) {
          return { completed: 0, total: 0, overallProgress: 0 };
        }

        const completed = newsletterTasks.filter((t) => t.status === 'COMPLETED').length;
        const total = newsletterTasks.length;

        // Calcular progreso general promediando el progreso de todas las tareas
        const totalProgress = newsletterTasks.reduce((sum, task) => sum + task.progress, 0);
        const overallProgress = Math.round(totalProgress / total);

        return { completed, total, overallProgress };
      },

      areAllNewsletterTasksCompleted: (newsletterId: string) => {
        const { tasks } = get();
        const newsletterTasks = tasks.filter((t) => t.newsletterId === newsletterId);

        if (newsletterTasks.length === 0) {
          return false;
        }

        return newsletterTasks.every((t) => t.status === 'COMPLETED');
      },

      removeNewsletterTasks: (newsletterId: string) => {
        const { tasks, stopPolling } = get();
        const newsletterTasks = tasks.filter((t) => t.newsletterId === newsletterId);

        // Detener polling de todas las tareas del newsletter
        newsletterTasks.forEach((task) => {
          stopPolling(task.taskId);
        });

        set((state) => {
          const updatedTasks = state.tasks.filter((t) => t.newsletterId !== newsletterId);

          // Persistir
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));

          console.log('🗑️ Tareas del newsletter removidas:', newsletterId);

          return { tasks: updatedTasks };
        });
      },

      // ========================================================================
      // ACTIONS
      // ========================================================================

      addTask: (task) => {
        set((state) => {
          const newTask: Task = {
            ...task,
            updatedAt: new Date().toISOString(),
          };

          const updatedTasks = [...state.tasks, newTask];

          // Persistir
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));

          console.log('✅ Tarea añadida:', newTask.taskId);

          return { tasks: updatedTasks };
        });
      },

      updateTask: (taskId, updates) => {
        set((state) => {
          const updatedTasks = state.tasks.map((task) =>
            task.taskId === taskId
              ? {
                  ...task,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : task
          );

          // Persistir
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));

          return { tasks: updatedTasks };
        });
      },

      removeTask: (taskId) => {
        const { stopPolling } = get();

        // Detener polling si existe
        stopPolling(taskId);

        set((state) => {
          const updatedTasks = state.tasks.filter((t) => t.taskId !== taskId);

          // Persistir
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));

          console.log('🗑️ Tarea removida:', taskId);

          return { tasks: updatedTasks };
        });
      },

      startPolling: (taskId) => {
        const { pollingIntervals, updateTask, stopPolling } = get();

        // Si ya existe polling para esta tarea, no hacer nada
        if (pollingIntervals.has(taskId)) {
          console.log('⚠️ Polling ya activo para taskId:', taskId);
          return;
        }

        console.log('🔄 Iniciando polling para taskId:', taskId);

        const intervalId = setInterval(async () => {
          try {
            // ⚠️ NO hay timeout - la tarea puede durar lo que sea necesario
            // Solo se detiene si el backend retorna un error explícito

            // Consultar estado
            const statusResponse = await checkTaskStatus(taskId);

            console.log(
              `📊 [${taskId}] Estado: ${statusResponse.status} (${statusResponse.progress}%)`
            );

            // Actualizar tarea
            updateTask(taskId, {
              status: statusResponse.status,
              progress: statusResponse.progress,
              message: statusResponse.message,
            });

            // Si completó exitosamente
            if (
              statusResponse.status === 'COMPLETED' &&
              statusResponse.success &&
              statusResponse.data
            ) {
              console.log('✅ Generación completada:', taskId);

              const parsedData = parseGeneratedContent(statusResponse.data);

              updateTask(taskId, {
                status: 'COMPLETED',
                progress: 100,
                data: parsedData,
              });

              // Detener polling
              stopPolling(taskId);
            }

            // Si hay error o fallo
            if (statusResponse.status === 'ERROR' || statusResponse.status === 'FAILED') {
              console.log('❌ Generación falló:', taskId);

              const errorMsg =
                statusResponse.error?.message ||
                statusResponse.message ||
                'Error durante la generación';

              updateTask(taskId, {
                status: statusResponse.status,
                error: errorMsg,
              });

              // SI ES PARTE DE UN NEWSLETTER, DETENER TODO
              const task = get().getTaskById(taskId);
              if (task?.newsletterId) {
                get().stopNewsletterOnTaskFailure(taskId, errorMsg);
              }

              // Detener polling
              stopPolling(taskId);
            }

            // Si completó pero con error
            if (statusResponse.status === 'COMPLETED' && statusResponse.success === false) {
              console.log('❌ Generación completada con error:', taskId);

              const errorMsg =
                statusResponse.error?.message ||
                statusResponse.message ||
                'Error durante la generación';

              updateTask(taskId, {
                status: 'ERROR',
                error: errorMsg,
              });

              // SI ES PARTE DE UN NEWSLETTER, DETENER TODO
              const task = get().getTaskById(taskId);
              if (task?.newsletterId) {
                get().stopNewsletterOnTaskFailure(taskId, errorMsg);
              }

              // Detener polling
              stopPolling(taskId);
            }
          } catch (error: any) {
            console.error('❌ Error en polling para taskId:', taskId, error);

            // Si es error de red, continuar polling
            // Si es otro error, detener
            if (!error.response) {
              // Continuar
              console.log('⚠️ Error de red, continuando polling...');
            } else {
              // Detener
              updateTask(taskId, {
                status: 'ERROR',
                error: error.message || 'Error al consultar estado',
              });
              stopPolling(taskId);
            }
          }
        }, POLLING_INTERVAL);

        // Guardar intervalId
        set((state) => {
          const newMap = new Map(state.pollingIntervals);
          newMap.set(taskId, intervalId);
          return { pollingIntervals: newMap };
        });
      },

      stopPolling: (taskId) => {
        const { pollingIntervals } = get();

        const intervalId = pollingIntervals.get(taskId);
        if (intervalId) {
          clearInterval(intervalId);

          set((state) => {
            const newMap = new Map(state.pollingIntervals);
            newMap.delete(taskId);
            return { pollingIntervals: newMap };
          });

          console.log('🛑 Polling detenido para taskId:', taskId);
        }
      },

      stopAllPolling: () => {
        const { pollingIntervals } = get();

        pollingIntervals.forEach((intervalId, taskId) => {
          clearInterval(intervalId);
          console.log('🛑 Polling detenido para taskId:', taskId);
        });

        set({ pollingIntervals: new Map() });
      },

      stopNewsletterOnTaskFailure: (taskId, errorMessage) => {
        const { tasks, stopPolling, updateTask } = get();
        const failedTask = tasks.find((t) => t.taskId === taskId);

        // Si no es una tarea de newsletter, no hacer nada
        if (!failedTask?.newsletterId) {
          return;
        }

        console.log('🚨 Deteniendo newsletter por fallo en tarea:', taskId);

        // Obtener todas las tareas del mismo newsletter
        const newsletterTasks = tasks.filter((t) => t.newsletterId === failedTask.newsletterId);

        // Detener y marcar como fallidas todas las tareas activas del newsletter (excepto la que ya falló)
        newsletterTasks.forEach((task) => {
          if (task.status !== 'COMPLETED' && task.taskId !== taskId) {
            stopPolling(task.taskId);
            updateTask(task.taskId, {
              status: 'FAILED',
              error: `Newsletter detenido porque la nota "${failedTask.title || 'sin título'}" falló: ${errorMessage}`,
            });
            console.log(`❌ Tarea ${task.taskId} marcada como FAILED por fallo en newsletter`);
          }
        });

        console.log(`🛑 Newsletter ${failedTask.newsletterId} completamente detenido`);
      },

      recoverTasksFromStorage: () => {
        const tasks = get()._loadTasksFromStorage();

        // Filtrar solo tareas pendientes/en progreso
        const activeTasks = tasks.filter(
          (t) => t.status !== 'COMPLETED' && t.status !== 'ERROR' && t.status !== 'FAILED'
        );

        if (activeTasks.length > 0) {
          console.log('🔄 Recuperando tareas activas:', activeTasks.length);

          set({ tasks });

          // Reiniciar polling para cada tarea activa
          activeTasks.forEach((task) => {
            get().startPolling(task.taskId);
          });
        } else {
          set({ tasks });
        }
      },

      clearCompletedTasks: () => {
        set((state) => {
          const activeTasks = state.tasks.filter(
            (t) => t.status !== 'COMPLETED' && t.status !== 'ERROR' && t.status !== 'FAILED'
          );

          // Persistir
          localStorage.setItem(STORAGE_KEY, JSON.stringify(activeTasks));

          console.log('🧹 Tareas completadas limpiadas');

          return { tasks: activeTasks };
        });
      },

      // ========================================================================
      // HELPERS PRIVADOS
      // ========================================================================

      _persistTasks: () => {
        const { tasks } = get();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      },

      _loadTasksFromStorage: () => {
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (!stored) return [];

          const tasks = JSON.parse(stored) as Task[];
          return tasks;
        } catch (error) {
          console.error('❌ Error al cargar tareas desde localStorage:', error);
          return [];
        }
      },
    }),
    {
      name: 'task-manager-store',
    }
  )
);

export default useTaskManagerStore;
