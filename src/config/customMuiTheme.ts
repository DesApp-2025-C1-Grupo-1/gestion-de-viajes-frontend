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
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 'bold',
          fontSize: '1rem',
          color: lightBlue[900]
        }
      }
    }
  }
});
