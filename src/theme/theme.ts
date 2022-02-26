import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
    shape: {
      borderRadius: 8
    },
  });;
  
export const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
    shape: {
      borderRadius: 8
    }
  });;