import React from 'react';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { theme } from '../../theme';
import { Toaster } from 'react-hot-toast';

const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Navbar onMenuClick={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            backgroundColor: 'background.default',
          }}
        >
          <Outlet />
        </Box>
      </Box>
      <Toaster position="top-right" />
    </ThemeProvider>
  );
};

export default AppLayout;
