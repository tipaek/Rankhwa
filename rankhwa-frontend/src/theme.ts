import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#6F5CF7' },   // mock-up purple
    background: { default: '#fafafa' }
  },
  shape: { borderRadius: 12 },
  typography: { fontFamily: ['"Inter"', 'sans-serif'].join(',') }
});

export default theme;
