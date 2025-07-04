import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';

import { customMuiTheme } from './config/customMuiTheme';
import { App } from './App';
import { store } from './store/store';

import './index.css';

// Aseguramos que 'root' no sea null
const rootElement = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(rootElement).render(
  <Provider store={store}>
    <ThemeProvider theme={customMuiTheme}>
      <App />
    </ThemeProvider>
  </Provider>
);