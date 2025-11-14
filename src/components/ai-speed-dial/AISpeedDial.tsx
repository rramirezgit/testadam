'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';

import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import { keyframes } from '@mui/system';
import Tooltip from '@mui/material/Tooltip';
import SpeedDial from '@mui/material/SpeedDial';
import Typography from '@mui/material/Typography';
import SpeedDialAction from '@mui/material/SpeedDialAction';

import { CONFIG } from 'src/global-config';
import useTaskManagerStore from 'src/store/TaskManagerStore';

import AINoteModal from 'src/components/newsletter-note/ai-creation/AINoteModal';
import AINewsletterModal from 'src/components/newsletter-note/ai-creation/AINewsletterModal';

import TasksDrawer from './TasksDrawer';
import { SvgColor } from '../svg-color';

// ============================================================================
// ANIMACIONES
// ============================================================================

const rotateGradient = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
`;

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

  // Filtrar solo tareas en progreso (no completadas ni con error)
  const activeTasks = tasks.filter(
    (t) => t.status !== 'COMPLETED' && t.status !== 'ERROR' && t.status !== 'FAILED'
  );
  const hasActiveTasks = activeTasks.length > 0;

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
      icon: <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/ic-bloque-web.svg`} />,
      name: 'Crear Bloque Web con IA',
      onClick: handleCreateNote,
    },
    {
      icon: <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/ic-comunicado.svg`} />,
      name: 'Crear Comunicado con IA',
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
            <Tooltip title={hasActiveTasks ? 'Tarea en proceso' : ''} placement="left" arrow>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  userSelect: 'none',
                  ...(hasActiveTasks && {
                    animation: `${pulse} 2s ease-in-out infinite`,
                  }),
                }}
              >
                IA
              </Typography>
            </Tooltip>
          }
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
              ...(hasActiveTasks && {
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -4,
                  left: -4,
                  right: -4,
                  bottom: -4,
                  borderRadius: '50%',
                  padding: '3px',
                  background:
                    'conic-gradient(from 0deg, #10b981, #84cc16, #fbbf24, #f97316, #10b981)',
                  animation: `${rotateGradient} 3s linear infinite`,
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  zIndex: -1,
                },
              }),
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
