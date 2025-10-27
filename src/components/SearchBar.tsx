import { TextField, InputAdornment } from "@mui/material";
import { SearchIcon } from "lucide-react";

interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    children?: React.ReactNode;
    placeholder: string;
}

export default function SearchBar({searchQuery, setSearchQuery, children, placeholder}: SearchBarProps) {

    return(
        <div className="flex flex-col sm:flex-row justify-between mb-5">
            <TextField
                id="search"
                name="search"
                variant="outlined"
                size="small"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon className="size-5"/>
                    </InputAdornment>
                    ),
                    style: {
                        fontSize: "0.9rem",
                        padding: "5px 12px",
                        borderRadius: 8,
                    },
                }}
                sx={{
                    width: {xs:"100%", md: "350px"},
                    
                }}
            />
            {children}
        </div>
    )
}