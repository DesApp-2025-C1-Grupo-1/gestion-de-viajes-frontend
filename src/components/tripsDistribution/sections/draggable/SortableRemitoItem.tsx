import { useSortable } from "@dnd-kit/sortable";
import { RemitoDto } from "../../../../api/generated";
import { Box } from "@mui/material";
import RemitoCard from "../../../trip/modals/RemitoCard";
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from "lucide-react";

export default function SortableRemitoItem({ 
  rem, 
  index, 
  remitoIds, 
  onToggleRemito 
  , quitarRemito
}: { 
  rem: RemitoDto;
  index: number;
  remitoIds: number[];
  onToggleRemito: (id: number) => void;
  quitarRemito: (remito: RemitoDto) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: rem.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        border: isDragging ? '2px dashed #8648B9' : '1px solid #E0E0E0',
        borderRadius: 2,
        backgroundColor: isDragging ? '#F8F5FF' : 'white',
        transition: 'all 0.2s ease',
        position: 'relative',
        opacity: isDragging ? 0.6 : 1,
        '&:hover': {
          borderColor: '#8648B9',
          backgroundColor: '#F8F5FF'
        },
      }}
    >
        <Box
            sx={{
                display: 'flex',
                flexDirection: "column",
                alignItems: 'center',
                height: '100%',
                gap: 5,
            }}
        >
            {/* Número de orden */}
            <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 30,
                height: 30,
                backgroundColor: '#8648B9',
                color: 'white',
                borderRadius: '50%',
                fontWeight: 'bold',
                fontSize: '0.875rem',
            }}
            >
            {index + 1}
            </Box>

            {/* Handle de arrastre */}
            <Box
                {...attributes}
                {...listeners}
                sx={{
                    height: '100%',
                    p: 0.5,
                    border: '1px solid #CCC',
                    borderRadius: "50%",
                    cursor: 'grab',
                    color: '#666',
                    '&:hover': {
                    backgroundColor: '#F0F0F0',
                    color: '#8648B9'
                    },
                    '&:active': {
                    cursor: 'grabbing'
                    }
                }}
            >
                <GripVertical size={20} />
            </Box>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
            <RemitoCard
            rem={rem}
            selectedRemitos={remitoIds}
            onRemitoToggle={() => {
              // si ya está seleccionado -> lo quitamos en vez de solo hacer toggle
              if (remitoIds.includes(rem.id)) {
                quitarRemito(rem);
              } else {
                onToggleRemito(rem.id); // el caso de agregar desde otros contextos
              }
            }}
            showCheckbox={false}
            compactMode={true}
            />
        </Box>
    </Box>
  );
}
