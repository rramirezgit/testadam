'use client';

import type { SavedNote } from 'src/types/saved-note';

import Image from 'next/image';
import { Icon } from '@iconify/react';
import { useState, useCallback } from 'react';

import {
  Box,
  Menu,
  Chip,
  Stack,
  Alert,
  AppBar,
  Button,
  Dialog,
  Toolbar,
  Tooltip,
  MenuItem,
  useTheme,
  TextField,
  Typography,
  IconButton,
  DialogTitle,
  ToggleButton,
  ListItemIcon,
  ListItemText,
  DialogContent,
  DialogActions,
  ToggleButtonGroup,
  DialogContentText,
} from '@mui/material';

import usePostStore from 'src/store/PostStore';

import SendTestDialog from './send-test-dialog';
import EditorialAnalysisModal from './components/EditorialAnalysisModal';

interface EditorHeaderProps {
  onClose: () => void;
  isEditingExistingNote: boolean;
  initialNote?: SavedNote | null;
  activeVersion: 'newsletter' | 'web';
  activeTemplate: string;
  handleVersionChange: (newVersion: 'newsletter' | 'web') => void;
  onSave: () => void;
  syncEnabled?: boolean;
  toggleSync?: () => void;
  transferToWeb?: () => void;
  transferToNewsletter?: () => void;
  noteStatus: string;
  isNewsletterMode?: boolean;
  onGenerateNewsletterHtml?: () => void;
  onToggleNewsletterView?: () => void;
  showNewsletterPreview?: boolean;
  generatingNewsletterHtml?: boolean;
  newsletterNotesCount?: number;
  newsletterList?: any[];
  currentNewsletterId?: string;
  saving?: boolean;
  setOpenSendDialog?: (open: boolean) => void;
  setOpenAprob?: (open: boolean) => void;
  setOpenSchedule?: (open: boolean) => void;
  setOpenSendSubs?: (open: boolean) => void;
  htmlContent?: string;
  onGenerateHtml?: () => Promise<string>;
  // Nueva prop para el título del newsletter
  newsletterTitle?: string;
  // Nueva prop para obtener componentes activos
  getActiveComponents?: () => any[];
  // Nueva prop para actualizar el ID del newsletter después de guardarlo
  onNewsletterIdChange?: (id: string) => void;
  // Nueva prop para la imagen de portada del newsletter
  noteCoverImageUrl?: string;
  // Nueva prop para el ID de la nota actual
  currentNoteId?: string | null;
  // Nueva prop para mostrar notificaciones
  showNotification?: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
  // Nuevas props para el status del newsletter y actualización
  newsletterStatus?: string;
  onNewsletterUpdate?: () => void;
  // Props para modo view-only
  isViewOnly?: boolean;
  onCreateCopy?: () => void;
  // Props para preview HTML
  showPreview?: boolean;
  onTogglePreview?: () => void;
  newsletterHtmlPreview?: string;
}

