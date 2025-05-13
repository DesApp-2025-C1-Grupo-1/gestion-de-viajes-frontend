import { TextField, InputAdornment } from "@mui/material";
import { SearchIcon } from "lucide-react";

interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    children?: React.ReactNode;
}

export default function SearchBar({searchQuery, setSearchQuery, children}: SearchBarProps) {

    return(
        <div className="flex flex-col sm:flex-row justify-between gap-2 mb-5">
            <TextField
                id="search"
                name="search"
                variant="outlined"
                size="small"
                placeholder="Buscar vehiculo por patente o modelo"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon className="size-4"/>
                    </InputAdornment>
                    ),
                    style: {
                        fontSize: "0.82rem", 
                        height: 40
                    },
                }}
                className="w-full sm:w-full sm:max-w-80 "
            />
            {children}
        </div>
    )
}