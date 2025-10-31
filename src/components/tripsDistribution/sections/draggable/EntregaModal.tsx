import { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Box,
  styled,
  Avatar,
  IconButton,
  Chip,
  Alert,
} from "@mui/material";
import { X, Camera, FileText, CheckCircle, XCircle } from "lucide-react";
import { RemitoDto, useRemitosControllerEntregarRemito, useRemitosControllerMarcarNoEntregado } from "../../../../api/generated";
import { useNotify } from "../../../../hooks/useNotify";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  open: boolean;
  onClose: () => void;
  remito: any;
  isLoading?: boolean;
  setRemitosCompletos: React.Dispatch<React.SetStateAction<RemitoDto[]>>;
  refrescarRemitos: () => Promise<void>;
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const FilePreview = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
  marginTop: theme.spacing(1),
}));

export default function EntregaModal({ open, onClose, remito, isLoading = false, setRemitosCompletos, refrescarRemitos }: Props) {
  const {notify} = useNotify("Remito", "male");
  const [estado, setEstado] = useState<"Entregado" | "No entregado" | "">("");
  const [motivo, setMotivo] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const entregarRemitoMutation = useRemitosControllerEntregarRemito({
    mutation: {
      onSuccess: async (response) => {
        const remitoActualizado = response.data as RemitoDto;

        setRemitosCompletos((prev: RemitoDto[]) =>
          prev.map((r: RemitoDto) =>
            r.id === remitoActualizado.id ? remitoActualizado : r
          )
        );

        await refrescarRemitos();
      },
  },
  });
  const noEntregadoMutation = useRemitosControllerMarcarNoEntregado({
    mutation: {
      onSuccess: async (response) => {
        const remitoActualizado = response.data as RemitoDto;

        setRemitosCompletos((prev: RemitoDto[]) =>
          prev.map((r: RemitoDto) =>
            r.id === remitoActualizado.id ? remitoActualizado : r
          )
        );

        await refrescarRemitos();
      },
    },
  });

  const handleConfirm = async() => {
    setError("");

    if (!estado) {
      setError("Seleccioná un estado para el remito");
      return;
    }

    if (estado === "Entregado" && !file) {
      setError("Subí una foto del comprobante de entrega");
      return;
    }

    if (estado === "No entregado" && !motivo.trim()) {
      setError("Escribí el motivo de la no entrega");
      return;
    }

    try {
    if (estado === "Entregado") {
      if (!file) {
        setError("Subí una foto del comprobante de entrega");
        return;
      }
      const formData = new FormData();
      formData.append("file", file); 

      await entregarRemitoMutation.mutateAsync({
        id: remito.id,
        data: formData,
      });
      notify("custom", `Remito N° ${remito.numeroAsignado} entregado correctamente`);
    }

    if (estado === "No entregado") {
      if (!motivo.trim()) {
        setError("Escribí el motivo de la no entrega");
        return;
      }

      await noEntregadoMutation.mutateAsync({
        id: remito.id,
        data: { razonNoEntrega: motivo },
      });
      notify("custom", `Remito N° ${remito.numeroAsignado} marcado como no entregado`);
    }

    onClose?.();
  } catch (err) {
    console.error(err);
    setError("Ocurrió un error al procesar la solicitud");
  }
};

  const handleClose = () => {
    setEstado("");
    setMotivo("");
    setFile(null);
    setError("");
    onClose();
  };

  const handleEstadoChange = (newEstado: "Entregado" | "No entregado" | "") => {
    setEstado(newEstado);
    setMotivo("");
    setFile(null);
    setError("");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validar tipo de archivo
      if (!selectedFile.type.startsWith('image/')) {
        setError("Solo se permiten archivos de imagen");
        return;
      }
      
      // Validar tamaño (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("La imagen no puede superar los 5MB");
        return;
      }
      
      setFile(selectedFile);
      setError("");
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFilePreview = () => {
    if (!file) return null;
    
    const isImage = file.type.startsWith('image/');
    const fileSize = (file.size / (1024 * 1024)).toFixed(2);
    
    return (
      <FilePreview>
        {isImage ? (
          <Avatar 
            src={URL.createObjectURL(file)} 
            variant="rounded" 
            sx={{ width: 40, height: 40 }}
          />
        ) : (
          <Avatar variant="rounded" sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
            <FileText size={20} />
          </Avatar>
        )}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" noWrap>
            {file.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {fileSize} MB
          </Typography>
        </Box>
        <IconButton size="small" onClick={removeFile}>
          <X size={16} />
        </IconButton>
      </FilePreview>
    );
  };

  return (
    <Dialog 
      open={open} 
      onClose={isLoading ? undefined : handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 1 
      }}>
        <Typography variant="body2" fontWeight={600} fontSize={20}>
          Estado del Remito
        </Typography>
        <IconButton 
          onClick={handleClose} 
          disabled={isLoading}
          size="small"
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Información del remito */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 3,
          p: 2,
          backgroundColor: 'grey.50',
          borderRadius: 2
        }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
            <FileText size={20} />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Nº {remito.numeroAsignado}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {remito.destino?.localidad}, {remito.destino?.provincia}
            </Typography>
          </Box>
        </Box>

        {/* Selección de estado */}
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
          Seleccioná el estado:
        </Typography>

        <RadioGroup value={estado} onChange={(e) => handleEstadoChange(e.target.value as any)}>
          <FormControlLabel
            value="Entregado"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle size={18} color="#2E7D32" />
                <Typography>Entregado</Typography>
                <Chip 
                  label="Requiere foto" 
                  size="small" 
                  variant="outlined" 
                  color="success"
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              </Box>
            }
            sx={{ mb: 1 }}
          />
          
          <FormControlLabel
            value="No entregado"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <XCircle size={18} color="#C62828" />
                <Typography>No entregado</Typography>
                <Chip 
                  label="Requiere motivo" 
                  size="small" 
                  variant="outlined" 
                  color="error"
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              </Box>
            }
          />
        </RadioGroup>

        {/* Campo para foto */}
        {estado === "Entregado" && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Foto del comprobante
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Subí una foto clara del remito firmado o del comprobante de entrega
            </Typography>
            
            <Button
              component="label"
              variant="outlined"
              startIcon={<Camera size={18} />}
              fullWidth
              sx={{ 
                textTransform: 'none',
                py: 6,
                borderStyle: 'dashed',
                borderWidth: 2,
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  borderWidth: 2,
                }
              }}
            >
              Tomar o subir foto
              <VisuallyHiddenInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
              />
            </Button>
            
            {getFilePreview()}
          </Box>
        )}

        {/* Campo para motivo */}
        {estado === "No entregado" && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Motivo de no entrega
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Especificá el motivo por el cual no se pudo entregar el remito
            </Typography>
            <TextField
              placeholder="Ej: Cliente no se encontraba, Dirección incorrecta, Rechazó el pedido..."
              fullWidth
              multiline
              rows={4}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Box>
        )}

        {/* Mensaje de error */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button 
          onClick={handleClose} 
          variant="outlined" 
          disabled={isLoading}
          sx={{ minWidth: 100 }}
        >
          Cancelar
        </Button>
        <Button 
          variant="contained" 
          onClick={handleConfirm}
          disabled={isLoading}
          startIcon={isLoading ? <></> : estado === "Entregado" ? <CheckCircle size={18} /> : <XCircle size={18} />}
          sx={{ 
            minWidth: 200,
            boxShadow: 'none',
            backgroundColor: estado === "No entregado" ? '#C62828' : '#2E7D32',
            '&:hover': {
              backgroundColor: estado === "No entregado" ? '#B71C1C' : '#1B5E20',
              boxShadow: 'none',
            }
          }}
        >
          {isLoading ? (
            "Procesando..."
          ) : estado === "Entregado" ? (
            "Marcar como entregado"
          ) : estado === "No entregado" ? (
            "Marcar como no entregado"
          ) : (
            "Confirmar estado"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}