export default function EditorHeader({
  onClose,
  isEditingExistingNote,
  initialNote,
  activeVersion,
  activeTemplate,
  handleVersionChange,
  onSave,
  syncEnabled = false,
  toggleSync = () => {},
  transferToWeb = () => {},
  transferToNewsletter = () => {},
  noteStatus,
  isNewsletterMode = false,
  onGenerateNewsletterHtml = () => {},
  onToggleNewsletterView = () => {},
  showNewsletterPreview = false,
  generatingNewsletterHtml = false,
  newsletterNotesCount = 0,
  newsletterList,
  currentNewsletterId,
  saving,
  setOpenSendDialog,
  setOpenAprob,
  setOpenSchedule,
  setOpenSendSubs,
  htmlContent,
  onGenerateHtml,
  newsletterTitle = '',
  getActiveComponents = () => [],
  onNewsletterIdChange = () => {},
  noteCoverImageUrl = '',
  currentNoteId = null,
  showNotification = () => {},
  newsletterStatus = '',
  onNewsletterUpdate = () => {},
  isViewOnly = false,
  onCreateCopy = () => {},
  showPreview = false,
  onTogglePreview = () => {},
  newsletterHtmlPreview = '',
}: EditorHeaderProps) {
  // Estado para el menú de transferencia
  const [transferMenuAnchor, setTransferMenuAnchor] = useState<null | HTMLElement>(null);
  const openTransferMenu = Boolean(transferMenuAnchor);

  // Estado para el menú de envío
  const [sendMenuAnchor, setSendMenuAnchor] = useState<null | HTMLElement>(null);
  const openSendMenu = Boolean(sendMenuAnchor);

  // Estado para el modal de análisis editorial
  const [openEditorialAnalysis, setOpenEditorialAnalysis] = useState(false);

  // Estado para el modal de prueba
  const [openTestDialog, setOpenTestDialog] = useState(false);

  // Estado para el modal de error del título
  const [openTitleErrorDialog, setOpenTitleErrorDialog] = useState(false);

  // Estados para los modales del flujo de newsletter
  const [openApprovalDialog, setOpenApprovalDialog] = useState(false);
  const [openSendNowDialog, setOpenSendNowDialog] = useState(false);
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [approverEmails] = useState(['97.rramirez@gmail.com']); // Email predeterminado

  const theme = useTheme();

  // Hook del store
  const {
    createNewsletter,
    updateNewsletter,
    sendEmail,
    sendNewsletterNow,
    scheduleNewsletter,
    findNewsletterById,
    requestNewsletterApproval,
    sendNewsletterForReview,
  } = usePostStore();

  // Necesitamos acceder a los componentes del newsletter desde el editor
  // Esta función debería ser pasada como prop desde el componente padre
  const getNewsletterComponents = () => {
    // En modo newsletter, obtener los componentes activos del editor
    // como se hace en las notas normales
    if (isNewsletterMode) {
      // Obtener los componentes activos del editor
      const activeComponents = getActiveComponents();

      console.log('📊 Newsletter Components from Editor:', {
        totalComponents: activeComponents.length,
        componentTypes: activeComponents.map((c) => ({ id: c.id, type: c.type })),
        template: activeTemplate,
        version: activeVersion,
      });

      return activeComponents;
    }

    // Para modo no-newsletter, usar newsletterList como antes
    return (
      newsletterList
        ?.map((note) => {
          try {
            return {
              noteId: note.id,
              title: note.title,
              objData: note.objData || '[]',
              objDataWeb: note.objDataWeb || '[]',
              configPost: note.configPost || '{}',
            };
          } catch (error) {
            console.error('Error parsing note data:', error);
            return null;
          }
        })
        .filter(Boolean) || []
    );
  };

  // Función para deshabilitar opciones del menú de envío
  const disableOption = useCallback(
    (option: 'Prueba' | 'Aprobacion' | 'Subscriptores' | 'schedule') => {
      if (saving) {
        return true;
      }

      // Usar newsletterStatus prop directamente
      const status = newsletterStatus || 'DRAFT';

      // Prueba: siempre activo
      if (option === 'Prueba') {
        return false;
      }

      // Aprobación: disabled cuando está APPROVED, PENDING_APPROVAL, SENDED
      if (option === 'Aprobacion') {
        if (status === 'APPROVED' || status === 'PENDING_APPROVAL' || status === 'SENDED') {
          return true;
        }
        return false; // Si no está en esos estados, está activo
      }

      // Enviar ahora y Programar: disabled cuando está DRAFT, REJECTED, SENDED, PENDING_APPROVAL
      // También disabled si no existe el newsletter
      if (option === 'Subscriptores' || option === 'schedule') {
        if (!currentNewsletterId) {
          return true; // Si no existe el newsletter, disabled
        }

        if (
          status === 'DRAFT' ||
          status === 'REJECTED' ||
          status === 'SENDED' ||
          status === 'PENDING_APPROVAL'
        ) {
          return true;
        }
        return false; // Solo activo cuando está APPROVED o SCHEDULED
      }

      return false;
    },
    [currentNewsletterId, newsletterStatus, saving]
  );

  // Abrir el menú de transferencia
  const handleTransferMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTransferMenuAnchor(event.currentTarget);
  };

  // Cerrar el menú de transferencia
  const handleTransferMenuClose = () => {
    setTransferMenuAnchor(null);
  };

  // Abrir el menú de envío
  const handleSendMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSendMenuAnchor(event.currentTarget);
  };

  // Cerrar el menú de envío
  const handleSendMenuClose = () => {
    setSendMenuAnchor(null);
  };

  // Función para manejar el envío de pruebas
  const handleSendTest = async (emails: string[]) => {
    try {
      let content = htmlContent;

      // Si no hay contenido HTML, intentar generarlo
      if (!content && onGenerateHtml) {
        content = await onGenerateHtml();
      }

      if (!content) {
        console.error('❌ No se pudo generar el contenido HTML');
        throw new Error('No se pudo generar el contenido HTML');
      }

      if (isNewsletterMode) {
        // Para newsletters, solo enviar si está guardado
        if (!currentNewsletterId || currentNewsletterId.trim() === '') {
          console.error('❌ No se puede enviar un newsletter que no ha sido guardado');
          throw new Error('Debes guardar el newsletter antes de enviarlo');
        }

        // Enviar newsletter existente para revisión
        await sendNewsletterForReview(currentNewsletterId, emails, content);
      } else if (currentNoteId) {
        // Enviar post para revisión (nota existente)
        await sendEmail(currentNoteId, emails, content);
      }

      // else {
      //   // Enviar prueba de nota nueva (sin ID todavía)
      //   // Crear un objeto temporal para el envío
      //   const tempNote = {
      //     id: `temp_${Date.now()}`, // ID temporal
      //     title: initialNote?.title || 'Nueva Nota',
      //     content,
      //   };
      //   await sendPostForReview(tempNote.id, emails, content);
      //   console.log('✅ Prueba de nota nueva enviada exitosamente');
      // }
    } catch (error) {
      console.error('❌ Error enviando prueba:', error);
      throw error;
    }
  };

  // Función wrapper para guardar y luego abrir diálogo de envío (para newsletters)
  const handleSaveAndOpenDialog = async (
    dialogType: 'test' | 'approval' | 'schedule' | 'sendNow'
  ) => {
    try {
      console.log('💾 Guardando newsletter antes de enviar...');

      // Primero guardar el newsletter
      await handleSaveNewsletter();

      console.log('✅ Newsletter guardado, abriendo diálogo de:', dialogType);

      // Luego abrir el diálogo correspondiente
      handleSendMenuClose();

      switch (dialogType) {
        case 'test':
          setOpenTestDialog(true);
          break;
        case 'approval':
          setOpenAprob?.(true);
          break;
        case 'schedule':
          setOpenSchedule?.(true);
          break;
        case 'sendNow':
          setOpenSendSubs?.(true);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('❌ Error guardando newsletter antes de enviar:', error);
      handleSendMenuClose();
      // No abrir el diálogo si hubo error al guardar
    }
  };

  // Función para guardar nota normal antes de enviar
  const handleSaveNoteAndOpenDialog = () => {
    try {
      console.log('💾 Guardando nota antes de enviar...');

      // Guardar la nota (onSave es síncrono)
      onSave();

      console.log('✅ Nota guardada, abriendo diálogo de prueba');

      // Abrir el diálogo de prueba
      handleSendMenuClose();
      setOpenTestDialog(true);
    } catch (error) {
      console.error('❌ Error guardando nota antes de enviar:', error);
      handleSendMenuClose();
    }
  };

  // Función para guardar newsletter
  const handleSaveNewsletter = async () => {
    try {
      console.log('🔄 handleSaveNewsletter called:', {
        isNewsletterMode,
        hasOnGenerateHtml: !!onGenerateHtml,
        hasHtmlContent: !!htmlContent,
      });

      if (!isNewsletterMode) {
        console.log('❌ No es modo newsletter, usando onSave');
        onSave();
        return;
      }

      // Generar HTML si no está disponible
      let content = htmlContent;
      if (!content && onGenerateHtml) {
        console.log('📝 Generando HTML para guardar...');
        content = await onGenerateHtml();
        console.log('✅ HTML generado para guardar:', {
          contentLength: content?.length,
          contentPreview: content?.substring(0, 200) + '...',
        });
      }

      if (!content) {
        console.error('❌ No se pudo generar el contenido HTML para guardar');
        throw new Error('No se pudo generar el contenido HTML para guardar');
      }

      // Obtener los componentes activos del newsletter (objData)
      const newsletterComponents = getNewsletterComponents();

      // Validar que el título sea obligatorio
      if (!newsletterTitle || !newsletterTitle.trim()) {
        setOpenTitleErrorDialog(true);
        return;
      }

      const subject = newsletterTitle.trim();

      // Preparar objData para guardar
      const objDataString = JSON.stringify(newsletterComponents);

      // Filtrar noteContainers para debugging
      const noteContainers = newsletterComponents.filter((c: any) => c.type === 'noteContainer');

      // Log detallado de la estructura de datos
      console.log('📋 Estructura de datos del newsletter a guardar:', {
        subject,
        contentLength: content.length,
        objDataLength: objDataString.length,
        componentsCount: newsletterComponents.length,
        noteContainersCount: noteContainers.length,
        allComponentTypes: newsletterComponents.map((c: any) => ({ id: c.id, type: c.type })),
        noteContainersDetail: noteContainers.map((n: any) => ({
          id: n.id,
          title: n.props?.noteTitle,
          componentsCount: n.props?.componentsData?.length || 0,
          hasComponentsData: !!n.props?.componentsData,
        })),
      });

      console.log('📤 Guardando newsletter:', {
        subject,
        currentNewsletterId,
        isUpdate: !!(currentNewsletterId && currentNewsletterId.trim()),
        contentLength: content.length,
        objDataLength: objDataString.length,
        componentsCount: newsletterComponents.length,
      });

      // Verificar si es actualización o creación
      const isExistingNewsletter = currentNewsletterId && currentNewsletterId.trim() !== '';

      if (isExistingNewsletter) {
        // ✅ ACTUALIZAR newsletter existente
        console.log('🔄 Actualizando newsletter existente:', currentNewsletterId);

        const updateData = {
          subject,
          content,
          objData: objDataString,
          coverImageUrl: noteCoverImageUrl || '',
        };

        console.log('📤 PUT /newsletters/{id} - Datos para actualización:', {
          newsletterId: currentNewsletterId,
          subject,
          contentLength: updateData.content.length,
          objDataLength: updateData.objData.length,
          coverImageUrl: updateData.coverImageUrl,
        });

        const updateResult = await updateNewsletter(currentNewsletterId, updateData);

        if (updateResult) {
          console.log('✅ Newsletter actualizado exitosamente:', updateResult);
          showNotification('Newsletter actualizado correctamente', 'success');
        } else {
          console.error('❌ Error al actualizar newsletter');
          throw new Error('Error al actualizar newsletter');
        }
      } else {
        // ✅ CREAR newsletter nuevo (flujo de 2 pasos)
        console.log('📝 Creando newsletter nuevo (POST + PUT)');

        // PASO 1: POST - Solo subject, content y coverImageUrl
        const createData = {
          subject,
          content, // HTML completo del newsletter
          coverImageUrl: noteCoverImageUrl || '',
        };

        console.log('📤 PASO 1: POST /newsletters - Crear newsletter:', {
          subject: createData.subject,
          contentLength: createData.content.length,
          coverImageUrl: createData.coverImageUrl,
        });

        const result = await createNewsletter(subject, createData);

        if (result && result.id) {
          console.log('✅ PASO 1 completado - Newsletter creado con ID:', result.id);

          // Actualizar el ID del newsletter en el componente padre
          onNewsletterIdChange(result.id);

          // PASO 2: PUT - Agregar objData
          console.log('📤 PASO 2: PUT /newsletters/{id} - Agregar objData');

          const updateData = {
            subject, // Mantener el subject
            objData: objDataString,
          };

          console.log('📤 Datos para PASO 2:', {
            newsletterId: result.id,
            subject: updateData.subject,
            objDataLength: updateData.objData.length,
          });

          const updateResult = await updateNewsletter(result.id, updateData);

          if (updateResult) {
            console.log('✅ PASO 2 completado - objData guardado exitosamente:', updateResult);
            showNotification('Newsletter guardado correctamente', 'success');
          } else {
            console.warn('⚠️ PASO 2 falló - Newsletter creado pero objData no guardado');
            showNotification('Newsletter creado, pero algunos datos no se guardaron', 'warning');
            // No lanzar error aquí, el newsletter ya se creó
          }
        } else {
          console.error('❌ PASO 1 falló - Error al crear newsletter');
          throw new Error('Error al crear newsletter');
        }
      }
    } catch (error) {
      console.error('❌ Error guardando newsletter:', error);
      throw error;
    }
  };

  // Handler para solicitar aprobación
  const handleRequestApproval = async () => {
    try {
      console.log('🔄 Solicitando aprobación del newsletter...');

      // Validar que el newsletter esté guardado
      if (!currentNewsletterId || currentNewsletterId.trim() === '') {
        showNotification('Debes guardar el newsletter antes de solicitar aprobación', 'error');
        return;
      }

      // Generar HTML si no está disponible
      let content = htmlContent;
      if (!content && onGenerateHtml) {
        console.log('📝 Generando HTML para aprobación...');
        content = await onGenerateHtml();
      }

      if (!content) {
        console.error('❌ No se pudo generar el contenido HTML');
        throw new Error('No se pudo generar el contenido HTML');
      }

      // Enviar solicitud de aprobación con el endpoint correcto
      await requestNewsletterApproval(
        currentNewsletterId,
        approverEmails,
        newsletterTitle,
        content
      );

      // Recargar newsletter para obtener el estado actualizado
      await findNewsletterById(currentNewsletterId);

      // Llamar al callback para actualizar el estado en el componente padre
      if (onNewsletterUpdate) {
        onNewsletterUpdate();
      }

      showNotification('Solicitud de aprobación enviada correctamente', 'success');
      setOpenApprovalDialog(false);
    } catch (error) {
      console.error('❌ Error al solicitar aprobación:', error);
      showNotification('Error al solicitar aprobación', 'error');
    }
  };

  // Handler para enviar ahora
  const handleSendNow = async () => {
    try {
      console.log('🔄 Enviando newsletter ahora...');

      // Generar HTML si no está disponible
      let content = htmlContent;
      if (!content && onGenerateHtml) {
        console.log('📝 Generando HTML para envío...');
        content = await onGenerateHtml();
      }

      if (!content) {
        console.error('❌ No se pudo generar el contenido HTML');
        throw new Error('No se pudo generar el contenido HTML');
      }

      // Enviar newsletter
      await sendNewsletterNow(currentNewsletterId || '', newsletterTitle, content);

      // Recargar newsletter para obtener el estado actualizado
      if (currentNewsletterId) {
        await findNewsletterById(currentNewsletterId);
      }

      // Llamar al callback para actualizar el estado en el componente padre
      if (onNewsletterUpdate) {
        onNewsletterUpdate();
      }

      showNotification('Newsletter enviado a todos los suscriptores', 'success');
      setOpenSendNowDialog(false);
    } catch (error) {
      console.error('❌ Error al enviar newsletter:', error);
      showNotification('Error al enviar el newsletter', 'error');
    }
  };

  // Handler para programar envío
  const handleSchedule = async () => {
    try {
      console.log('🔄 Programando newsletter...', { scheduleDate });

      // Validar que la fecha sea futura
      const scheduledTime = new Date(scheduleDate).getTime();
      const now = new Date().getTime();

      if (scheduledTime <= now) {
        showNotification('La fecha debe ser futura', 'error');
        return;
      }

      // Generar HTML si no está disponible
      let content = htmlContent;
      if (!content && onGenerateHtml) {
        console.log('📝 Generando HTML para programación...');
        content = await onGenerateHtml();
      }

      if (!content) {
        console.error('❌ No se pudo generar el contenido HTML');
        throw new Error('No se pudo generar el contenido HTML');
      }

      // Programar newsletter (convertir a ISO string)
      const isoDate = new Date(scheduleDate).toISOString();
      await scheduleNewsletter(currentNewsletterId || '', isoDate, newsletterTitle, content);

      // Recargar newsletter para obtener el estado actualizado
      if (currentNewsletterId) {
        await findNewsletterById(currentNewsletterId);
      }

      // Llamar al callback para actualizar el estado en el componente padre
      if (onNewsletterUpdate) {
        onNewsletterUpdate();
      }

      showNotification('Newsletter programado correctamente', 'success');
      setOpenScheduleDialog(false);
      setScheduleDate(''); // Limpiar fecha
    } catch (error) {
      console.error('❌ Error al programar newsletter:', error);
      showNotification('Error al programar el newsletter', 'error');
    }
  };

  return (
    <>
      <AppBar
        position="static"
        color="default"
        elevation={1}
        sx={{
          p: 1,
          pl: 2,
          pr: 2,
          minHeight: '56px',
          background: `linear-gradient(180deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.40) 53.15%, rgba(255, 255, 255, 0.60) 107.22%)`,
        }}
      >
        <Toolbar
          sx={{
            borderRadius: '16px',
            '&::before': theme.mixins.borderGradient({
              padding: '1.5px',
              color: `linear-gradient(to bottom, #FFFFFF, #C6C6FF61)`,
            }),
          }}
        >
          <IconButton onClick={onClose} sx={{ borderRadius: '8px', border: '1px solid #C4CDD520' }}>
            <Icon icon="mingcute:left-line" />
          </IconButton>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '250px',
              fontSize: '14px',
              marginLeft: '15px',
              fontWeight: 500,
              color: newsletterTitle && newsletterTitle.trim() !== '' ? '#1C252E' : '#7F8C8D',
            }}
          >
            {isNewsletterMode
              ? newsletterTitle || 'Nuevo Newsletter'
              : initialNote?.title || 'Nota sin título'}
          </Typography>

          {/* Selector de versión Web/Newsletter - Para templates con ambas versiones */}
          {activeTemplate === 'news' ||
          activeTemplate === 'market' ||
          activeTemplate === 'skillup' ||
          activeTemplate === 'howto' ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mx: 2,
                flexGrow: 1,
                justifyContent: 'center',
              }}
            >
              <ToggleButtonGroup
                value={activeVersion}
                exclusive
                color="primary"
                onChange={(e, newValue) => {
                  if (newValue !== null) {
                    handleVersionChange(newValue);
                  }
                }}
                sx={{
                  border: 'none',
                  gap: 2,
                }}
                aria-label="Versión del contenido"
                size="small"
              >
                <ToggleButton value="web" aria-label="web version">
                  <Image src="/assets/icons/apps/ic-notes.svg" alt="web" width={20} height={20} />
                  Web
                </ToggleButton>
                <ToggleButton value="newsletter" aria-label="newsletter version">
                  <Image
                    src="/assets/icons/apps/ic-news.svg"
                    alt="newsletter"
                    width={20}
                    height={20}
                  />
                  Newsletter
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 1 }} />
          )}

          {/* Indicador de sincronización - Solo para template 'news' y 'market' */}
          {(activeTemplate === 'news' || activeTemplate === 'market') && syncEnabled && (
            <Tooltip title="Sincronización automática activa: Se sincroniza solo el contenido">
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mr: 1,
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  backgroundColor: 'info.light',
                  color: 'info.dark',
                }}
              >
                <Icon icon="mdi:sync" style={{ fontSize: '16px', marginRight: '4px' }} />
                <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                  Sync
                </Typography>
              </Box>
            </Tooltip>
          )}

          {/* Botón de transferencia con menú desplegable - Solo para template 'news' y 'market' */}
          {(activeTemplate === 'news' || activeTemplate === 'market') && (
            <Tooltip title="Transferir y sincronizar contenido entre versiones">
              <IconButton
                color="primary"
                onClick={handleTransferMenuClick}
                sx={{
                  mr: 2,
                  backgroundColor: syncEnabled ? 'info.light' : 'transparent',
                }}
                aria-controls={openTransferMenu ? 'transfer-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openTransferMenu ? 'true' : undefined}
              >
                <Icon icon="mingcute:transfer-line" />
              </IconButton>
            </Tooltip>
          )}

          {/* Menú de transferencia - Solo para template 'news' y 'market' */}
          {(activeTemplate === 'news' || activeTemplate === 'market') && (
            <Menu
              id="transfer-menu"
              anchorEl={transferMenuAnchor}
              open={openTransferMenu}
              onClose={handleTransferMenuClose}
              MenuListProps={{
                'aria-labelledby': 'transfer-button',
              }}
              PaperProps={{
                sx: { minWidth: '280px' },
              }}
            >
              {/* Sección: Copiar solo contenido */}
              <Typography
                variant="overline"
                sx={{ px: 2, py: 1, color: 'text.secondary', fontSize: '0.75rem' }}
              >
                Copiar solo contenido
              </Typography>
              <MenuItem
                onClick={() => {
                  transferToNewsletter();
                  handleTransferMenuClose();
                }}
                disabled={activeVersion === 'newsletter'}
              >
                <ListItemIcon>
                  <Icon icon="mdi:content-copy" />
                </ListItemIcon>
                <ListItemText
                  primary="Copiar contenido a Newsletter"
                  secondary="Solo el texto de componentes existentes"
                />
              </MenuItem>
              <MenuItem
                onClick={() => {
                  transferToWeb();
                  handleTransferMenuClose();
                }}
                disabled={activeVersion === 'web'}
              >
                <ListItemIcon>
                  <Icon icon="mdi:content-copy" />
                </ListItemIcon>
                <ListItemText
                  primary="Copiar contenido a Web"
                  secondary="Solo el texto de componentes existentes"
                />
              </MenuItem>

              <Box sx={{ my: 1, mx: 2, borderTop: '1px solid', borderColor: 'divider' }} />

              {/* Sección: Sincronización */}
              <Typography
                variant="overline"
                sx={{ px: 2, py: 1, color: 'text.secondary', fontSize: '0.75rem' }}
              >
                Sincronización automática
              </Typography>
              <MenuItem
                onClick={() => {
                  toggleSync();
                  handleTransferMenuClose();
                }}
              >
                <ListItemIcon>
                  <Icon icon={syncEnabled ? 'mdi:sync-off' : 'mdi:sync'} />
                </ListItemIcon>
                <ListItemText
                  primary={syncEnabled ? 'Desactivar sincronización' : 'Activar sincronización'}
                  secondary="Solo actualiza el contenido de componentes existentes"
                />
              </MenuItem>
            </Menu>
          )}

          {isNewsletterMode ? (
            <Stack direction="row" spacing={1}>
              {/* Chip de status del newsletter */}
              <Chip
                variant="outlined"
                sx={{
                  margin: 'auto 0',
                }}
                label={(() => {
                  // Usar newsletterStatus prop directamente en lugar de buscar en newsletterList
                  const status = newsletterStatus || 'DRAFT';

                  return status === 'DRAFT'
                    ? 'Borrador'
                    : status === 'PENDING_APPROVAL'
                      ? 'Pendiente Aprobación'
                      : status === 'APPROVED'
                        ? 'Aprobado'
                        : status === 'REJECTED'
                          ? 'Rechazado'
                          : status === 'SCHEDULED'
                            ? 'Programado'
                            : status === 'SENDED'
                              ? 'Enviado'
                              : status === 'DELETED'
                                ? 'Eliminado'
                                : 'Borrador';
                })()}
              />

              {/* Botón de toggle Preview/Editor - Solo en template newsletter editable */}
              {activeTemplate === 'newsletter' && !isViewOnly && (
                <Button
                  variant="outlined"
                  startIcon={<Icon icon={showPreview ? 'mdi:code-tags' : 'mdi:eye'} />}
                  onClick={onTogglePreview}
                  sx={{ height: '42px', mr: 1 }}
                >
                  {showPreview ? 'Editor' : 'Preview'}
                </Button>
              )}

              {/* Botón de Revisión Editorial - Solo visible en modo preview */}
              {activeTemplate === 'newsletter' && showPreview && (
                <Button
                  variant="outlined"
                  startIcon={<Icon icon="mdi:file-document-check" />}
                  onClick={() => setOpenEditorialAnalysis(true)}
                  sx={{ height: '42px', mr: 1 }}
                  color="secondary"
                >
                  Revisión
                </Button>
              )}

              {/* Botón de guardar newsletter - Ocultar en modo view-only */}
              {!isViewOnly && (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ height: '42px' }}
                  startIcon={<Icon icon="material-symbols:save" />}
                  onClick={handleSaveNewsletter}
                  disabled={saving}
                >
                  Guardar
                </Button>
              )}

              {/* Botón de crear copia - Solo en modo view-only */}
              {isViewOnly && (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ height: '42px' }}
                  startIcon={<Icon icon="eva:copy-fill" />}
                  onClick={onCreateCopy}
                >
                  Crear Copia
                </Button>
              )}

              {/* Botón de enviar newsletter - Ocultar en modo view-only */}
              {!isViewOnly && (
                <Tooltip
                  title={
                    !currentNewsletterId || currentNewsletterId.trim() === ''
                      ? 'Debes guardar el newsletter antes de enviarlo'
                      : ''
                  }
                >
                  <span>
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<Icon icon="mdi:chevron-down" />}
                      sx={{ backgroundColor: '#4f46e5', height: '42px' }}
                      onClick={handleSendMenuClick}
                      disabled={!currentNewsletterId || currentNewsletterId.trim() === ''}
                      aria-controls={openSendMenu ? 'send-menu-newsletter' : undefined}
                      aria-haspopup="true"
                      aria-expanded={openSendMenu ? 'true' : undefined}
                    >
                      Enviar
                    </Button>
                  </span>
                </Tooltip>
              )}

              {/* Menú de envío para newsletter */}
              <Menu
                id="send-menu-newsletter"
                anchorEl={sendMenuAnchor}
                open={openSendMenu}
                onClose={handleSendMenuClose}
                MenuListProps={{
                  'aria-labelledby': 'send-newsletter-button',
                }}
                PaperProps={{
                  sx: { minWidth: '200px' },
                }}
              >
                <MenuItem
                  disabled={disableOption('Prueba')}
                  onClick={() => handleSaveAndOpenDialog('test')}
                >
                  <ListItemIcon>
                    <Icon icon="mdi:test-tube" width={24} height={24} />
                  </ListItemIcon>
                  <ListItemText>Prueba</ListItemText>
                </MenuItem>

                <MenuItem
                  disabled={disableOption('Aprobacion')}
                  onClick={() => {
                    handleSendMenuClose();
                    setOpenApprovalDialog(true);
                  }}
                >
                  <ListItemIcon>
                    <Icon icon="mdi:check-circle-outline" width={24} height={24} />
                  </ListItemIcon>
                  <ListItemText>Aprobación</ListItemText>
                </MenuItem>

                <MenuItem
                  disabled={disableOption('schedule')}
                  onClick={() => {
                    handleSendMenuClose();
                    setOpenScheduleDialog(true);
                  }}
                >
                  <ListItemIcon>
                    <Icon icon="material-symbols:schedule-outline" width={24} height={24} />
                  </ListItemIcon>
                  <ListItemText>Programar</ListItemText>
                </MenuItem>

                <MenuItem
                  disabled={disableOption('Subscriptores')}
                  onClick={() => {
                    handleSendMenuClose();
                    setOpenSendNowDialog(true);
                  }}
                >
                  <ListItemIcon>
                    <Icon icon="fluent-mdl2:group" width={24} height={24} />
                  </ListItemIcon>
                  <ListItemText>Enviar ahora</ListItemText>
                </MenuItem>
              </Menu>
            </Stack>
          ) : (
            <Stack direction="row" spacing={1}>
              <Chip
                variant="outlined"
                sx={{
                  margin: 'auto 0',
                }}
                label={
                  noteStatus === 'DRAFT'
                    ? 'Borrador'
                    : noteStatus === 'REVIEW'
                      ? 'En Revisión'
                      : noteStatus === 'APPROVED'
                        ? 'Aprobado'
                        : noteStatus === 'PUBLISHED'
                          ? 'Publicado'
                          : 'Borrador'
                }
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ height: '42px' }}
                startIcon={<Icon icon="material-symbols:save" />}
                onClick={onSave}
              >
                Guardar
              </Button>
              <Tooltip
                title={!isEditingExistingNote ? 'Debes guardar la nota antes de enviarla' : ''}
              >
                <span>
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<Icon icon="mdi:chevron-down" />}
                    sx={{ backgroundColor: '#4f46e5', height: '42px' }}
                    onClick={handleSendMenuClick}
                    disabled={!isEditingExistingNote}
                    aria-controls={openSendMenu ? 'send-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openSendMenu ? 'true' : undefined}
                  >
                    Enviar
                  </Button>
                </span>
              </Tooltip>

              {/* Menú de envío */}
              <Menu
                id="send-menu"
                anchorEl={sendMenuAnchor}
                open={openSendMenu}
                onClose={handleSendMenuClose}
                MenuListProps={{
                  'aria-labelledby': 'send-button',
                }}
                PaperProps={{
                  sx: { minWidth: '200px' },
                }}
              >
                <MenuItem disabled={disableOption('Prueba')} onClick={handleSaveNoteAndOpenDialog}>
                  <ListItemIcon>
                    <Icon icon="mdi:test-tube" width={24} height={24} />
                  </ListItemIcon>
                  <ListItemText>Prueba</ListItemText>
                </MenuItem>

                {/* <MenuItem
                  disabled={disableOption('Aprobacion')}
                  onClick={() => {
                    setOpenAprob?.(true);
                    handleSendMenuClose();
                  }}
                >
                  <ListItemIcon>
                    <Icon icon="mdi:check-circle-outline" width={24} height={24} />
                  </ListItemIcon>
                  <ListItemText>Aprobación</ListItemText>
                </MenuItem> */}

                {/* <MenuItem
                  disabled={disableOption('schedule')}
                  onClick={() => {
                    setOpenSchedule?.(true);
                    handleSendMenuClose();
                  }}
                >
                  <ListItemIcon>
                    <Icon icon="material-symbols:schedule-outline" width={24} height={24} />
                  </ListItemIcon>
                  <ListItemText>Programar</ListItemText>
                </MenuItem> */}

                {/* <MenuItem
                  disabled={disableOption('Subscriptores')}
                  onClick={() => {
                    setOpenSendSubs?.(true);
                    handleSendMenuClose();
                  }}
                >
                  <ListItemIcon>
                    <Icon icon="fluent-mdl2:group" width={24} height={24} />
                  </ListItemIcon>
                  <ListItemText>Enviar ahora</ListItemText>
                </MenuItem> */}
              </Menu>
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      {/* Modal de envío de prueba */}
      <SendTestDialog
        open={openTestDialog}
        setOpen={setOpenTestDialog}
        onSendTest={handleSendTest}
        type={isNewsletterMode ? 'newsletter' : 'email'}
        title="Enviar prueba"
        description="A los siguientes correos le llegará el contenido para su revisión:"
      />

      {/* Modal de error del título */}
      <Dialog
        open={openTitleErrorDialog}
        onClose={() => setOpenTitleErrorDialog(false)}
        aria-labelledby="title-error-dialog-title"
        aria-describedby="title-error-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          id="title-error-dialog-title"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'error.main',
          }}
        >
          <Icon icon="mdi:alert-circle" color="#d32f2f" />
          Título Requerido
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="title-error-dialog-description">
            El título del newsletter es obligatorio para poder guardarlo. Por favor, ingresa un
            título en la sección de &quot;Configuración del Newsletter&quot; antes de intentar
            guardar.
          </DialogContentText>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              📝 Para agregar el título:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              1. Haz clic en el panel derecho &quot;Configuración del Newsletter&quot;
            </Typography>
            <Typography variant="body2" color="text.secondary">
              2. En la pestaña &quot;General&quot;, completa el campo &quot;Título del
              Newsletter&quot;
            </Typography>
            <Typography variant="body2" color="text.secondary">
              3. Intenta guardar nuevamente
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTitleErrorDialog(false)} variant="outlined" color="primary">
            Entendido
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Aprobación */}
      <Dialog
        open={openApprovalDialog}
        onClose={() => setOpenApprovalDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Enviar para Aprobación</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            El newsletter será enviado al siguiente correo para su aprobación:
          </Typography>
          <TextField
            fullWidth
            value={approverEmails[0]}
            disabled
            label="Email del Aprobador"
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApprovalDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleRequestApproval}>
            Enviar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Enviar Ahora */}
      <Dialog
        open={openSendNowDialog}
        onClose={() => setOpenSendNowDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Enviar Newsletter</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            El newsletter será enviado inmediatamente a todos los suscriptores.
          </Alert>
          <Typography variant="body2">
            ¿Estás seguro de que deseas enviar este newsletter ahora?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSendNowDialog(false)}>Cancelar</Button>
          <Button variant="contained" color="primary" onClick={handleSendNow}>
            Enviar Ahora
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Programar */}
      <Dialog
        open={openScheduleDialog}
        onClose={() => setOpenScheduleDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Programar Envío</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Selecciona la fecha y hora en que deseas enviar este newsletter:
          </Typography>
          <TextField
            fullWidth
            type="datetime-local"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenScheduleDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSchedule} disabled={!scheduleDate}>
            Programar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Análisis Editorial */}
      <EditorialAnalysisModal
        open={openEditorialAnalysis}
        onClose={() => setOpenEditorialAnalysis(false)}
        newsletterTitle={newsletterTitle}
        newsletterHtmlContent={newsletterHtmlPreview}
      />
    </>
  );
}
