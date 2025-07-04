import { createTheme } from "@mui/material";

export const customMuiTheme = createTheme({
  palette: {
    primary: {
      main: '#E65F2B',
    },
    secondary: {
      main: '#f44336', // Usado como color de alerta por defecto, puedes cambiarlo
    },
    error: {
      main: '#DD5050', // --color-delete
    },
    warning: {
      main: '#E01414', // --color-delete-hover
    },
    grey: {
      100: '#F6F7FB', // --color-table-header
      200: '#C7C7C7', // --color-line
    },
    success: {
      main: '#2F691D', // --color-title-type
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
          //pruebapicker
          "&.date-picker .MuiOutlinedInput-root": {
            borderRadius: "6px !important",
            height:"48px !important",
            padding: "0px 14px !important",
          },
          //
          "&.inside-paper .MuiOutlinedInput-root": {
            borderRadius: 6,
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: '0.900rem',
            "& input": {
              padding: "12px 12px", 
            },
          },
          "&.inside-paper .MuiOutlinedInput-root fieldset": { 
            border: "0.5px solid #C7C7C7",
            borderRadius: 6,
          },
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
    MuiMenu:{
      styleOverrides:{
        paper:{
          maxHeight:200,
          overflowY:"auto",
          border: "1px solid #C7C7C7",
          boxShadow: "0px 2px 4px rgba(199, 199, 199, 1.00)",
        },
      },
    },
    MuiSelect:{
      styleOverrides:{
        root:{
          borderRadius:6,
          height:"48px",
          padding: "0px 14px",
        },
      },
    },
    MuiMenuItem:{
      styleOverrides:{
        root:{
          "&:hover":{
            backgroundColor:"#e0e0e0"
          },
          color: "#5A5A65",
          fontSize: '0.900rem'
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '12px',
          padding: '10px',
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  }
});