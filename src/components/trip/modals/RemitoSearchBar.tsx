import { TextField } from "@mui/material";
import { Search } from "lucide-react";

interface RemitoSearchBarProps {
    remitosSearch: string;
    setRemitosSearch: (value: string) => void;
}

export default function RemitoSearchBar({ remitosSearch, setRemitosSearch }: RemitoSearchBarProps) {
    return (
        <TextField
            variant="outlined"
            placeholder="Buscar remitos..."
            fullWidth
            size="small"
            className="inside-paper"
            InputProps={{
            startAdornment: (
                <Search className="h-5 w-5 text-gray-500" />
            ),
            }}
            sx={{
            "& .MuiOutlinedInput-root": {
                "& fieldset": {
                borderColor: "#ccc",
                },
                "&:hover fieldset": {
                borderColor: "#8648B9",
                },
                "&.Mui-focused fieldset": {
                borderColor: "#8648B9",
                },
            },
            transition: "border-color 0.3s",
            }}
            onChange={(e) => {
            setRemitosSearch(e.target.value);
            }}
            value={remitosSearch}
        />
    );
}