import { Dialog, DialogContent, DialogTitle, Button, DialogActions, Typography } from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  genre: string;
  entityName: string;
  content?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  genre,
  content,
  entityName ,
  confirmText = "Eliminar",
  cancelText = "Cancelar"
}: ConfirmDialogProps) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      aria-labelledby="confirm-dialog-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="confirm-dialog-title">Eliminar {title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          ¿Estás seguro que deseas eliminar {genre} {title}{": "}
          <strong>{entityName}</strong>?
        </Typography>
        {content}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};