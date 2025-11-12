'use client';

import { useEffect } from 'react';

import useTaskManagerStore from 'src/store/TaskManagerStore';

import { AISpeedDial } from 'src/components/ai-speed-dial';

import { AuthGuard } from 'src/auth/guard';

// ============================================================================

type NewLayoutProps = {
  children: React.ReactNode;
};

export default function NewLayout({ children }: NewLayoutProps) {
  // Recuperar tareas de IA al montar el layout
  const recoverTasksFromStorage = useTaskManagerStore((state) => state.recoverTasksFromStorage);
  const stopAllPolling = useTaskManagerStore((state) => state.stopAllPolling);

  useEffect(() => {
    // Recuperar tareas pendientes desde localStorage
    recoverTasksFromStorage();

    // Cleanup: detener todos los polling al desmontar
    return () => {
      stopAllPolling();
    };
  }, [recoverTasksFromStorage, stopAllPolling]);

  return (
    <AuthGuard>
      {children}
      <AISpeedDial />
    </AuthGuard>
  );
}
