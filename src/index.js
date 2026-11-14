import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './index.css';
import App from './App';
import Context from './Context/Context';

// one colour scheme and one font for the whole website
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#ff6f00' },
    success: { main: '#2e7d32' },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Context>
        <App />
      </Context>
    </ThemeProvider>
  </React.StrictMode>
);
