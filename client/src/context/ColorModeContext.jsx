import { createContext, useContext, useMemo, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ColorModeContext = createContext({
  mode: 'light',
  toggleColorMode: () => {}
});

export const useColorMode = () => useContext(ColorModeContext);

const getInitialMode = () => {
  const stored = localStorage.getItem('themeMode');
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: { main: '#9c27b0', light: '#ce93d8' },
    secondary: { main: '#7b1fa2' },
    ...(mode === 'light'
      ? {
          background: { default: '#ffffff', paper: '#ffffff' },
          divider: '#d3cede',
          text: { primary: '#171717', secondary: '#878787' }
        }
      : {
          background: { default: '#0f0f12', paper: '#1a1a1f' },
          divider: '#34343f',
          text: { primary: '#f2f2f4', secondary: '#aaaab4' }
        })
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          colorScheme: mode
        }
      }
    }
  }
});

export const ColorModeProvider = ({ children }) => {
  const [mode, setMode] = useState(getInitialMode);

  const toggleColorMode = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', next);
      return next;
    });
  };

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={{ mode, toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
