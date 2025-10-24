import type { PostStatus } from 'src/types/post';

import usePostStore from 'src/store/PostStore';

import { isBase64Image } from '../../utils/imageValidation';

import type { NewsletterHeader } from '../../types';

interface UseNewsletterHandlersProps {
  newsletterHeader?: NewsletterHeader;
  onHeaderChange: (header: NewsletterHeader) => void;
  uploadImageToS3: (base64Image: string, fileName: string) => Promise<string>;
  currentNoteId?: string;
  updateStatus: (status: PostStatus) => Promise<void>;
  noteStatus: string;
  showNotification: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
  setOpenDeleteDialog: (open: boolean) => void;
}

export function useNewsletterHandlers({
  newsletterHeader,
  onHeaderChange,
  uploadImageToS3,
  currentNoteId,
  updateStatus,
  noteStatus,
  showNotification,
  setOpenDeleteDialog,
}: UseNewsletterHandlersProps) {
  const { delete: deletePost } = usePostStore();

  // Función para manejar selección de archivo de logo
  const handleLogoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && newsletterHeader) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        onHeaderChange({ ...newsletterHeader, logo: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para manejar selección de archivo de sponsor
  const handleSponsorFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && newsletterHeader?.sponsor) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        onHeaderChange({
          ...newsletterHeader,
          sponsor: {
            ...newsletterHeader.sponsor,
            image: base64,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para subir logo a S3
  const handleUploadLogoToS3 = async () => {
    if (!newsletterHeader?.logo || !isBase64Image(newsletterHeader.logo)) {
      alert('No hay imagen de logo para subir o ya está subida');
      return;
    }

    try {
      const s3Url = await uploadImageToS3(newsletterHeader.logo, `newsletter_logo_${Date.now()}`);
      onHeaderChange({ ...newsletterHeader, logo: s3Url });
    } catch (error) {
      alert('Error al subir la imagen del logo a S3');
      console.error(error);
    }
  };

  // Función para subir imagen de sponsor a S3
  const handleUploadSponsorToS3 = async () => {
    if (!newsletterHeader?.sponsor?.image || !isBase64Image(newsletterHeader.sponsor.image)) {
      alert('No hay imagen de sponsor para subir o ya está subida');
      return;
    }

    try {
      const s3Url = await uploadImageToS3(
        newsletterHeader.sponsor.image,
        `newsletter_sponsor_${Date.now()}`
      );
      onHeaderChange({
        ...newsletterHeader,
        sponsor: {
          ...newsletterHeader.sponsor,
          image: s3Url,
        },
      });
    } catch (error) {
      alert('Error al subir la imagen del sponsor a S3');
      console.error(error);
    }
  };

  // Función para manejar cambio de status
  const handleStatusChange = async (newStatus: string) => {
    if (!currentNoteId) {
      console.warn('No se puede cambiar el estado de una nota no guardada');
      return;
    }

    try {
      await updateStatus(newStatus as PostStatus);
      // No necesitamos llamar setNoteStatus aquí porque updateStatus ya lo hace internamente
    } catch (error) {
      console.error('Error al actualizar el status:', error);
      // Mantener el status actual en caso de error
    }
  };

  // Función para eliminar la nota
  const handleDeleteNote = async () => {
    if (!currentNoteId) {
      showNotification('No hay nota para eliminar', 'error');
      return;
    }

    try {
      const success = await deletePost(currentNoteId);
      if (success) {
        showNotification('Nota eliminada correctamente', 'success');
        setOpenDeleteDialog(false);

        // Recargar la página después de un breve delay
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        showNotification('Error al eliminar la nota', 'error');
      }
    } catch (error) {
      console.error('Error al eliminar la nota:', error);
      showNotification('Error al eliminar la nota', 'error');
    }
  };

  return {
    handleLogoFileChange,
    handleSponsorFileChange,
    handleUploadLogoToS3,
    handleUploadSponsorToS3,
    handleStatusChange,
    handleDeleteNote,
  };
}
