import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider,
  IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Avatar, Menu, MenuItem, Tooltip, useMediaQuery, useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard, Person, ShoppingCart,
  Logout, Notifications, Storefront,
} from '@mui/icons-material';
import { getUserData, hasPermission, logout } from '../../api/api';

const DRAWER_WIDTH = 260;

// All possible user nav items — only shown if user has the matching permission
// (Admin role bypasses the check and sees all)
const ALL_NAV_ITEMS = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/user/dashboard', permission: null },         // always visible after login
  { text: 'Profile', icon: <Person />, path: '/user/profile', permission: 'Profile' },
  { text: 'Orders', icon: <ShoppingCart />, path: '/user/orders', permission: 'Orders' },
];

export default function UserLayout(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // ── Auth guard ────────────────────────────────────────────────────────────
  useEffect(() => {
    const user = getUserData();
    if (!user) {
      // Not logged in at all → go to login
      navigate('/login', { replace: true });
    } else if (user.role === 'Admin') {
      // Admin accidentally hit a /user route → send to admin panel
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const user = getUserData();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Show nav items: always show Dashboard; others only if permission matches
  const visibleNavItems = ALL_NAV_ITEMS.filter(
    item => item.permission === null || hasPermission(item.permission)
  );

  const activeTitle =
    ALL_NAV_ITEMS.find(n => location.pathname.startsWith(n.path))?.text ?? 'User Portal';

  // ── Sidebar ───────────────────────────────────────────────────────────────
  const sidebar = (
    <Box sx={{
      height: '100%', display: 'flex', flexDirection: 'column',
      bgcolor: 'white', borderRight: '1px solid #e2e8f0',
    }}>
      {/* Logo */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ p: 1, borderRadius: 2, background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}>
          <Storefront sx={{ color: 'white', fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={800} color="#064e3b" sx={{ lineHeight: 1.2 }}>
            RK Store
          </Typography>
          <Typography variant="caption" color="text.secondary">User Portal</Typography>
        </Box>
      </Box>

      {/* User info card */}
      <Box sx={{ mx: 2, mb: 2, p: 2, bgcolor: '#f0fdf4', borderRadius: 2, border: '1px solid #bbf7d0' }}>
        <Typography variant="body2" fontWeight={700} color="#065f46" noWrap>
          {user?.name ?? 'User'}
        </Typography>
        <Typography variant="caption" color="#6b7280" noWrap>
          {user?.role ?? 'Guest'}
        </Typography>
      </Box>

      <Divider />

      {/* Nav items */}
      <List sx={{ px: 2, pt: 1, flex: 1 }}>
        {visibleNavItems.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              No pages available. Contact your admin.
            </Typography>
          </Box>
        ) : visibleNavItems.map((item) => {
          const active = location.pathname.startsWith(item.path);
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => { navigate(item.path); if (isMobile) setMobileOpen(false); }}
                sx={{
                  borderRadius: 2, px: 2, py: 1.2,
                  bgcolor: active ? 'rgba(5,150,105,0.1)' : 'transparent',
                  borderLeft: active ? '3px solid #059669' : '3px solid transparent',
                  color: active ? '#059669' : '#475569',
                  '&:hover': { bgcolor: 'rgba(5,150,105,0.08)', color: '#047857' },
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

      <Divider />

      {/* Logout */}
      <List sx={{ px: 2, py: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{ borderRadius: 2, color: '#ef4444', '&:hover': { bgcolor: 'rgba(239,68,68,0.08)' } }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 38 }}><Logout /></ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: 14 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>

      {/* ── Top AppBar ── */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          bgcolor: 'white', borderBottom: '1px solid #e2e8f0', color: '#334155',
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

          <Tooltip title="Notifications">
            <IconButton sx={{ color: '#64748b', mr: 1 }}>
              <Notifications />
            </IconButton>
          </Tooltip>

          <Tooltip title={user?.name ?? 'User'}>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: '#059669', width: 36, height: 36, fontSize: 15 }}>
                {user?.name?.[0]?.toUpperCase() ?? 'U'}
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
                <Typography variant="caption" color="text.secondary">{user?.role}</Typography>
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
        {/* Mobile */}
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

        {/* Desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', borderRight: 'none' },
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
          pt: 11,  // clear fixed 64px AppBar
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