import { createTheme } from "@mui/material";
import { lightBlue } from "@mui/material/colors";

export const customMuiTheme = createTheme({
  palette: {
    primary: {
      main: '#E65F2B',
    },
    secondary: {
      main: '#f44336',
    },
  },
  typography: {
    fontFamily: 'poppins',
    h2:{
      fontSize: '2rem',
      fontWeight: 900,
      color: "5A5A65",
    },
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiTable:{
      styleOverrides: {
        root: {
          width: "100%",
          minWidth: 600
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 'semibold',
          fontSize: '0.875rem',
          color: "#4B5563",
          border: "none",
          textAlign: "left",
          padding: "14px 18px",
        },
        body: {
          fontSize: '0.875rem',
          color: "#5A5A65",
          border: "none",
          padding: "26px 18px",
        },
        

      }
    },
    MuiTableRow: {
      styleOverrides: {
        head: {
          backgroundColor: "#F6F7FB",
          border: "none",
        },
        root : {
          borderTop: "0.5px solid #C7C7C7",
        }
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "4px",
            backgroundColor: "#fff",
            "& fieldset": {
              borderColor: "#E0E0E0",
            },
            "&:hover fieldset": {
              borderColor: "#C94715",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#C94715",
            },
          },
        },
      },
    },
  }
});
