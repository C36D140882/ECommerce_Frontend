import React, { useState } from 'react';
import { Box, Typography, Button, Stack, TextField, InputAdornment, IconButton, MenuItem, Select, Avatar, Menu, Divider, ListItemIcon } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Assignment, Person, Logout, AccountCircle } from '@mui/icons-material';
import { getUserData, logout } from '../../api/api';

export default function Header(): React.ReactElement {
  const navigate = useNavigate();
  const user = getUserData();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 2,
        mb: 2,
        bgcolor: 'white',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
        <ShoppingBag sx={{ color: '#0047FF', fontSize: 36 }} />
        <Typography variant="h5" fontWeight={800} sx={{ color: '#0f172a' }}>
          RK Store
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: 1, maxWidth: 600, mx: 4 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search for products..."
          InputProps={{
            sx: { bgcolor: 'white', borderRadius: 1 },
            endAdornment: (
              <InputAdornment position="end" sx={{ mr: -1.5 }}>
                <IconButton sx={{ bgcolor: '#0047FF', color: 'white', borderRadius: '0 4px 4px 0', p: 1.25, '&:hover': { bgcolor: '#003be0' } }}>
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Select
          defaultValue="All Categories"
          size="small"
          sx={{ minWidth: 150, bgcolor: 'white', borderRadius: 1 }}
        >
          <MenuItem value="All Categories">All Categories</MenuItem>
          <MenuItem value="Grocery">Grocery</MenuItem>
          <MenuItem value="Personal Care">Personal Care</MenuItem>
        </Select>
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center">
        <Button
          startIcon={<Assignment />}
          onClick={() => navigate('/home')}
          sx={{
            color: '#ffffff',
            borderColor: '#0047FF',
            fontWeight: 600,
          }}
        >
          Home
        </Button>
        <Button
          startIcon={<Assignment />}
          onClick={() => navigate('/orders')}
          sx={{
            color: '#ffffff',
            borderColor: '#0047FF',
            fontWeight: 600,
          }}
        >
          Orders
        </Button>
        <Button
          variant="contained"
          startIcon={<Person />}
          onClick={() => navigate('/admin/login')}
          sx={{
            bgcolor: '#0047FF',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { bgcolor: '#003be0' },
          }}
        >
          ADM Login
        </Button>

        {/* Profile Logo & Dropdown */}
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2, border: '2px solid transparent', '&:hover': { borderColor: '#0047FF' } }}
        >
          <Avatar sx={{ bgcolor: '#f1f5f9', color: '#0047FF', fontWeight: 700 }}>
            {user ? String(user.username || user.first_name || user.name || user.mobile_number || 'U').charAt(0).toUpperCase() : 'U'}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: 1.5,
              minWidth: 200,
              borderRadius: 2,
              '& .MuiMenuItem-root': { py: 1.5 }
            }
          }}
        >
          <MenuItem onClick={handleProfile}>
            <ListItemIcon>
              <AccountCircle fontSize="small" sx={{ color: '#475569' }} />
            </ListItemIcon>
            <Typography variant="body2" fontWeight={600} color="#1e293b">Profile</Typography>
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" sx={{ color: '#ef4444' }} />
            </ListItemIcon>
            <Typography variant="body2" fontWeight={600} color="#ef4444">Logout</Typography>
          </MenuItem>
        </Menu>
      </Stack>
    </Box>
  );
}
