'use client';

import 'dayjs/locale/es';

import type { Dayjs } from 'dayjs';
import type { SavedNote } from 'src/types/saved-note';

import dayjs from 'dayjs';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { useState, useCallback } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import {
  Box,
  Menu,
  Chip,
  Fade,
  Stack,
  Alert,
  AppBar,
  Button,
  Dialog,
  Switch,
  Toolbar,
  Tooltip,
  Collapse,
  MenuItem,
  Checkbox,
  useTheme,
  Typography,
  IconButton,
  DialogTitle,
  ToggleButton,
  ListItemIcon,
  ListItemText,
  DialogContent,
  DialogActions,
  CircularProgress,
  FormControlLabel,
  ToggleButtonGroup,
  DialogContentText,
} from '@mui/material';

import { CONFIG } from 'src/global-config';
import usePostStore from 'src/store/PostStore';
import useAiGenerationStore from 'src/store/AiGenerationStore';

import SendTestDialog from './send-test-dialog';
import TargetStoresModal from '../newsletter-editor/TargetStoresModal';
import EditorialAnalysisModal from './components/EditorialAnalysisModal';

import type { NoteConfigurationField } from './right-panel/views/NoteConfigurationView';

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
  onGenerateHtml?: (options?: { includeApprovalButtons?: boolean }) => Promise<string>;
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
  // Prop para botón de IA
  onAIGenerateClick?: () => void;
  // Props para análisis editorial de notas
  noteTitle?: string;
  noteHtmlPreview?: string;
  // Nueva prop para guardar newsletter con lógica de modal
  onSaveNewsletter?: () => void | Promise<void>;
  focusConfigurationField?: (field: NoteConfigurationField) => void;
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
  onAIGenerateClick,
  noteTitle = '',
  noteHtmlPreview = '',
  onSaveNewsletter,
  focusConfigurationField,
}: EditorHeaderProps) {
  // Estado para el menú de transferencia - ELIMINADO (sincronización siempre activa)

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
  const [scheduleDate, setScheduleDate] = useState<Dayjs | null>(null);
  const [selectedApproverEmails, setSelectedApproverEmails] = useState<string[]>([]);
  const [loadingApproval, setLoadingApproval] = useState(false);

  // Estado para el diálogo de confirmación de salida con IA generando
  const [openExitConfirmDialog, setOpenExitConfirmDialog] = useState(false);

  // Estados para el modal de targetStores (MICHIN)
  const [showTargetStoresModal, setShowTargetStoresModal] = useState(false);
  const [selectedTargetStores, setSelectedTargetStores] = useState<string[]>([]);

  const theme = useTheme();

  // Correos disponibles para aprobación desde variable de entorno
  const availableApproverEmails = CONFIG.approverEmails;

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

  // Hook del store de IA para mostrar estado de generación
  const { loading: aiGenerating, progress: aiProgress, cancelGeneration } = useAiGenerationStore();

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

  // Función para manejar el cierre del editor
  const handleClose = useCallback(() => {
    // Si está generando con IA, mostrar confirmación
    if (aiGenerating) {
      setOpenExitConfirmDialog(true);
    } else {
      // Si no está generando, cerrar directamente
      onClose();
    }
  }, [aiGenerating, onClose]);

  // Función para confirmar salida y cancelar generación de IA
  const handleConfirmExit = useCallback(() => {
    // Cancelar la generación de IA
    cancelGeneration();
    // Cerrar el diálogo de confirmación
    setOpenExitConfirmDialog(false);
    // Cerrar el editor
    onClose();
  }, [cancelGeneration, onClose]);

  // Handlers del menú de transferencia - ELIMINADOS (sincronización siempre activa)

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
        await sendNewsletterForReview(currentNewsletterId, emails, content, newsletterTitle);
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
    } catch (error: any) {
      console.error('❌ Error enviando prueba:', error);

      // Extraer el mensaje de error del backend
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Error al enviar la prueba';

      throw new Error(errorMessage);
    }
  };

  // Función wrapper para guardar y luego abrir diálogo de envío (para newsletters)
  const handleSaveAndOpenDialog = async (
    dialogType: 'test' | 'approval' | 'schedule' | 'sendNow'
  ) => {
    try {
      console.log('💾 Guardando newsletter antes de enviar...');

      // Primero guardar el newsletter
      const saved = await handleSaveNewsletter();

      if (!saved) {
        handleSendMenuClose();
        return;
      }

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
    } catch (error: any) {
      console.error('❌ Error guardando newsletter antes de enviar:', error);

      // Extraer el mensaje de error del backend
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Error al guardar el newsletter';

      showNotification(errorMessage, 'error');
      handleSendMenuClose();
      // No abrir el diálogo si hubo error al guardar
    }
  };

  // Función para confirmar targetStores (MICHIN)
  const handleConfirmTargetStores = async (stores: string[]) => {
    setSelectedTargetStores(stores);
    setShowTargetStoresModal(false);
    // Continuar con el guardado
    await executeSaveNewsletter(stores);
  };

  // Función para guardar newsletter
  const handleSaveNewsletter = async (): Promise<boolean> => {
    try {
      console.log('🔄 handleSaveNewsletter called:', {
        isNewsletterMode,
        hasOnGenerateHtml: !!onGenerateHtml,
        hasHtmlContent: !!htmlContent,
      });

      if (!isNewsletterMode) {
        console.log('❌ No es modo newsletter, usando onSave');
        try {
          await onSave();
          return true;
        } catch (saveError: any) {
          console.error('❌ Error al guardar post:', saveError);

          // Extraer información del error
          const statusCode = saveError?.response?.status;
          const backendMessage = saveError?.response?.data?.message;
          const errorMsg = saveError?.message;

          // Manejar errores específicos
          let errorMessage = 'Error al guardar el post';

          if (statusCode === 413 || errorMsg?.toLowerCase().includes('request entity too large')) {
            errorMessage =
              'El post es demasiado grande para guardarse. Por favor, reduce el tamaño de las imágenes o la cantidad de contenido.';
          } else if (statusCode === 413 || errorMsg?.toLowerCase().includes('payload too large')) {
            errorMessage =
              'El contenido del post excede el límite permitido. Intenta reducir el número de imágenes o componentes.';
          } else if (backendMessage) {
            errorMessage = backendMessage;
          } else if (errorMsg) {
            errorMessage = errorMsg;
          }

          showNotification(errorMessage, 'error');
          return false;
        }
      }

      // MICHIN: Verificar targetStores antes de guardar por primera vez
      const isNewNewsletter = !currentNewsletterId || currentNewsletterId.trim() === '';
      if (CONFIG.platform === 'MICHIN' && isNewNewsletter && selectedTargetStores.length === 0) {
        console.log('🎯 Newsletter nuevo en MICHIN sin targetStores, mostrando modal...');
        setShowTargetStoresModal(true);
        return false;
      }

      // Si ya tenemos targetStores o no es MICHIN, continuar directamente
      await executeSaveNewsletter(
        selectedTargetStores.length > 0 ? selectedTargetStores : undefined
      );

      return true;
    } catch (error: any) {
      console.error('❌ Error en handleSaveNewsletter:', error);

      // Extraer información del error
      const statusCode = error?.response?.status;
      const backendMessage = error?.response?.data?.message;
      const errorMsg = error?.message;

      // Manejar errores específicos
      let errorMessage = 'Error al guardar el newsletter';

      if (statusCode === 413 || errorMsg?.toLowerCase().includes('request entity too large')) {
        errorMessage =
          'El newsletter es demasiado grande para guardarse. Por favor, reduce el tamaño de las imágenes o la cantidad de contenido.';

        // Log información útil para debugging
        console.error('📊 Error 413 - Payload demasiado grande. Considera:', {
          sugerencia:
            'Reducir tamaño de imágenes, usar menos componentes o dividir en múltiples newsletters',
          statusCode,
          errorDetails: errorMsg,
        });
      } else if (statusCode === 413 || errorMsg?.toLowerCase().includes('payload too large')) {
        errorMessage =
          'El contenido del newsletter excede el límite permitido. Intenta reducir el número de imágenes o componentes.';

        // Log información útil para debugging
        console.error('📊 Error 413 - Payload demasiado grande. Considera:', {
          sugerencia:
            'Reducir tamaño de imágenes, usar menos componentes o dividir en múltiples newsletters',
          statusCode,
          errorDetails: errorMsg,
        });
      } else if (backendMessage) {
        errorMessage = backendMessage;
      } else if (errorMsg) {
        errorMessage = errorMsg;
      }

      showNotification(errorMessage, 'error');

      return false;
    }
  };

  // Función que ejecuta el guardado real del newsletter
  const executeSaveNewsletter = async (targetStores?: string[]) => {
    try {
      console.log('🔄 executeSaveNewsletter called con targetStores:', targetStores);

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
        focusConfigurationField?.('newsletterTitle');
        throw new Error('El título del newsletter es obligatorio');
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

          // Llamar al callback para actualizar el estado en el componente padre
          if (onNewsletterUpdate) {
            onNewsletterUpdate();
          }
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
          targetStores,
        });

        const result = await createNewsletter(subject, createData, targetStores);

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

            // Llamar al callback para actualizar el estado en el componente padre
            if (onNewsletterUpdate) {
              onNewsletterUpdate();
            }
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
    } catch (error: any) {
      console.error('❌ Error guardando newsletter:', error);

      // Extraer información del error
      const statusCode = error?.response?.status;
      const backendMessage = error?.response?.data?.message;
      const errorMsg = error?.message;

      // Manejar errores específicos
      let errorMessage = 'Error al guardar el newsletter';

      if (statusCode === 413 || errorMsg?.toLowerCase().includes('request entity too large')) {
        errorMessage =
          'El newsletter es demasiado grande para guardarse. Por favor, reduce el tamaño de las imágenes o la cantidad de contenido.';

        // Log información útil para debugging
        console.error('📊 Error 413 - Payload demasiado grande:', {
          sugerencia:
            'Reducir tamaño de imágenes, comprimir contenido o dividir en múltiples newsletters',
          statusCode,
          errorDetails: errorMsg,
        });
      } else if (statusCode === 413 || errorMsg?.toLowerCase().includes('payload too large')) {
        errorMessage =
          'El contenido del newsletter excede el límite permitido. Intenta reducir el número de imágenes o componentes.';

        // Log información útil para debugging
        console.error('📊 Error 413 - Payload demasiado grande:', {
          sugerencia:
            'Reducir tamaño de imágenes, comprimir contenido o dividir en múltiples newsletters',
          statusCode,
          errorDetails: errorMsg,
        });
      } else if (backendMessage) {
        errorMessage = backendMessage;
      } else if (errorMsg) {
        errorMessage = errorMsg;
      }

      showNotification(errorMessage, 'error');
      throw error;
    }
  };

  // Handler para solicitar aprobación
  const handleRequestApproval = async () => {
    try {
      setLoadingApproval(true);
      console.log('🔄 Solicitando aprobación del newsletter...');

      // Validar que el newsletter esté guardado
      if (!currentNewsletterId || currentNewsletterId.trim() === '') {
        showNotification('Debes guardar el newsletter antes de solicitar aprobación', 'error');
        setLoadingApproval(false);
        return;
      }

      // Generar HTML si no está disponible
      let content = htmlContent;
      if (!content && onGenerateHtml) {
        console.log('📝 Generando HTML para aprobación con botones...');
        content = await onGenerateHtml({ includeApprovalButtons: true });
      }

      if (!content) {
        console.error('❌ No se pudo generar el contenido HTML');
        throw new Error('No se pudo generar el contenido HTML');
      }

      // Enviar solicitud de aprobación con el endpoint correcto
      await requestNewsletterApproval(
        currentNewsletterId,
        selectedApproverEmails,
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
    } catch (error: any) {
      console.error('❌ Error al solicitar aprobación:', error);

      // Extraer el mensaje de error del backend
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Error al solicitar aprobación';

      showNotification(errorMessage, 'error');
    } finally {
      setLoadingApproval(false);
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
    } catch (error: any) {
      console.error('❌ Error al enviar newsletter:', error);

      // Extraer el mensaje de error del backend
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Error al enviar el newsletter';

      showNotification(errorMessage, 'error');
      setOpenSendNowDialog(false);
    }
  };

  // Handler para programar envío
  const handleSchedule = async () => {
    try {
      if (!scheduleDate) {
        console.error('No hay fecha seleccionada');
        return;
      }

      console.log('🔄 Programando newsletter...', { scheduleDate: scheduleDate.toISOString() });

      // Validar que la fecha sea futura
      const scheduledTime = scheduleDate.valueOf();
      const now = dayjs().valueOf();

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
      const isoDate = scheduleDate.toISOString();
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
      setScheduleDate(null); // Limpiar fecha
    } catch (error: any) {
      console.error('❌ Error al programar newsletter:', error);

      // Extraer el mensaje de error del backend
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Error al programar el newsletter';

      showNotification(errorMessage, 'error');
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
          <IconButton
            onClick={handleClose}
            sx={{ borderRadius: '8px', border: '1px solid #C4CDD520' }}
          >
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
          {(activeTemplate === 'news' ||
            activeTemplate === 'market' ||
            activeTemplate === 'skillup' ||
            activeTemplate === 'howto') &&
          !showPreview ? (
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
                  <Image
                    src="/assets/icons/apps/ic-notes.svg"
                    alt="web"
                    width={20}
                    height={20}
                    style={{ marginRight: '8px' }}
                  />{' '}
                  Web
                </ToggleButton>
                <ToggleButton value="newsletter" aria-label="newsletter version">
                  <Image
                    src="/assets/icons/apps/ic-news.svg"
                    alt="newsletter"
                    width={20}
                    height={20}
                    style={{ marginRight: '8px' }}
                  />
                  Comunicado
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 1 }} />
          )}

          {/* Indicador de sincronización - Solo para template 'news' y 'market' */}

          {/* Botón y menú de transferencia ELIMINADOS - sincronización siempre activa */}

          {isNewsletterMode ? (
            <Stack
              direction="row"
              spacing={1}
              sx={{
                transition: 'gap 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
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

              {/* Switch de toggle Preview/Editor - En modo newsletter */}
              {!isViewOnly && (
                <FormControlLabel
                  control={
                    <Switch checked={showPreview} onChange={onTogglePreview} color="primary" />
                  }
                  label={showPreview ? 'Preview' : 'Preview'}
                  sx={{ ml: 1, mr: 1 }}
                />
              )}

              {/* Botón de Revisión Editorial - Solo visible en modo preview */}
              <Collapse in={showPreview} orientation="horizontal" timeout={250} unmountOnExit>
                <Fade in={showPreview} timeout={200}>
                  <Button
                    variant="outlined"
                    startIcon={<Icon icon="mdi:file-document-check" />}
                    onClick={() => setOpenEditorialAnalysis(true)}
                    sx={{ height: '42px', whiteSpace: 'nowrap', mr: 1 }}
                    color="secondary"
                  >
                    Revisión con IA
                  </Button>
                </Fade>
              </Collapse>

              {/* Botón de guardar newsletter - Ocultar en modo view-only y preview */}
              <Collapse
                in={!isViewOnly && !showPreview}
                orientation="horizontal"
                timeout={250}
                unmountOnExit
              >
                <Fade in={!isViewOnly && !showPreview} timeout={200}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ height: '42px', whiteSpace: 'nowrap', mr: 1 }}
                    startIcon={<Icon icon="material-symbols:save" />}
                    onClick={handleSaveNewsletter}
                    disabled={saving}
                  >
                    Guardar
                  </Button>
                </Fade>
              </Collapse>

              {/* Botón de crear copia - Solo en modo view-only */}
              <Collapse in={isViewOnly} orientation="horizontal" timeout={250} unmountOnExit>
                <Fade in={isViewOnly} timeout={200}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ height: '42px', whiteSpace: 'nowrap', mr: 1 }}
                    startIcon={<Icon icon="eva:copy-fill" />}
                    onClick={onCreateCopy}
                  >
                    Crear Copia
                  </Button>
                </Fade>
              </Collapse>

              {/* Botón de enviar newsletter - Ocultar en modo view-only y preview */}
              <Collapse
                in={!isViewOnly && !showPreview}
                orientation="horizontal"
                timeout={250}
                unmountOnExit
              >
                <Fade in={!isViewOnly && !showPreview} timeout={200}>
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
                        sx={{ backgroundColor: '#4f46e5', height: '42px', whiteSpace: 'nowrap' }}
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
                </Fade>
              </Collapse>

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
            <Stack
              direction="row"
              spacing={1}
              sx={{
                transition: 'gap 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
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

              {/* Switch de toggle Preview/Editor - Solo para templates con versión newsletter */}
              {(activeTemplate === 'news' ||
                activeTemplate === 'market' ||
                activeTemplate === 'skillup' ||
                activeTemplate === 'howto') &&
                activeVersion === 'newsletter' &&
                !isViewOnly && (
                  <FormControlLabel
                    control={
                      <Switch checked={showPreview} onChange={onTogglePreview} color="primary" />
                    }
                    label={showPreview ? 'Preview' : 'Editor'}
                    sx={{ ml: 1, mr: 1 }}
                  />
                )}

              {/* Botón de Revisión Editorial - Solo visible en modo preview */}
              <Collapse in={showPreview} orientation="horizontal" timeout={250} unmountOnExit>
                <Fade in={showPreview} timeout={200}>
                  <Button
                    variant="outlined"
                    startIcon={<Icon icon="mdi:file-document-check" />}
                    onClick={() => setOpenEditorialAnalysis(true)}
                    sx={{ height: '42px', whiteSpace: 'nowrap', mr: 1 }}
                    color="secondary"
                  >
                    Revisión con IA
                  </Button>
                </Fade>
              </Collapse>

              {/* Botón de guardar - Ocultar en modo preview */}
              <Collapse in={!showPreview} orientation="horizontal" timeout={250} unmountOnExit>
                <Fade in={!showPreview} timeout={200}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ height: '42px', whiteSpace: 'nowrap' }}
                    startIcon={<Icon icon="material-symbols:save" />}
                    onClick={onSave}
                  >
                    Guardar
                  </Button>
                </Fade>
              </Collapse>
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      {/* Modal de envío de prueba */}
      <SendTestDialog
        open={openTestDialog}
        setOpen={setOpenTestDialog}
        onSendTest={handleSendTest}
        type={isNewsletterMode ? 'comunicado' : 'email'}
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
        onClose={() => !loadingApproval && setOpenApprovalDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Enviar para Aprobación</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Selecciona los correos que recibirán la solicitud de aprobación:
          </Typography>
          <Stack spacing={1}>
            {availableApproverEmails.map((email) => (
              <FormControlLabel
                key={email}
                control={
                  <Checkbox
                    checked={selectedApproverEmails.includes(email)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedApproverEmails([...selectedApproverEmails, email]);
                      } else {
                        setSelectedApproverEmails(
                          selectedApproverEmails.filter((existingEmail) => existingEmail !== email)
                        );
                      }
                    }}
                  />
                }
                label={email}
              />
            ))}
          </Stack>
          {selectedApproverEmails.length === 0 && (
            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
              Debes seleccionar al menos un correo
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApprovalDialog(false)} disabled={loadingApproval}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleRequestApproval}
            disabled={selectedApproverEmails.length === 0 || loadingApproval}
            startIcon={loadingApproval ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {loadingApproval ? 'Enviando...' : 'Enviar'}
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
          <Typography variant="body2" sx={{ mb: 3, mt: 1 }}>
            Selecciona la fecha y hora en que deseas enviar este newsletter:
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <MobileDateTimePicker
              label="Fecha y hora de envío"
              value={scheduleDate}
              onChange={(newValue) => setScheduleDate(newValue)}
              disablePast
              minutesStep={5}
              ampm={false}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                },
                actionBar: {
                  actions: ['clear', 'accept'],
                },
              }}
            />
          </LocalizationProvider>
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
        newsletterTitle={isNewsletterMode ? newsletterTitle : noteTitle}
        newsletterHtmlContent={isNewsletterMode ? newsletterHtmlPreview : noteHtmlPreview}
      />

      {/* Diálogo de confirmación de salida con IA generando */}
      <Dialog
        open={openExitConfirmDialog}
        onClose={() => setOpenExitConfirmDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Icon icon="mdi:alert-circle" color="#FF9800" width={24} height={24} />
            <Typography variant="h6">Generación de IA en Progreso</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 1 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Actualmente se está generando contenido con IA ({aiProgress}% completado).
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Si sales ahora, perderás todo el progreso y la generación se cancelará
              automáticamente.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenExitConfirmDialog(false)}
            variant="contained"
            sx={{ minWidth: 120 }}
          >
            Continuar Generando
          </Button>
          <Button
            onClick={handleConfirmExit}
            variant="outlined"
            color="error"
            sx={{ minWidth: 120 }}
          >
            Salir y Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para seleccionar targetStores (solo MICHIN) */}
      {CONFIG.platform === 'MICHIN' && (
        <TargetStoresModal
          open={showTargetStoresModal}
          onClose={() => setShowTargetStoresModal(false)}
          onConfirm={handleConfirmTargetStores}
          selectedStores={selectedTargetStores}
        />
      )}
    </>
  );
}
