import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  useTheme,
  Box,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Description as DocumentIcon,
  Support as SupportIcon,
  Assessment as ReportIcon,
  Print as PrintIcon,
  Eco as EcoIcon,
  AttachMoney as FinanceIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Documentos', icon: <DocumentIcon />, path: '/documents' },
  { text: 'Impressoras', icon: <PrintIcon />, path: '/equipment' },
  { text: 'Relatórios', icon: <ReportIcon />, path: '/reports' },
  { text: 'Suporte Técnico', icon: <SupportIcon />, path: '/support' },
  { text: 'Sustentabilidade', icon: <EcoIcon />, path: '/sustainability' },
  { text: 'Financeiro', icon: <FinanceIcon />, path: '/financial' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={isOpen}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          mt: 8,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={onClose}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main + '20',
                '&:hover': {
                  backgroundColor: theme.palette.primary.main + '30',
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: location.pathname === item.path
                  ? theme.palette.primary.main
                  : 'inherit',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                '& .MuiListItemText-primary': {
                  color: location.pathname === item.path
                    ? theme.palette.primary.main
                    : 'inherit',
                },
              }}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
