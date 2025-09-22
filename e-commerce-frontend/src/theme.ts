'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00f5ff',
    },
    secondary: {
      main: '#ff00ff',
    },
    background: {
      default: '#121212',
      paper: 'rgba(18,18,18,0.8)',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(18,18,18,0.8)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(18,18,18,0.8)',
        },
      },
    },
    MuiModal: {
      defaultProps: {
        keepMounted: true,
        slotProps: {
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(4px)',
            },
          },
        },
      },
    },
    MuiPopover: {
      defaultProps: {
        keepMounted: true,
      },
    },
    MuiPopper: {
      defaultProps: {
        keepMounted: true,
      },
    },
    MuiDialog: {
      defaultProps: {
        keepMounted: true,
        slotProps: {
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(4px)',
            },
          },
        },
      },
    },
  },
});

export default theme; 