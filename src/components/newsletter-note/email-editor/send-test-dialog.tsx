import { useState, useEffect } from 'react';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  useTheme,
  TextField,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

interface SendTestDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSendTest: (emails: string[]) => Promise<void>;
  title?: string;
  description?: string;
  type: 'email' | 'newsletter';
}

export default function SendTestDialog({
  open,
  setOpen,
  onSendTest,
  title = 'Enviar prueba',
  description = 'A los siguientes correos le llegará el contenido para su revisión:',
  type,
}: SendTestDialogProps) {
  const [errorsEmails, setErrorsEmails] = useState<string[]>([]);
  const [emailsLocal, setEmailsLocal] = useState<string[]>([]);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [sendError, setSendError] = useState<string>('');

  const theme = useTheme();

  const handleClose = () => {
    setSuccess(false);
    setOpen(false);
    setEmailsLocal([]);
    setErrorsEmails([]);
    setSendError('');
  };

  // Auto-cerrar el diálogo de éxito después de 3 segundos
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        handleClose();
      }, 3000); // 3 segundos

      // Limpiar el timer si el componente se desmonta o si success cambia
      return () => clearTimeout(timer);
    }
    return undefined; // Return undefined when success is false
  }, [success]);

  const handleChangeEmails = (e: any) => {
    const emails = e.target.value.split(';').map((item: string) => item.trim());

    // Validación simple de emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errors: string[] = [];

    if (emails.length === 1 && emails[0] === '') {
      setEmailsLocal([]);
      setErrorsEmails([]);
      return;
    }

    emails.forEach((email) => {
      if (email && !emailRegex.test(email)) {
        errors.push(`"${email}" no es un correo válido`);
      }
    });

    if (errors.length > 0) {
      setErrorsEmails(errors);
      setEmailsLocal([]);
    } else {
      setErrorsEmails([]);
      setEmailsLocal(emails.filter((email) => email.length > 0));
    }
  };

  const handleSendTest = async () => {
    if (errorsEmails.length !== 0) return;
    if (emailsLocal.length === 0) return;

    setLoading(true);
    setSendError('');
    try {
      await onSendTest(emailsLocal);
      setSuccess(true);
    } catch (error: any) {
      console.error('Error enviando prueba:', error);
      
      // Extraer el mensaje de error
      const errorMessage = error?.message || 'Error al enviar la prueba';
      setSendError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      {!success ? (
        <>
          <DialogTitle align="center">
            {title} {type === 'newsletter' ? 'del Newsletter' : 'del Email'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>{description}</DialogContentText>
            <Box
              noValidate
              component="form"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                m: 'auto',
                width: '80%',
              }}
            >
              <TextField
                id="test-emails"
                type="email"
                placeholder="test@gmail.com;prueba@gmail.com"
                onChange={handleChangeEmails}
                fullWidth
                sx={{
                  marginTop: '10px',
                  width: '100%',
                }}
              />
              <Box>
                {errorsEmails.map((item, index) => (
                  <Box
                    sx={{
                      margin: '5px auto',
                      maxWidth: '100%',
                      fontSize: '12px',
                      color: 'red',
                      '&:hover': {
                        transition: 'all 0.3s ease',
                      },
                    }}
                    key={index}
                  >
                    {item}
                  </Box>
                ))}
                {sendError && (
                  <Box
                    sx={{
                      margin: '10px auto',
                      maxWidth: '100%',
                      fontSize: '14px',
                      color: 'error.main',
                      backgroundColor: 'error.lighter',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: 'error.light',
                    }}
                  >
                    {sendError}
                  </Box>
                )}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
              }}
            >
              <Button
                variant="outlined"
                onClick={handleClose}
                sx={{
                  width: '180px',
                }}
              >
                Cancelar
              </Button>
              <LoadingButton
                variant="contained"
                color="primary"
                loading={loading}
                disabled={errorsEmails.length !== 0 || emailsLocal.length === 0}
                onClick={handleSendTest}
                sx={{
                  width: '180px',
                }}
              >
                Enviar
              </LoadingButton>
            </Box>
          </DialogActions>
        </>
      ) : (
        <DialogContent>
          <DialogTitle align="center">
            {type === 'newsletter' ? 'Newsletter' : 'Email'} Enviado
          </DialogTitle>
          <DialogContentText>
            El {type === 'newsletter' ? 'Newsletter' : 'Email'} se envió correctamente a los correos
            indicados
          </DialogContentText>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <Iconify
              icon="solar:check-circle-bold"
              width="150px"
              height="150px"
              color={theme.palette.success.main}
            />
          </Box>
          <DialogActions>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
              }}
            >
              <Button
                color="primary"
                variant="outlined"
                onClick={handleClose}
                sx={{
                  width: '180px',
                }}
              >
                Aceptar
              </Button>
            </Box>
          </DialogActions>
        </DialogContent>
      )}
    </Dialog>
  );
}
