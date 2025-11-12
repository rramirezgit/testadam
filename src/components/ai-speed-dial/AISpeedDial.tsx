'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';

import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';

import useTaskManagerStore from 'src/store/TaskManagerStore';

import AINoteModal from 'src/components/newsletter-note/ai-creation/AINoteModal';
import AINewsletterModal from 'src/components/newsletter-note/ai-creation/AINewsletterModal';

import TasksDrawer from './TasksDrawer';

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function AISpeedDial() {
  const [open, setOpen] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [showTasksDrawer, setShowTasksDrawer] = useState(false);

  // Suscribirse directamente a tasks para actualización en tiempo real
  const tasks = useTaskManagerStore((state) => state.tasks);

  // Filtrar tareas activas localmente
  const activeTasks = tasks.filter(
    (t) => t.status !== 'COMPLETED' && t.status !== 'ERROR' && t.status !== 'FAILED'
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateNote = () => {
    setShowNoteModal(true);
    handleClose();
  };

  const handleCreateNewsletter = () => {
    setShowNewsletterModal(true);
    handleClose();
  };

  const handleViewTasks = () => {
    setShowTasksDrawer(true);
  };

  const actions = [
    {
      icon: <Icon icon="solar:magic-stick-3-bold" width={24} />,
      name: 'Crear Nota con IA',
      onClick: handleCreateNote,
    },
    {
      icon: <Icon icon="solar:document-text-bold" width={24} />,
      name: 'Crear Newsletter con IA',
      onClick: handleCreateNewsletter,
    },
  ];

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: (theme) => theme.zIndex.speedDial,
        }}
      >
        <SpeedDial
          ariaLabel="AI Actions"
          icon={
            <Badge
              badgeContent={activeTasks.length}
              color="primary"
              invisible={activeTasks.length === 0}
              sx={{
                '& .MuiBadge-badge': {
                  top: -4,
                  right: -4,
                },
              }}
            >
              <SpeedDialIcon />
            </Badge>
          }
          onClose={(event, reason) => {
            // Solo cerrar si es por el backdrop, no por blur/mouseLeave
            if (reason === 'toggle' || reason === 'blur' || reason === 'mouseLeave') {
              return;
            }
            handleClose();
          }}
          onOpen={handleOpen}
          open={open}
          FabProps={{
            onClick: () => {
              if (!open) {
                handleOpen();
              } else {
                handleClose();
              }
            },
            sx: {
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            },
          }}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.onClick}
            />
          ))}

          {/* Acción especial para ver tareas si hay alguna */}
          {tasks.length > 0 && (
            <SpeedDialAction
              icon={
                <Badge badgeContent={tasks.length} color="primary">
                  <Icon icon="solar:list-check-bold" width={24} />
                </Badge>
              }
              tooltipTitle="Ver Tareas de IA"
              onClick={() => {
                handleViewTasks();
                handleClose();
              }}
            />
          )}
        </SpeedDial>
      </Box>

      {/* Modal para crear nota */}
      <AINoteModal
        open={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        // Ya no necesita onInjectAIData porque no inyecta directamente
        onInjectAIData={() => {
          // No hace nada, el modal solo registra la tarea
        }}
      />

      {/* Modal para crear newsletter */}
      <AINewsletterModal open={showNewsletterModal} onClose={() => setShowNewsletterModal(false)} />

      {/* Drawer para ver tareas */}
      <TasksDrawer open={showTasksDrawer} onClose={() => setShowTasksDrawer(false)} />
    </>
  );
}
