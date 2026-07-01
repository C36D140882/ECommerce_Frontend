import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton,
  ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Menu,
  MenuItem, Tooltip, useMediaQuery, useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard, People, Security,
  Logout, Storefront, HomeWorkOutlined, BusinessOutlined,
} from '@mui/icons-material';
import { getUserData, logout } from '../../api/api';

const DRAWER_WIDTH = 260;

const NAV_ITEMS = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
  { text: 'Home Content', icon: <HomeWorkOutlined />, path: '/admin/home-content' },
  { text: 'Companies', icon: <BusinessOutlined />, path: '/admin/companies' },
  { text: 'Users', icon: <People />, path: '/admin/users' },
  { text: 'Roles', icon: <Security />, path: '/admin/roles' },
];

export default function AdminLayout(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // ── Auth guard: redirect non-admin visitors to admin login ────────────────
  useEffect(() => {
    const user = getUserData();
    if (!user || user.role !== 'Admin') {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  const user = getUserData();

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const activeTitle = NAV_ITEMS.find(n => location.pathname.startsWith(n.path))?.text ?? 'Admin Panel';

  // ── Sidebar content ────────────────────────────────────────────────────────
  const sidebar = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#ffffff', color: '#1e293b' }}>
      {/* Logo */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#eff6ff' }}>
          <Storefront sx={{ color: '#2563eb', fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={800} color="#1e293b" sx={{ lineHeight: 1.2 }}>
            RK Store
          </Typography>
          <Typography variant="caption" color="#94a3b8">Admin Panel</Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#e2e8f0' }} />

      {/* Nav */}
      <List sx={{ px: 2, pt: 2, flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = location.pathname.startsWith(item.path);
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => { navigate(item.path); if (isMobile) setMobileOpen(false); }}
                sx={{
                  borderRadius: 2, px: 2, py: 1.2,
                  bgcolor: active ? '#eff6ff' : 'transparent',
                  borderLeft: active ? '3px solid #2563eb' : '3px solid transparent',
                  color: active ? '#2563eb' : '#64748b',
                  transition: 'all 0.15s',
                  '&:hover': { bgcolor: '#eff6ff', color: '#2563eb' },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 38 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 600 : 500 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: '#e2e8f0' }} />

      {/* Admin info */}
      <Box sx={{ px: 3, py: 2 }}>
        <Typography variant="body2" color="#1e293b" fontWeight={600} noWrap>
          {user?.name ?? 'Admin'}
        </Typography>
        <Typography variant="caption" color="#94a3b8" noWrap>{user?.email}</Typography>
      </Box>

      {/* Logout */}
      <List sx={{ px: 2, py: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{ borderRadius: 2, color: '#ef4444', '&:hover': { bgcolor: '#fef2f2' } }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 38 }}><Logout /></ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: 14 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f1f5f9' }}>

      {/* ── Top AppBar ── */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          bgcolor: 'white',
          borderBottom: '1px solid #e2e8f0',
          color: '#334155',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit" edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" fontWeight={700} color="#1e293b" sx={{ flexGrow: 1 }}>
            {activeTitle}
          </Typography>

          <Tooltip title="Admin Account">
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: '#1e40af', width: 36, height: 36, fontSize: 15 }}>
                {user?.name?.[0]?.toUpperCase() ?? 'A'}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl} open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            sx={{ mt: '45px' }}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem disabled sx={{ opacity: '1 !important' }}>
              <Box>
                <Typography variant="body2" fontWeight={700}>{user?.name}</Typography>
                <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <Logout fontSize="small" sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* ── Sidebar ── */}
      <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
          }}
        >
          {sidebar}
        </Drawer>

        {/* Desktop permanent drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              borderRight: '1px solid #e2e8f0',
            },
          }}
          open
        >
          {sidebar}
        </Drawer>
      </Box>

      {/* ── Page content via <Outlet /> ── */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: 11,  // clear the fixed AppBar (64px toolbar + 24px extra)
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          overflow: 'auto',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}