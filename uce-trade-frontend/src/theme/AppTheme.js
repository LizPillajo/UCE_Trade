// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

const colors = {
  uceBlueDark: '#0d2149',  // Dark blue
  uceBlueLight: '#1a3a75', // Light blue
  uceGold: '#efb034',      // Gold
  backgroundGray: '#f3f4f6', // Soft background gray
};

export const AppTheme = createTheme({
  palette: {
    primary: {
      main: colors.uceBlueDark,
      light: colors.uceBlueLight,
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.uceGold,
      contrastText: '#0d2149', // Dark text on gold for contrast
    },
    background: {
      default: colors.backgroundGray,
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b', 
      secondary: '#64748b',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none', 
      fontWeight: 600,
    },
  },
});