'use client';

import type { TaskStatus } from 'src/types/ai-generation';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import ToggleButton from '@mui/material/ToggleButton';
import LinearProgress from '@mui/material/LinearProgress';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { paths } from 'src/routes/paths';

import useTaskManagerStore from 'src/store/TaskManagerStore';

// ============================================================================
// TIPOS
// ============================================================================

interface TasksDrawerProps {
  open: boolean;
  onClose: () => void;
}

// ============================================================================
// CONFIGURACIÓN DE ESTADOS
// ============================================================================

const STATUS_CONFIG: Record<
  TaskStatus,
  {
    label: string;
    color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    icon: string;
  }
> = {
  PENDING: {
    label: 'En cola',
    color: 'default',
    icon: 'solar:hourglass-line-bold',
  },
  GENERATING_IMAGE: {
    label: 'Generando imagen',
    color: 'info',
    icon: 'solar:gallery-add-bold',
  },
  GENERATING_WEB_CONTENT: {
    label: 'Generando contenido web',
    color: 'primary',
    icon: 'solar:document-add-bold',
  },
  GENERATING_NEWSLETTER_CONTENT: {
    label: 'Generando newsletter',
    color: 'secondary',
    icon: 'solar:letter-bold',
  },
  COMPLETED: {
    label: 'Completado',
    color: 'success',
    icon: 'solar:check-circle-bold',
  },
  ERROR: {
    label: 'Error',
    color: 'error',
    icon: 'solar:close-circle-bold',
  },
  FAILED: {
    label: 'Fallido',
    color: 'error',
    icon: 'solar:danger-circle-bold',
  },
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function TasksDrawer({ open, onClose }: TasksDrawerProps) {
  const router = useRouter();

  // Estado para controlar qué newsletters están expandidas
  const [expandedNewsletters, setExpandedNewsletters] = useState<Set<string>>(new Set());

  // Estado para el tab activo
  const [activeTab, setActiveTab] = useState(0);

  // Estado para el filtro de categorías (todos, comunicados, bloques)
  const [activeFilter, setActiveFilter] = useState<'all' | 'newsletters' | 'blocks'>('all');

  // Suscribirse directamente a tasks para que se actualice en tiempo real
  const tasks = useTaskManagerStore((state) => state.tasks);
  const removeTask = useTaskManagerStore((state) => state.removeTask);
  const removeNewsletterTasks = useTaskManagerStore((state) => state.removeNewsletterTasks);
  const getNewsletterProgress = useTaskManagerStore((state) => state.getNewsletterProgress);
  const areAllNewsletterTasksCompleted = useTaskManagerStore(
    (state) => state.areAllNewsletterTasksCompleted
  );

  // Separar tareas: newsletters vs individuales
  const individualTasks = tasks.filter((t) => !t.newsletterId);
  const newsletterTasksMap = new Map<string, typeof tasks>();

  // Agrupar tareas de newsletter por newsletterId
  tasks
    .filter((t) => t.newsletterId)
    .forEach((task) => {
      const existing = newsletterTasksMap.get(task.newsletterId!) || [];
      newsletterTasksMap.set(task.newsletterId!, [...existing, task]);
    });

  // Filtrar tareas individuales en tres categorías
  const activeTasks = individualTasks.filter(
    (t) => t.status !== 'COMPLETED' && t.status !== 'ERROR' && t.status !== 'FAILED'
  );
  const completedTasks = individualTasks.filter((t) => t.status === 'COMPLETED');
  const errorTasks = individualTasks.filter((t) => t.status === 'ERROR' || t.status === 'FAILED');

  // Filtrar newsletters por estado
  const activeNewsletters = Array.from(newsletterTasksMap.entries()).filter(([id, tasksList]) => {
    const hasError = tasksList.some((t) => t.status === 'ERROR' || t.status === 'FAILED');
    const allCompleted = areAllNewsletterTasksCompleted(id);
    return !allCompleted && !hasError;
  });
  const completedNewsletters = Array.from(newsletterTasksMap.entries()).filter(([id]) =>
    areAllNewsletterTasksCompleted(id)
  );
  const errorNewsletters = Array.from(newsletterTasksMap.entries()).filter(([id, tasksList]) => {
    const hasError = tasksList.some((t) => t.status === 'ERROR' || t.status === 'FAILED');
    const allCompleted = areAllNewsletterTasksCompleted(id);
    return hasError && !allCompleted;
  });

  const totalTasks = tasks.length;
  const totalActive = activeTasks.length + activeNewsletters.length;
  const totalCompleted = completedTasks.length + completedNewsletters.length;
  const totalErrors = errorTasks.length + errorNewsletters.length;

  const handleRemoveTask = (taskId: string) => {
    removeTask(taskId);
  };

  const handleRemoveNewsletter = (newsletterId: string) => {
    removeNewsletterTasks(newsletterId);
  };

  const handleOpenNote = (taskId: string) => {
    router.push(`${paths.dashboard.new.note}?fromAI=true&taskId=${taskId}`);
    onClose();
  };

  const handleOpenNewsletter = (newsletterId: string) => {
    // Obtener todas las tareas del newsletter
    const newsletterTasks = tasks.filter((t) => t.newsletterId === newsletterId);

    // Preparar datos para el newsletter
    const newsletterData = {
      newsletterId,
      notes: newsletterTasks
        .sort((a, b) => (a.noteIndexInNewsletter || 0) - (b.noteIndexInNewsletter || 0))
        .map((task) => ({
          taskId: task.taskId,
          order: task.noteIndexInNewsletter || 0,
          title: task.title || `Nota ${task.noteIndexInNewsletter || 0 + 1}`,
          objData: task.data?.objData || '[]',
          objDataWeb: task.data?.objDataWeb || '[]',
          isSaved: task.isSaved || false,
          savedPostId: task.savedPostId,
          // Incluir metadatos de categorización
          contentTypeId: task.data?.contentTypeId,
          categoryId: task.data?.categoryId,
          subcategoryId: task.data?.subcategoryId,
        })),
    };

    // Guardar en sessionStorage
    sessionStorage.setItem('ai-newsletter-data', JSON.stringify(newsletterData));

    // Navegar al editor de newsletter
    router.push(`/new/newsletter?aiGenerated=true&newsletterId=${newsletterId}`);
    onClose();
  };

  const toggleNewsletterExpansion = (newsletterId: string) => {
    setExpandedNewsletters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(newsletterId)) {
        newSet.delete(newsletterId);
      } else {
        newSet.add(newsletterId);
      }
      return newSet;
    });
  };

  const handleFilterChange = (
    _event: React.MouseEvent<HTMLElement>,
    newFilter: typeof activeFilter
  ) => {
    if (newFilter !== null) {
      setActiveFilter(newFilter);
    }
  };

  // Componente helper para renderizar Newsletter Card
  const renderNewsletterCard = (newsletterId: string, newsletterTasks: typeof tasks) => {
    const progress = getNewsletterProgress(newsletterId);
    const isCompleted = areAllNewsletterTasksCompleted(newsletterId);
    const isExpanded = expandedNewsletters.has(newsletterId);

    return (
      <Card
        key={newsletterId}
        variant="outlined"
        sx={{
          borderColor: isCompleted ? 'success.main' : 'primary.main',
          borderWidth: 1.5,
          borderRadius: 1.5,
          cursor: isCompleted ? 'pointer' : 'default',
          '&:hover': isCompleted
            ? {
                boxShadow: 2,
              }
            : {},
        }}
        onClick={() => {
          if (isCompleted) {
            handleOpenNewsletter(newsletterId);
          }
        }}
      >
        <CardContent>
          <Stack spacing={2}>
            {/* Header del newsletter */}
            <Stack direction="row" alignItems="flex-start" spacing={1.5}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  bgcolor: isCompleted ? 'success.lighter' : 'primary.lighter',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon
                  icon="solar:document-text-bold"
                  width={24}
                  color={isCompleted ? 'success.main' : 'primary.main'}
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Newsletter
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {progress.total} {progress.total === 1 ? 'nota' : 'notas'}
                </Typography>
              </Box>
              <Stack direction="row" spacing={0.5}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleNewsletterExpansion(newsletterId);
                  }}
                  sx={{ flexShrink: 0 }}
                >
                  <Icon
                    icon={isExpanded ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'}
                    width={20}
                  />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveNewsletter(newsletterId);
                  }}
                  sx={{ flexShrink: 0 }}
                >
                  <Icon icon="solar:trash-bin-minimalistic-linear" width={20} />
                </IconButton>
              </Stack>
            </Stack>

            {/* Progreso general */}
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 1 }}
              >
                {isCompleted ? (
                  <Chip label="Completado" color="success" size="small" />
                ) : (
                  <Chip
                    label={`${progress.completed}/${progress.total} completadas`}
                    color="primary"
                    size="small"
                  />
                )}
                <Typography variant="caption" fontWeight={600} color="primary.main">
                  {progress.overallProgress}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={progress.overallProgress}
                sx={{
                  height: 8,
                  borderRadius: 1,
                  bgcolor: 'background.neutral',
                }}
              />
            </Box>

            {isCompleted && (
              <Typography variant="caption" color="text.secondary">
                Haz clic para abrir en el editor de newsletter
              </Typography>
            )}

            {/* Lista de notas (colapsable) */}
            <Collapse in={isExpanded}>
              <Stack spacing={1} sx={{ mt: 1 }}>
                {newsletterTasks
                  .sort((a, b) => (a.noteIndexInNewsletter || 0) - (b.noteIndexInNewsletter || 0))
                  .map((task) => {
                    const statusConfig = STATUS_CONFIG[task.status] || STATUS_CONFIG.PENDING;
                    const isTaskCompleted = task.status === 'COMPLETED';
                    const hasError = task.status === 'ERROR' || task.status === 'FAILED';
                    const isSaved = task.isSaved || false;

                    return (
                      <Card
                        key={task.taskId}
                        variant="outlined"
                        sx={{
                          borderColor: hasError
                            ? 'error.main'
                            : isSaved
                              ? 'success.dark'
                              : isTaskCompleted
                                ? 'success.main'
                                : 'divider',
                          bgcolor: 'background.paper',
                          borderRadius: 1.5,
                          borderWidth: 1.5,
                        }}
                      >
                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            sx={{ mb: hasError || !isTaskCompleted ? 1 : 0 }}
                          >
                            <Icon icon={statusConfig.icon} width={16} />
                            <Typography variant="caption" sx={{ flexGrow: 1 }}>
                              {task.title || `Nota ${(task.noteIndexInNewsletter || 0) + 1}`}
                            </Typography>
                            {isSaved && (
                              <Chip
                                label="Guardada"
                                size="small"
                                color="success"
                                sx={{ height: 20, fontSize: '0.65rem' }}
                              />
                            )}
                            {isTaskCompleted && !isSaved && (
                              <Chip
                                label="Completada"
                                size="small"
                                color="success"
                                variant="outlined"
                                sx={{ height: 20, fontSize: '0.65rem' }}
                              />
                            )}
                            {hasError && (
                              <Chip
                                label="Error"
                                size="small"
                                color="error"
                                sx={{ height: 20, fontSize: '0.65rem' }}
                              />
                            )}
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveTask(task.taskId);
                              }}
                              sx={{ p: 0.5 }}
                            >
                              <Icon icon="solar:trash-bin-minimalistic-linear" width={14} />
                            </IconButton>
                          </Stack>
                          {!isTaskCompleted && !hasError && (
                            <LinearProgress
                              variant="determinate"
                              value={task.progress}
                              sx={{ height: 4, borderRadius: 1 }}
                            />
                          )}
                          {hasError && task.error && (
                            <Typography
                              variant="caption"
                              color="error.main"
                              sx={{ display: 'block' }}
                            >
                              {task.error}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
              </Stack>
            </Collapse>
          </Stack>
        </CardContent>
      </Card>
    );
  };

  // Componente helper para renderizar Individual Task Card (activa)
  const renderActiveTaskCard = (task: (typeof tasks)[0]) => {
    const statusConfig = STATUS_CONFIG[task.status] || STATUS_CONFIG.PENDING;
    return (
      <Card
        key={task.taskId}
        variant="outlined"
        sx={{
          borderColor: 'divider',
          borderRadius: 1.5,
          borderWidth: 1.5,
          '&:hover': {
            boxShadow: 1,
          },
        }}
      >
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="flex-start" spacing={1.5}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  bgcolor: 'background.neutral',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon icon={statusConfig.icon} width={24} />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {task.title || task.prompt}
                </Typography>
                {task.category && (
                  <Typography variant="caption" color="text.secondary">
                    {task.category}
                  </Typography>
                )}
              </Box>
              <IconButton
                size="small"
                onClick={() => handleRemoveTask(task.taskId)}
                sx={{ flexShrink: 0 }}
              >
                <Icon icon="solar:trash-bin-minimalistic-linear" width={20} />
              </IconButton>
            </Stack>
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 1 }}
              >
                <Chip
                  label={statusConfig.label}
                  color={statusConfig.color}
                  size="small"
                  icon={<Icon icon={statusConfig.icon} width={16} />}
                />
                <Typography variant="caption" fontWeight={600} color="primary.main">
                  {task.progress}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={task.progress}
                sx={{
                  height: 8,
                  borderRadius: 1,
                  bgcolor: 'background.neutral',
                }}
              />
            </Box>
            {task.message && (
              <Typography variant="caption" color="text.secondary">
                {task.message}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  };

  // Componente helper para renderizar Individual Task Card (completada)
  const renderCompletedTaskCard = (task: (typeof tasks)[0]) => {
    const statusConfig = STATUS_CONFIG.COMPLETED;
    return (
      <Card
        key={task.taskId}
        variant="outlined"
        sx={{
          borderColor: 'success.main',
          borderWidth: 1.5,
          borderRadius: 1.5,
          cursor: 'pointer',
          '&:hover': {
            boxShadow: 2,
          },
        }}
        onClick={() => handleOpenNote(task.taskId)}
      >
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="flex-start" spacing={1.5}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  bgcolor: 'success.lighter',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon icon={statusConfig.icon} width={24} color="success.main" />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {task.title || task.prompt}
                </Typography>
                {task.category && (
                  <Typography variant="caption" color="text.secondary">
                    {task.category}
                  </Typography>
                )}
              </Box>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTask(task.taskId);
                }}
                sx={{ flexShrink: 0 }}
              >
                <Icon icon="solar:trash-bin-minimalistic-linear" width={20} />
              </IconButton>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip label="Completado" color="success" size="small" />
              <Typography variant="caption" color="text.secondary">
                Haz clic para abrir
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    );
  };

  // Componente helper para renderizar Individual Task Card (error)
  const renderErrorTaskCard = (task: (typeof tasks)[0]) => {
    const statusConfig = STATUS_CONFIG[task.status] || STATUS_CONFIG.ERROR;
    return (
      <Card
        key={task.taskId}
        variant="outlined"
        sx={{
          borderColor: 'error.main',
          borderWidth: 1.5,
          borderRadius: 1.5,
        }}
      >
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="flex-start" spacing={1.5}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  bgcolor: 'error.lighter',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon icon={statusConfig.icon} width={24} color="error.main" />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {task.title || task.prompt}
                </Typography>
                {task.category && (
                  <Typography variant="caption" color="text.secondary">
                    {task.category}
                  </Typography>
                )}
              </Box>
              <IconButton
                size="small"
                onClick={() => handleRemoveTask(task.taskId)}
                sx={{ flexShrink: 0 }}
              >
                <Icon icon="solar:trash-bin-minimalistic-linear" width={20} />
              </IconButton>
            </Stack>
            <Chip label={statusConfig.label} color="error" size="small" />
            {task.error && (
              <Typography variant="caption" color="error.main">
                {task.error}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  };

  // Componente helper para renderizar Newsletter con Error
  const renderErrorNewsletterCard = (newsletterId: string, newsletterTasks: typeof tasks) => {
    const progress = getNewsletterProgress(newsletterId);
    const isExpanded = expandedNewsletters.has(newsletterId);
    const erroredTasks = newsletterTasks.filter(
      (t) => t.status === 'ERROR' || t.status === 'FAILED'
    );

    return (
      <Card
        key={newsletterId}
        variant="outlined"
        sx={{
          borderColor: 'error.main',
          borderWidth: 1.5,
          borderRadius: 1.5,
        }}
      >
        <CardContent>
          <Stack spacing={2}>
            {/* Header del newsletter */}
            <Stack direction="row" alignItems="flex-start" spacing={1.5}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  bgcolor: 'error.lighter',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon icon="solar:document-text-bold" width={24} color="error.main" />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Newsletter (Con Errores)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {erroredTasks.length}{' '}
                  {erroredTasks.length === 1 ? 'nota falló' : 'notas fallaron'} de {progress.total}
                </Typography>
              </Box>
              <Stack direction="row" spacing={0.5}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleNewsletterExpansion(newsletterId);
                  }}
                  sx={{ flexShrink: 0 }}
                >
                  <Icon
                    icon={isExpanded ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'}
                    width={20}
                  />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveNewsletter(newsletterId);
                  }}
                  sx={{ flexShrink: 0 }}
                >
                  <Icon icon="solar:trash-bin-minimalistic-linear" width={20} />
                </IconButton>
              </Stack>
            </Stack>

            <Chip label="Error en Newsletter" color="error" size="small" />

            {/* Lista de notas (colapsable) */}
            <Collapse in={isExpanded}>
              <Stack spacing={1} sx={{ mt: 1 }}>
                {newsletterTasks
                  .sort((a, b) => (a.noteIndexInNewsletter || 0) - (b.noteIndexInNewsletter || 0))
                  .map((task) => {
                    const statusConfig = STATUS_CONFIG[task.status] || STATUS_CONFIG.PENDING;
                    const hasError = task.status === 'ERROR' || task.status === 'FAILED';

                    return (
                      <Card
                        key={task.taskId}
                        variant="outlined"
                        sx={{
                          borderColor: hasError ? 'error.main' : 'success.light',
                          bgcolor: hasError ? 'error.lighter' : 'background.paper',
                        }}
                      >
                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                          <Stack spacing={1}>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Typography variant="caption" fontWeight={600}>
                                {task.title || `Nota ${(task.noteIndexInNewsletter || 0) + 1}`}
                              </Typography>
                              <Chip
                                label={statusConfig.label}
                                size="small"
                                color={statusConfig.color}
                              />
                            </Stack>
                            {hasError && task.error && (
                              <Typography variant="caption" color="error.main">
                                {task.error}
                              </Typography>
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    );
                  })}
              </Stack>
            </Collapse>
          </Stack>
        </CardContent>
      </Card>
    );
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      hideBackdrop
      PaperProps={{
        sx: {
          width: {
            xs: '100%',
            sm: 520,
          },
        },
      }}
    >
      <Box sx={{ p: 3, pb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Tareas de IA
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {totalTasks} {totalTasks === 1 ? 'tarea' : 'tareas'}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Icon icon="solar:close-circle-linear" width={24} />
          </IconButton>
        </Stack>
      </Box>

      <Divider />

      {/* Tabs para organizar las tareas */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{
            minHeight: 48,
            '& .MuiTab-root': {
              minHeight: 48,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
            },
          }}
        >
          <Tab
            icon={
              <Badge badgeContent={totalActive} color="primary" max={99}>
                <Icon icon="solar:hourglass-line-bold-duotone" width={20} />
              </Badge>
            }
            iconPosition="start"
            label="Progreso"
          />
          <Tab
            icon={
              <Badge badgeContent={totalCompleted} color="success" max={99}>
                <Icon icon="solar:check-circle-bold-duotone" width={20} />
              </Badge>
            }
            iconPosition="start"
            label="Listas"
          />
          <Tab
            icon={
              <Badge badgeContent={totalErrors} color="error" max={99}>
                <Icon icon="solar:danger-circle-bold-duotone" width={20} />
              </Badge>
            }
            iconPosition="start"
            label="Errores"
          />
        </Tabs>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {totalTasks === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 8,
            }}
          >
            <Icon icon="solar:magic-stick-3-linear" width={64} style={{ color: '#919EAB' }} />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              No hay tareas
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Las tareas de generación aparecerán aquí
            </Typography>
          </Box>
        ) : (
          <>
            {/* TAB 0: EN PROGRESO */}
            {activeTab === 0 && (
              <>
                {totalActive === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Icon
                      icon="solar:check-circle-bold-duotone"
                      width={64}
                      style={{ color: '#10B981' }}
                    />
                    <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                      No hay tareas en progreso
                    </Typography>
                  </Box>
                ) : (
                  <>
                    {/* Toggle de filtros - Siempre visible */}
                    <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
                      <ToggleButtonGroup
                        value={activeFilter}
                        exclusive
                        onChange={handleFilterChange}
                        fullWidth
                        size="small"
                        sx={{
                          '& .MuiToggleButton-root': {
                            py: 1,
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '0.8125rem',
                            border: '1px solid',
                            borderColor: 'divider',
                            '&.Mui-selected': {
                              bgcolor: 'primary.main',
                              color: 'primary.contrastText',
                              '&:hover': {
                                bgcolor: 'primary.dark',
                              },
                            },
                          },
                        }}
                      >
                        <ToggleButton value="all">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Icon icon="solar:list-bold-duotone" width={18} />
                            <span>Todos</span>
                            <Chip
                              label={totalActive}
                              size="small"
                              sx={{
                                height: 20,
                                minWidth: 20,
                                '& .MuiChip-label': { px: 0.75, fontSize: '0.7rem' },
                              }}
                            />
                          </Stack>
                        </ToggleButton>
                        <ToggleButton value="newsletters">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Icon icon="solar:document-text-bold-duotone" width={18} />
                            <span>Comunicados</span>
                            <Chip
                              label={activeNewsletters.length}
                              size="small"
                              sx={{
                                height: 20,
                                minWidth: 20,
                                '& .MuiChip-label': { px: 0.75, fontSize: '0.7rem' },
                              }}
                            />
                          </Stack>
                        </ToggleButton>
                        <ToggleButton value="blocks">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Icon icon="solar:widget-5-bold-duotone" width={18} />
                            <span>Bloques</span>
                            <Chip
                              label={activeTasks.length}
                              size="small"
                              sx={{
                                height: 20,
                                minWidth: 20,
                                '& .MuiChip-label': { px: 0.75, fontSize: '0.7rem' },
                              }}
                            />
                          </Stack>
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </Box>

                    <Box sx={{ px: 2, pb: 2 }}>
                      <Stack spacing={2.5}>
                        {/* Comunicados en progreso */}
                        {(activeFilter === 'all' || activeFilter === 'newsletters') &&
                          activeNewsletters.length > 0 && (
                            <>
                              {activeFilter === 'all' && (
                                <Box sx={{ pt: 1.5 }}>
                                  <Typography
                                    variant="overline"
                                    color="text.secondary"
                                    sx={{ fontWeight: 600, letterSpacing: 1.2 }}
                                  >
                                    Comunicados en progreso
                                  </Typography>
                                </Box>
                              )}
                              <Stack spacing={2}>
                                {activeNewsletters.map(([newsletterId, newsletterTasks]) =>
                                  renderNewsletterCard(newsletterId, newsletterTasks)
                                )}
                              </Stack>
                            </>
                          )}

                        {/* Bloques Web en progreso */}
                        {(activeFilter === 'all' || activeFilter === 'blocks') &&
                          activeTasks.length > 0 && (
                            <>
                              {activeFilter === 'all' && activeNewsletters.length > 0 && (
                                <Box sx={{ pt: 1.5 }}>
                                  <Typography
                                    variant="overline"
                                    color="text.secondary"
                                    sx={{ fontWeight: 600, letterSpacing: 1.2 }}
                                  >
                                    Bloques Web en progreso
                                  </Typography>
                                </Box>
                              )}
                              <Stack spacing={2}>
                                {activeTasks.map((task) => renderActiveTaskCard(task))}
                              </Stack>
                            </>
                          )}
                      </Stack>
                    </Box>
                  </>
                )}
              </>
            )}

            {/* TAB 1: COMPLETADAS */}
            {activeTab === 1 && (
              <>
                {totalCompleted === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Icon
                      icon="solar:document-text-bold-duotone"
                      width={64}
                      style={{ color: '#919EAB' }}
                    />
                    <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                      No hay tareas completadas
                    </Typography>
                  </Box>
                ) : (
                  <>
                    {/* Toggle de filtros - Siempre visible */}
                    <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
                      <ToggleButtonGroup
                        value={activeFilter}
                        exclusive
                        onChange={handleFilterChange}
                        fullWidth
                        size="small"
                        sx={{
                          '& .MuiToggleButton-root': {
                            py: 1,
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '0.8125rem',
                            border: '1px solid',
                            borderColor: 'divider',
                            '&.Mui-selected': {
                              bgcolor: 'success.main',
                              color: 'success.contrastText',
                              '&:hover': {
                                bgcolor: 'success.dark',
                              },
                            },
                          },
                        }}
                      >
                        <ToggleButton value="all">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Icon icon="solar:list-bold-duotone" width={18} />
                            <span>Todos</span>
                            <Chip
                              label={totalCompleted}
                              size="small"
                              sx={{
                                height: 20,
                                minWidth: 20,
                                '& .MuiChip-label': { px: 0.75, fontSize: '0.7rem' },
                              }}
                            />
                          </Stack>
                        </ToggleButton>
                        <ToggleButton value="newsletters">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Icon icon="solar:document-text-bold-duotone" width={18} />
                            <span>Comunicados</span>
                            <Chip
                              label={completedNewsletters.length}
                              size="small"
                              sx={{
                                height: 20,
                                minWidth: 20,
                                '& .MuiChip-label': { px: 0.75, fontSize: '0.7rem' },
                              }}
                            />
                          </Stack>
                        </ToggleButton>
                        <ToggleButton value="blocks">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Icon icon="solar:widget-5-bold-duotone" width={18} />
                            <span>Bloques</span>
                            <Chip
                              label={completedTasks.length}
                              size="small"
                              sx={{
                                height: 20,
                                minWidth: 20,
                                '& .MuiChip-label': { px: 0.75, fontSize: '0.7rem' },
                              }}
                            />
                          </Stack>
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </Box>

                    <Box sx={{ px: 2, pb: 2 }}>
                      <Stack spacing={2.5}>
                        {/* Comunicados completados */}
                        {(activeFilter === 'all' || activeFilter === 'newsletters') &&
                          completedNewsletters.length > 0 && (
                            <>
                              {activeFilter === 'all' && (
                                <Box sx={{ pt: 1.5 }}>
                                  <Typography
                                    variant="overline"
                                    color="text.secondary"
                                    sx={{ fontWeight: 600, letterSpacing: 1.2 }}
                                  >
                                    Comunicados completados
                                  </Typography>
                                </Box>
                              )}
                              <Stack spacing={2}>
                                {completedNewsletters.map(([newsletterId, newsletterTasks]) =>
                                  renderNewsletterCard(newsletterId, newsletterTasks)
                                )}
                              </Stack>
                            </>
                          )}

                        {/* Bloques Web completados */}
                        {(activeFilter === 'all' || activeFilter === 'blocks') &&
                          completedTasks.length > 0 && (
                            <>
                              {activeFilter === 'all' && completedNewsletters.length > 0 && (
                                <Box sx={{ pt: 1.5 }}>
                                  <Typography
                                    variant="overline"
                                    color="text.secondary"
                                    sx={{ fontWeight: 600, letterSpacing: 1.2 }}
                                  >
                                    Bloques Web completados
                                  </Typography>
                                </Box>
                              )}
                              <Stack spacing={2}>
                                {completedTasks.map((task) => renderCompletedTaskCard(task))}
                              </Stack>
                            </>
                          )}
                      </Stack>
                    </Box>
                  </>
                )}
              </>
            )}

            {/* TAB 2: CON ERROR */}
            {activeTab === 2 && (
              <>
                {totalErrors === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Icon
                      icon="solar:check-circle-bold-duotone"
                      width={64}
                      style={{ color: '#10B981' }}
                    />
                    <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                      No hay tareas con error
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      ¡Todas las tareas están funcionando bien!
                    </Typography>
                  </Box>
                ) : (
                  <>
                    {/* Toggle de filtros - Siempre visible */}
                    <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
                      <ToggleButtonGroup
                        value={activeFilter}
                        exclusive
                        onChange={handleFilterChange}
                        fullWidth
                        size="small"
                        sx={{
                          '& .MuiToggleButton-root': {
                            py: 1,
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '0.8125rem',
                            border: '1px solid',
                            borderColor: 'divider',
                            '&.Mui-selected': {
                              bgcolor: 'error.main',
                              color: 'error.contrastText',
                              '&:hover': {
                                bgcolor: 'error.dark',
                              },
                            },
                          },
                        }}
                      >
                        <ToggleButton value="all">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Icon icon="solar:list-bold-duotone" width={18} />
                            <span>Todos</span>
                            <Chip
                              label={totalErrors}
                              size="small"
                              sx={{
                                height: 20,
                                minWidth: 20,
                                '& .MuiChip-label': { px: 0.75, fontSize: '0.7rem' },
                              }}
                            />
                          </Stack>
                        </ToggleButton>
                        <ToggleButton value="newsletters">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Icon icon="solar:document-text-bold-duotone" width={18} />
                            <span>Comunicados</span>
                            <Chip
                              label={errorNewsletters.length}
                              size="small"
                              sx={{
                                height: 20,
                                minWidth: 20,
                                '& .MuiChip-label': { px: 0.75, fontSize: '0.7rem' },
                              }}
                            />
                          </Stack>
                        </ToggleButton>
                        <ToggleButton value="blocks">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Icon icon="solar:widget-5-bold-duotone" width={18} />
                            <span>Bloques</span>
                            <Chip
                              label={errorTasks.length}
                              size="small"
                              sx={{
                                height: 20,
                                minWidth: 20,
                                '& .MuiChip-label': { px: 0.75, fontSize: '0.7rem' },
                              }}
                            />
                          </Stack>
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </Box>

                    <Box sx={{ px: 2, pb: 2 }}>
                      <Stack spacing={2.5}>
                        {/* Comunicados con error */}
                        {(activeFilter === 'all' || activeFilter === 'newsletters') &&
                          errorNewsletters.length > 0 && (
                            <>
                              {activeFilter === 'all' && (
                                <Box sx={{ pt: 1.5 }}>
                                  <Typography
                                    variant="overline"
                                    color="text.secondary"
                                    sx={{ fontWeight: 600, letterSpacing: 1.2 }}
                                  >
                                    Comunicados con error
                                  </Typography>
                                </Box>
                              )}
                              <Stack spacing={2}>
                                {errorNewsletters.map(([newsletterId, newsletterTasks]) =>
                                  renderErrorNewsletterCard(newsletterId, newsletterTasks)
                                )}
                              </Stack>
                            </>
                          )}

                        {/* Bloques Web con error */}
                        {(activeFilter === 'all' || activeFilter === 'blocks') &&
                          errorTasks.length > 0 && (
                            <>
                              {activeFilter === 'all' && errorNewsletters.length > 0 && (
                                <Box sx={{ pt: 1.5 }}>
                                  <Typography
                                    variant="overline"
                                    color="text.secondary"
                                    sx={{ fontWeight: 600, letterSpacing: 1.2 }}
                                  >
                                    Bloques Web con error
                                  </Typography>
                                </Box>
                              )}
                              <Stack spacing={2}>
                                {errorTasks.map((task) => renderErrorTaskCard(task))}
                              </Stack>
                            </>
                          )}
                      </Stack>
                    </Box>
                  </>
                )}
              </>
            )}
          </>
        )}
      </Box>
    </Drawer>
  );
}
