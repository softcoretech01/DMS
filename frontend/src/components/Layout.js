import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  FolderOpen as FolderIcon,
  CloudUpload as UploadIcon,
  DocumentScanner as DocumentIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  BarChart as ReportIcon,

  Menu as MenuIcon,
  Backup as BulkIcon,
} from '@mui/icons-material';
import { useDMS } from '../context/DMSContext';
import { usePermissions } from '../context/PermissionContext';

const drawerWidth = 280;

const navItems = [
  { label: 'Dashboard', path: '/home', icon: DashboardIcon },

  { label: 'Folder Manager', path: '/folders', icon: FolderIcon },
  { label: 'Upload Document', path: '/upload', icon: UploadIcon },
  { label: 'Bulk Operations', path: '/bulk', icon: BulkIcon },
  { label: 'Document List', path: '/documents', icon: DocumentIcon },
  {label: 'Document Detail', path: '/documents/1', icon: DocumentIcon},
 { label: 'Search & Tags', path: '/search', icon: SearchIcon },
  { label: 'Reports', path: '/reports', icon: ReportIcon },
  { label: 'Permissions', path: '/permissions', icon: SettingsIcon },
];

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
const [userMenuAnchor, setUserMenuAnchor] = useState(null);

const { currentUser } = useDMS();
const {
  hasPermission,
  permissions
} = usePermissions();

console.log(
  "LAYOUT PERMISSIONS =",
  permissions
);

console.log(
  "DOCUMENT VIEW =",
  hasPermission("Documents", "can_view")
);

console.log(
  "FOLDER VIEW =",
  hasPermission("Folders", "can_view")
);

console.log(
  "REPORT VIEW =",
  hasPermission("Reports", "can_view")
);

console.log(
  "USER VIEW =",
  hasPermission("Users", "can_view")
);
 
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

 

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleLogout = () => {

  localStorage.removeItem("user");

  navigate("/login");

};

  const filteredNavItems = navItems.filter((item) => {

  if (item.label === 'Dashboard')
    return true;

  if (item.label === 'Folder Manager')
    return hasPermission('Folders', 'can_view');

  if (item.label === 'Document List')
    return hasPermission('Documents', 'can_view');

  if (item.label === 'Document Detail')
    return hasPermission('Documents', 'can_view');

  if (item.label === 'Upload Document')
    return hasPermission('Documents', 'can_upload');

  if (item.label === 'Search & Tags')
    return hasPermission('Documents', 'can_view');

  if (item.label === 'Bulk Operations')
    return hasPermission('Bulk Upload', 'can_view');

  if (item.label === 'Reports')
    return hasPermission('Reports', 'can_view');

  if (item.label === 'Permissions')
    return hasPermission('Users', 'can_view');

  return true;
});

console.log("NAV ITEMS =", filteredNavItems);
  
 
  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo Section */}
      <Box
        sx={{
          p: 2,
          backgroundColor: 'primary.main',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <DocumentIcon sx={{ fontSize: 32, mb: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          DMS
        </Typography>
        <Typography variant="caption">Document Management System</Typography>
      </Box>

      <Divider />

      {/* Navigation Items */}
      <List sx={{ flex: 1, overflow: 'auto' }}>
        {filteredNavItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  backgroundColor: isActive ? 'primary.light' : 'transparent',
                  color: isActive ? 'primary.main' : 'inherit',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'primary.main' : 'inherit',
                    minWidth: 40,
                  }}
                >
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* User Info Section */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
            {(currentUser?.name || 'U').charAt(0)}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }} noWrap>
              {currentUser?.name || 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {currentUser.role}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: 'primary.main',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flex: 1, fontWeight: 'bold' }}>
            Document Management System
          </Typography>

          {/* User Menu */}
          <Box>
            <IconButton
              onClick={handleUserMenuOpen}
              sx={{
                p: 0,
                color: 'inherit',
              }}
            >
              <Avatar sx={{ width: 36, height: 36, bgcolor: 'secondary.main' }}>
                {(currentUser?.name || 'U').charAt(0)}

              </Avatar>
            </IconButton>
            <Menu
              anchorEl={userMenuAnchor}
              open={Boolean(userMenuAnchor)}
              onClose={handleUserMenuClose}
            >
              <MenuItem disabled>
  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
    {localStorage.getItem("username")}
  </Typography>
</MenuItem>

<MenuItem disabled>
  <Typography variant="caption" color="text.secondary">
    Current: {localStorage.getItem("role")}
  </Typography>
</MenuItem>
              <Divider />

<MenuItem disabled>

  <Typography
    variant="body2"
  >
    Role : {currentUser?.role}
  </Typography>

</MenuItem>

<MenuItem
  onClick={handleLogout}
>

  Logout

</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
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
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          p: { xs: 2, sm: 3 },
          mt: 8,
          background: 'linear-gradient(180deg, #f7fbff 0%, #f5f7fb 60%, #f3f4f6 100%)',
          overflow: 'auto',
        }}
      >

        {children}
      </Box>
    </Box>
  );
};

export default Layout;
