import { useState } from 'react';

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

  const theme = useTheme();

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
    try {
      await onSendTest(emailsLocal);
      setSuccess(true);
    } catch (error) {
      console.error('Error enviando prueba:', error);
      // En caso de error, no mostrar success
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setOpen(false);
    setEmailsLocal([]);
    setErrorsEmails([]);
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
