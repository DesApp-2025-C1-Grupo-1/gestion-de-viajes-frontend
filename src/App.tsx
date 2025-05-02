import { Box, Grid, Stack } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./AppRouter";

export function App() {
  

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}
