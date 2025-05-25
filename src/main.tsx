import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import axios from 'axios';

import { customMuiTheme } from './config/customMuiTheme';
import { App } from './App';

import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

axios.defaults.baseURL = 'http://localhost:3000';

// Aseguramos que 'root' no sea null
const rootElement = document.getElementById('root') as HTMLElement;

const queryClient = new QueryClient();

ReactDOM.createRoot(rootElement).render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={customMuiTheme}>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
);