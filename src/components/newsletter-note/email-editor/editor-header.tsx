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
  AppBar,
  Button,
  Dialog,
  Toolbar,
  Tooltip,
  MenuItem,
  useTheme,
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
}: EditorHeaderProps) {
  // Estado para el menú de transferencia
  const [transferMenuAnchor, setTransferMenuAnchor] = useState<null | HTMLElement>(null);
  const openTransferMenu = Boolean(transferMenuAnchor);

  // Estado para el menú de envío
  const [sendMenuAnchor, setSendMenuAnchor] = useState<null | HTMLElement>(null);
  const openSendMenu = Boolean(sendMenuAnchor);

  // Estado para el modal de prueba
  const [openTestDialog, setOpenTestDialog] = useState(false);

  // Estado para el modal de error del título
  const [openTitleErrorDialog, setOpenTitleErrorDialog] = useState(false);

  const theme = useTheme();

  // Hook del store
  const { sendPostForReview, sendNewsletterForReview, createNewsletter, updateNewsletter } =
    usePostStore();

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

  // Función para debuggear el problema del status y notes
  const debugStatusIssue = () => {
    console.log('🔍 Debugging status and notes issue...');
    console.log('📋 Datos disponibles:', {
      isNewsletterMode,
      newsletterList: newsletterList?.length || 0,
      currentNewsletterId,
      initialNote: initialNote?.title,
    });

    // Verificar estructura de datos que se enviará
    const testData = {
      subject: initialNote?.title || 'Nuevo Newsletter',
      content: 'Test content',
      // NO enviar status ni notes al crear un newsletter nuevo
      objData: '[]',
      config: {
        templateType: 'newsletter',
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        activeVersion: 'newsletter',
      },
    };

    console.log('🧪 Datos de prueba que se enviarían:', testData);
    console.log('✅ Content incluido:', testData.content);
    console.log('✅ ObjData incluido:', testData.objData);
    console.log('✅ Config incluido:', testData.config);
    console.log('❌ Status NO incluido (correcto para crear nuevo)');
    console.log('❌ Notes NO incluido (correcto para crear nuevo)');
  };
  // NUEVA FUNCIÓN: Debugging del envío de newsletter
  const debugNewsletterSending = useCallback(async () => {
    console.log('🔍 Debugging newsletter sending...');

    try {
      // Verificar que tenemos todos los datos necesarios
      console.log('📋 Datos disponibles:', {
        isNewsletterMode,
        currentNewsletterId,
        hasOnGenerateHtml: !!onGenerateHtml,
        hasHtmlContent: !!htmlContent,
        newsletterList: newsletterList?.length || 0,
      });

      // Generar HTML de prueba
      if (onGenerateHtml) {
        console.log('📝 Generando HTML de prueba...');
        const testHtml = await onGenerateHtml();
        console.log('✅ HTML generado:', {
          length: testHtml.length,
          preview: testHtml.substring(0, 300) + '...',
        });

        // Probar envío con email de prueba
        const testEmails = ['test@example.com'];
        console.log('📧 Probando envío con emails:', testEmails);

        const result = await handleSendTest(testEmails);
        console.log('✅ Resultado del envío de prueba:', result);
      } else {
        console.error('❌ No hay función onGenerateHtml disponible');
      }
    } catch (error) {
      console.error('❌ Error en debugging:', error);
    }
  }, [isNewsletterMode, currentNewsletterId, onGenerateHtml, htmlContent, newsletterList]);

  // Función para deshabilitar opciones del menú de envío
  const disableOption = useCallback(
    (option: 'Prueba' | 'Aprobacion' | 'Subscriptores' | 'schedule') => {
      if (saving) {
        return true;
      }

      const newsletter = newsletterList?.find((item) => item.id === currentNewsletterId);

      if (option === 'Aprobacion') {
        if (newsletter) {
          if (
            newsletter.status === 'APPROVED' ||
            newsletter.status === 'PENDING_APPROVAL' ||
            newsletter.status === 'SENDED'
          ) {
            return true;
          }
        }
      }

      if (option === 'Subscriptores' || option === 'schedule') {
        if (newsletter) {
          if (
            newsletter.status === 'DRAFT' ||
            newsletter.status === 'REJECTED' ||
            newsletter.status === 'SENDED' ||
            newsletter.status === 'PENDING_APPROVAL'
          ) {
            return true;
          }
        }
      }

      return false;
    },
    [currentNewsletterId, newsletterList, saving]
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
      console.log('🔄 handleSendTest called:', {
        emails,
        isNewsletterMode,
        currentNewsletterId,
        hasHtmlContent: !!htmlContent,
        hasOnGenerateHtml: !!onGenerateHtml,
      });

      let content = htmlContent;

      // Si no hay contenido HTML, intentar generarlo
      if (!content && onGenerateHtml) {
        console.log('📝 Generando HTML para envío...');
        content = await onGenerateHtml();
        console.log('✅ HTML generado:', {
          contentLength: content?.length,
          contentPreview: content?.substring(0, 200) + '...',
        });
      }

      if (!content) {
        console.error('❌ No se pudo generar el contenido HTML');
        throw new Error('No se pudo generar el contenido HTML');
      }

      console.log('📧 Enviando prueba:', {
        isNewsletterMode,
        currentNewsletterId,
        contentLength: content.length,
      });

      if (isNewsletterMode) {
        // Para newsletters, siempre intentar enviar
        if (currentNewsletterId && currentNewsletterId.trim() !== '') {
          // Enviar newsletter existente para revisión
          console.log('📨 Enviando newsletter existente para revisión:', currentNewsletterId);
          await sendNewsletterForReview(currentNewsletterId, emails, content);
          console.log('✅ Newsletter existente enviado exitosamente');
        } else {
          // Enviar newsletter nuevo (sin ID todavía)
          console.log('📨 Enviando newsletter nuevo para revisión');
          const tempNewsletterId = `temp_newsletter_${Date.now()}`;
          await sendNewsletterForReview(tempNewsletterId, emails, content);
          console.log('✅ Newsletter nuevo enviado exitosamente');
        }
      } else if (initialNote?.id) {
        // Enviar post para revisión (nota existente)
        console.log('📨 Enviando post para revisión:', initialNote.id);
        await sendPostForReview(initialNote.id, emails, content);
        console.log('✅ Post enviado exitosamente');
      } else {
        // Enviar prueba de nota nueva (sin ID todavía)
        console.log('📨 Enviando prueba de nota nueva');
        // Crear un objeto temporal para el envío
        const tempNote = {
          id: `temp_${Date.now()}`, // ID temporal
          title: initialNote?.title || 'Nueva Nota',
          content,
        };
        await sendPostForReview(tempNote.id, emails, content);
        console.log('✅ Prueba de nota nueva enviada exitosamente');
      }
    } catch (error) {
      console.error('❌ Error enviando prueba:', error);
      throw error;
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
      const newsletterData = {
        content,
        // NO enviar status ni notes al crear un newsletter nuevo
        // Configuración completa de componentes (objData)
        objData: JSON.stringify(newsletterComponents),
        // Configuración del newsletter
        config: {
          templateType: 'newsletter',
          dateCreated: new Date().toISOString(),
          dateModified: new Date().toISOString(),
          activeVersion: 'newsletter',
          // Agregar otras configuraciones según sea necesario
        },
      };

      // Log detallado de la estructura de datos
      console.log('📋 Estructura completa de newsletterData:', {
        subject,
        contentLength: content.length,
        objDataLength: newsletterData.objData.length,
        configKeys: Object.keys(newsletterData.config),
        fullData: newsletterData,
      });

      console.log('📤 Guardando newsletter con objData:', {
        subject,
        newsletterData: {
          contentLength: newsletterData.content.length,
          objDataLength: newsletterData.objData.length,
          componentsCount: newsletterComponents.length,
        },
      });

      const result = await createNewsletter(subject, newsletterData);

      if (result) {
        console.log('✅ Newsletter creado exitosamente:', result);

        // Hacer update inmediato con objData
        if (result.id) {
          console.log('🔄 Haciendo update inmediato con objData...');

          const updateData = {
            objData: newsletterData.objData,
            // NO enviar config en el patch, solo objData
          };

          console.log('📤 Datos para update:', {
            newsletterId: result.id,
            updateDataLength: updateData.objData.length,
          });

          const updateResult = await updateNewsletter(result.id, updateData);

          if (updateResult) {
            console.log('✅ Newsletter actualizado con objData exitosamente:', updateResult);
          } else {
            console.error('❌ Error al actualizar newsletter con objData');
            // No lanzar error aquí, el newsletter ya se creó
          }
        } else {
          console.warn('⚠️ Newsletter creado pero sin ID para update');
        }
      } else {
        console.error('❌ Error al guardar newsletter');
        throw new Error('Error al guardar newsletter');
      }
    } catch (error) {
      console.error('❌ Error guardando newsletter:', error);
      throw error;
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
          <Button
            startIcon={<Icon icon="mingcute:left-line" />}
            onClick={onClose}
            variant="outlined"
            sx={{
              mr: 1,
              height: '42px',
            }}
          >
            Volver
          </Button>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '250px',
            }}
          >
            {isNewsletterMode
              ? 'Nuevo Newsletter'
              : isEditingExistingNote
                ? initialNote?.title || 'Editor de Email'
                : 'Nuevo Email'}
          </Typography>

          {/* Selector de versión Web/Newsletter - Solo para template 'news' y 'market' (storyboard solo web) */}
          {activeTemplate === 'news' || activeTemplate === 'market' ? (
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
            <>
              {/* Contador de notas del newsletter */}
              <Button
                variant="outlined"
                color="inherit"
                sx={{ mr: 1, height: '42px' }}
                startIcon={<Icon icon="mdi:note-multiple" />}
              >
                {newsletterNotesCount} Notas
              </Button>

              {/* Botón para generar/alternar vista de preview HTML */}
              <Button
                variant={showNewsletterPreview ? 'contained' : 'outlined'}
                color="secondary"
                sx={{ mr: 1, height: '42px' }}
                startIcon={
                  generatingNewsletterHtml ? (
                    <Icon icon="mdi:loading" className="animate-spin" />
                  ) : (
                    <Icon icon={showNewsletterPreview ? 'mdi:eye-off' : 'mdi:eye'} />
                  )
                }
                onClick={showNewsletterPreview ? onToggleNewsletterView : onGenerateNewsletterHtml}
                disabled={generatingNewsletterHtml}
              >
                {showNewsletterPreview ? 'Ver Notas' : 'Preview HTML'}
              </Button>

              {/* Botón de debug temporal */}
              <Button
                variant="outlined"
                color="secondary"
                sx={{ mr: 1, height: '42px' }}
                startIcon={<Icon icon="mdi:bug" />}
                onClick={debugStatusIssue}
                size="small"
              >
                Debug Data
              </Button>

              {/* Botón de guardar newsletter */}
              <Button
                variant="contained"
                color="primary"
                sx={{ mr: 1, height: '42px' }}
                startIcon={<Icon icon="material-symbols:save" />}
                onClick={handleSaveNewsletter}
                disabled={saving}
              >
                Guardar
              </Button>

              {/* Botón de enviar newsletter */}
              <Button
                variant="contained"
                color="primary"
                endIcon={<Icon icon="mdi:chevron-down" />}
                sx={{ backgroundColor: '#4f46e5', height: '42px' }}
                onClick={handleSendMenuClick}
                aria-controls={openSendMenu ? 'send-menu-newsletter' : undefined}
                aria-haspopup="true"
                aria-expanded={openSendMenu ? 'true' : undefined}
              >
                Enviar Newsletter
              </Button>

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
                  onClick={() => {
                    setOpenTestDialog(true);
                    handleSendMenuClose();
                  }}
                >
                  <ListItemIcon>
                    <Icon icon="mdi:test-tube" width={24} height={24} />
                  </ListItemIcon>
                  <ListItemText>Prueba</ListItemText>
                </MenuItem>

                <MenuItem
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
                </MenuItem>

                <MenuItem
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
                </MenuItem>

                <MenuItem
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
                </MenuItem>
              </Menu>
            </>
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
              <Button
                variant="contained"
                color="primary"
                endIcon={<Icon icon="mdi:chevron-down" />}
                sx={{ backgroundColor: '#4f46e5', height: '42px' }}
                onClick={handleSendMenuClick}
                aria-controls={openSendMenu ? 'send-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openSendMenu ? 'true' : undefined}
              >
                Enviar
              </Button>

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
                <MenuItem
                  disabled={disableOption('Prueba')}
                  onClick={() => {
                    setOpenTestDialog(true);
                    handleSendMenuClose();
                  }}
                >
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
    </>
  );
}
