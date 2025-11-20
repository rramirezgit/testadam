'use client';

import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';

import {
  Box,
  Card,
  Chip,
  Stack,
  Button,
  Dialog,
  MenuItem,
  TextField,
  IconButton,
  Typography,
  CardContent,
  DialogTitle,
  DialogActions,
  DialogContent,
  LinearProgress,
  CircularProgress,
} from '@mui/material';

import { usePosts } from 'src/hooks/use-posts';

import { CONFIG } from 'src/global-config';
import usePostStore from 'src/store/PostStore';

import { UploadCover } from 'src/components/upload';

import { useImageUpload } from './right-panel/useImageUpload';

// ============================================================================
// TIPOS
// ============================================================================

interface SaveNoteModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (postId: string) => void;
  initialData?: {
    title?: string;
    description?: string;
    coverImageUrl?: string;
    objData: string;
    objDataWeb: string;
    // Metadatos de categorización
    contentTypeId?: string;
    audienceId?: string;
    categoryId?: string;
    subcategoryId?: string;
  };
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function SaveNoteModal({ open, onClose, onSave, initialData }: SaveNoteModalProps) {
  const { createPost } = usePosts();
  const { uploadImageToS3, uploading, uploadProgress } = useImageUpload();

  const contentTypes = usePostStore((state) => state.contentTypes);
  const audiences = usePostStore((state) => state.audiences);
  const categories = usePostStore((state) => state.categories);
  const loadContentTypes = usePostStore((state) => state.loadContentTypes);
  const loadAudiences = usePostStore((state) => state.loadAudiences);
  const loadCategories = usePostStore((state) => state.loadCategories);

  // Estado del formulario
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverImageUrl: '',
    contentTypeId: '',
    audienceId: '',
    categoryId: '',
    subcategoryId: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos iniciales y extraer la primera imagen del objData
  useEffect(() => {
    if (open && initialData) {
      let coverImage = initialData.coverImageUrl || '';

      // Si no hay coverImageUrl, extraer la primera imagen del objData
      if (!coverImage && initialData.objData) {
        try {
          const objData =
            typeof initialData.objData === 'string'
              ? JSON.parse(initialData.objData)
              : initialData.objData;

          // Buscar el primer componente de tipo 'image'
          const firstImageComponent = objData.find((component: any) => component.type === 'image');

          if (firstImageComponent && firstImageComponent.props?.src) {
            coverImage = firstImageComponent.props.src;
            console.log('📸 Primera imagen extraída del objData:', coverImage);
          }
        } catch (parseError) {
          console.error('❌ Error al extraer imagen del objData:', parseError);
        }
      }

      setFormData((prev) => ({
        ...prev,
        title: initialData.title || '',
        description: initialData.description || '',
        coverImageUrl: coverImage,
        contentTypeId: initialData.contentTypeId || '',
        audienceId: initialData.audienceId || '',
        categoryId: initialData.categoryId || '',
        subcategoryId: initialData.subcategoryId || '',
      }));
    }
  }, [open, initialData]);

  // Cargar metadatos cuando se abre el modal
  useEffect(() => {
    if (open) {
      if (contentTypes.length === 0) {
        loadContentTypes();
      }
      if (audiences.length === 0 && CONFIG.platform === 'ADAC') {
        loadAudiences();
      }
    }
  }, [open, contentTypes.length, audiences.length, loadContentTypes, loadAudiences]);

  // Cargar categorías cuando se selecciona un tipo de contenido
  useEffect(() => {
    if (formData.contentTypeId && open) {
      loadCategories(formData.contentTypeId);
      // NO resetear category y subcategory si ya vienen pre-cargadas de initialData
    }
  }, [formData.contentTypeId, open, loadCategories]);

  // NO resetear subcategory si ya viene pre-cargada de initialData
  // Este useEffect se comenta porque interfiere con la pre-carga de datos

  // Limpiar formulario al cerrar
  useEffect(() => {
    if (!open) {
      setFormData({
        title: '',
        description: '',
        coverImageUrl: '',
        contentTypeId: '',
        audienceId: '',
        categoryId: '',
        subcategoryId: '',
      });
      setError(null);
    }
  }, [open]);

  // Obtener subcategorías de la categoría seleccionada
  const selectedCategory = categories.find((c) => c.id === formData.categoryId);
  const subcategories = selectedCategory?.subcategories || [];

  // Validar formulario
  const validateForm = (): string | null => {
    if (!formData.title.trim()) {
      return 'El título es obligatorio';
    }

    if (!formData.contentTypeId) {
      return 'El tipo de contenido es obligatorio';
    }

    if (CONFIG.platform === 'ADAC' && !formData.audienceId) {
      return 'La audiencia es obligatoria';
    }

    if (!formData.categoryId) {
      return 'La categoría es obligatoria';
    }

    if (!formData.subcategoryId) {
      return 'La subcategoría es obligatoria';
    }

    return null;
  };

  // Manejar guardado
  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!initialData) {
      setError('No hay datos para guardar');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convertir objData y objDataWeb a strings JSON si aún no lo son
      // (igual que se hace en editor-header.tsx línea 537)
      const objDataString =
        typeof initialData.objData === 'string'
          ? initialData.objData
          : JSON.stringify(initialData.objData);

      const objDataWebString =
        typeof initialData.objDataWeb === 'string'
          ? initialData.objDataWeb
          : JSON.stringify(initialData.objDataWeb);

      // Crear configPost con templateType y dateCreated
      const configPost = JSON.stringify({
        templateType: 'news',
        dateCreated: new Date().toISOString(),
      });

      console.log('📤 Preparando datos para guardar nota:', {
        title: formData.title.trim(),
        objDataLength: objDataString.length,
        objDataWebLength: objDataWebString.length,
        objDataType: typeof initialData.objData,
        objDataWebType: typeof initialData.objDataWeb,
        configPost,
      });

      const createData = {
        title: formData.title.trim(),
        description: formData.description.trim() || '',
        coverImageUrl: formData.coverImageUrl || '',
        objData: objDataString,
        objDataWeb: objDataWebString,
        configPost,
        origin: 'ADAC',
        highlight: false,
        ...(CONFIG.platform === 'ADAC'
          ? {
              contentTypeId: formData.contentTypeId,
              audienceId: formData.audienceId || null,
              categoryId: formData.categoryId || null,
              subcategoryId: formData.subcategoryId || null,
            }
          : {
              contentTypeId: formData.contentTypeId,
              categoryId: formData.categoryId || null,
              subcategoryId: formData.subcategoryId || null,
            }),
      };

      const result = await createPost(createData);

      if (result) {
        console.log('✅ Nota guardada exitosamente:', result.id);
        onSave(result.id);
        onClose();
      } else {
        throw new Error('No se pudo guardar la nota');
      }
    } catch (err: any) {
      console.error('❌ Error al guardar nota:', err);
      setError(err.message || 'Error al guardar la nota. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1.5}>
            <Icon icon="solar:diskette-bold" width={24} />
            <Typography variant="h6" fontWeight={600}>
              Guardar Nota
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" disabled={loading}>
            <Icon icon="solar:close-circle-linear" width={24} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 3 }}>
        {/* Error message */}
        {error && (
          <Card
            sx={{ mt: 2, mb: 1, border: 1, borderColor: 'error.main', bgcolor: 'error.lighter' }}
          >
            <CardContent sx={{ py: 1.5 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Icon icon="solar:danger-circle-bold" width={20} color="#d32f2f" />
                <Typography variant="body2" color="error.dark">
                  {error}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        )}

        <Stack spacing={2.5}>
          {/* Título */}
          <TextField
            label="Título *"
            fullWidth
            sx={{ mt: 2 }}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            disabled={loading}
            placeholder="Ej: Descubrimiento de nueva especie de coral"
          />

          {/* Descripción */}
          <TextField
            label="Descripción"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            disabled={loading}
            placeholder="Breve descripción de la nota..."
          />

          {/* Imagen de portada */}
          <Box>
            <Chip label="Portada de nota" variant="filled" sx={{ mb: 2 }} size="small" />
            <UploadCover
              value={formData.coverImageUrl}
              disabled={uploading || loading}
              onDrop={async (acceptedFiles: File[]) => {
                const file = acceptedFiles[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = async () => {
                    const base64String = reader.result as string;
                    // Mostrar preview temporalmente
                    setFormData({ ...formData, coverImageUrl: base64String });

                    try {
                      // Subir automáticamente a S3
                      const s3Url = await uploadImageToS3(base64String, `cover-${Date.now()}`);
                      // Actualizar con la URL de S3
                      setFormData({ ...formData, coverImageUrl: s3Url });
                    } catch (uploadError) {
                      console.error('Error al subir imagen de portada:', uploadError);
                      setError('Error al subir la imagen. Por favor, intenta de nuevo.');
                      // Mantener el base64 en caso de error
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
              onRemove={() => setFormData({ ...formData, coverImageUrl: '' })}
            />
            {uploading && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Subiendo imagen: {uploadProgress}%
                </Typography>
                <LinearProgress variant="determinate" value={uploadProgress} />
              </Box>
            )}
          </Box>

          {/* Tipo de contenido */}
          <TextField
            select
            label="Tipo de contenido *"
            fullWidth
            value={formData.contentTypeId}
            onChange={(e) => setFormData({ ...formData, contentTypeId: e.target.value })}
            disabled={loading}
          >
            <MenuItem value="">
              <em>Selecciona un tipo</em>
            </MenuItem>
            {contentTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Audiencia (solo ADAC) */}
          {CONFIG.platform === 'ADAC' && (
            <TextField
              select
              label="Audiencia *"
              fullWidth
              value={formData.audienceId}
              onChange={(e) => setFormData({ ...formData, audienceId: e.target.value })}
              disabled={loading}
            >
              <MenuItem value="">
                <em>Selecciona una audiencia</em>
              </MenuItem>
              {audiences.map((audience) => (
                <MenuItem key={audience.id} value={audience.id}>
                  {audience.name}
                </MenuItem>
              ))}
            </TextField>
          )}

          {/* Categoría */}
          <TextField
            select
            label="Categoría *"
            fullWidth
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            disabled={loading || !formData.contentTypeId}
            helperText={!formData.contentTypeId ? 'Primero selecciona un tipo de contenido' : ''}
          >
            <MenuItem value="">
              <em>Selecciona una categoría</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Subcategoría */}
          <TextField
            select
            label="Subcategoría *"
            fullWidth
            value={formData.subcategoryId}
            onChange={(e) => setFormData({ ...formData, subcategoryId: e.target.value })}
            disabled={loading || !formData.categoryId || subcategories.length === 0}
            helperText={
              !formData.categoryId
                ? 'Primero selecciona una categoría'
                : subcategories.length === 0
                  ? 'No hay subcategorías disponibles'
                  : ''
            }
          >
            <MenuItem value="">
              <em>Selecciona una subcategoría</em>
            </MenuItem>
            {subcategories.map((subcategory) => (
              <MenuItem key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose} disabled={loading} sx={{ minWidth: 100 }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <Icon icon="solar:diskette-bold" />}
          sx={{ minWidth: 150 }}
        >
          {loading ? 'Guardando...' : 'Guardar Nota'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
