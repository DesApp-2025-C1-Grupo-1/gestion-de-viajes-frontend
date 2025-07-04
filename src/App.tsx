import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./AppRouter";
import { Toaster } from "sonner";

export function App() {
  

  return (
    <BrowserRouter>
      <Toaster
        richColors
        position="top-right"
        toastOptions={{
          className: "rounded-xl shadow-lg font-medium",
        }}
      />
      <AppRouter />
    </BrowserRouter>
  )
}
