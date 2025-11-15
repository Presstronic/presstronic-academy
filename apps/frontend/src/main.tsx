/**
 * @file
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import './index.css';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { theme } from './theme';

// Enable React DevTools Profiler in development
if (import.meta.env.DEV) {
  const rootElement = document.getElementById('root')!;
  rootElement.setAttribute('data-react-devtools-profiler', 'true');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
