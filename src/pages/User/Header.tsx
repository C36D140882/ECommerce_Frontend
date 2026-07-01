import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  ListItemIcon,
  Menu,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  type SelectChangeEvent,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AccountCircle,
  Assignment,
  BusinessOutlined,
  Logout,
  Person,
  Search,
  ShoppingBag,
} from '@mui/icons-material';
import { getUserData, logout } from '../../api/api';
import { fetchCategories, type Category } from '../../api/homeApi';

export default function Header(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUserData();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const open = Boolean(anchorEl);

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        const categoryData = await fetchCategories();
        if (active) setCategories(categoryData);
      } catch (error) {
        if (active) setCategories([]);
        console.error('Unable to load header categories:', error);
      } finally {
        if (active) setCategoriesLoading(false);
      }
    };

    void loadCategories();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const categoryPath = location.pathname.match(/^\/categories\/([^/]+)\/?$/);
    setSelectedCategory(
      categoryPath?.[1] ? decodeURIComponent(categoryPath[1]) : 'all',
    );
  }, [location.pathname]);

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);

    if (categoryId === 'all') {
      navigate('/categories');
      return;
    }

    navigate(`/categories/${encodeURIComponent(categoryId)}`);
  };

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

  const categorySelectValue =
    selectedCategory === 'all'
    || categories.some((category) => category.category_id === selectedCategory)
      ? selectedCategory
      : 'all';

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
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        <ShoppingBag sx={{ color: '#003be0', fontSize: 36 }} />
        <Typography variant="h5" fontWeight={800} sx={{ color: '#0f172a' }}>
          RK Store
        </Typography>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ flex: 1, maxWidth: 600, mx: 4 }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search for products..."
          InputProps={{
            sx: { bgcolor: 'white', borderRadius: 1 },
            endAdornment: (
              <InputAdornment position="end" sx={{ mr: -1.5 }}>
                <IconButton
                  sx={{
                    bgcolor: '#003be0',
                    color: 'white',
                    borderRadius: '0 4px 4px 0',
                    p: 1.25,
                    '&:hover': { bgcolor: '#003be0' },
                  }}
                >
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Select<string>
          value={categorySelectValue}
          onChange={handleCategoryChange}
          size="small"
          displayEmpty
          disabled={categoriesLoading}
          sx={{ minWidth: 190, bgcolor: 'white', borderRadius: 1 }}
        >
          <MenuItem value="all">All Categories</MenuItem>

          {categoriesLoading && (
            <MenuItem value="loading" disabled>
              Loading categories...
            </MenuItem>
          )}

          {!categoriesLoading
            && categories.map((category) => (
              <MenuItem key={category.id} value={category.category_id}>
                {category.category_icon
                  ? `${category.category_icon} ${category.category_name}`
                  : category.category_name}
              </MenuItem>
            ))}
        </Select>
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center">
        <Button
          startIcon={<Assignment />}
          onClick={() => navigate('/home')}
          sx={{
            color: '#003be0',
            border: '1px solid #003be0',
            fontWeight: 600,
            backgroundColor: '#FFFFFF'
          }}
        >
          Home
        </Button>

        <Button
          startIcon={<BusinessOutlined />}
          onClick={() => navigate('/companies')}
          sx={{
            color: '#003be0',
            fontWeight: 600,
            border: '1px solid #003be0',
            textTransform: 'none',
            backgroundColor: '#FFFFFF'

          }}
        >
          Companies
        </Button>

        <Button
          startIcon={<Assignment />}
          onClick={() => navigate('/orders')}
          sx={{
            color: '#003be0',
            border: '1px solid #003be0',
            fontWeight: 600,
            backgroundColor: '#ffffff',

          }}
        >
          Orders
        </Button>

        <Button
          variant="contained"
          startIcon={<Person />}
          onClick={() => navigate('/admin/login')}
          sx={{
            bgcolor: '#003be0',
            textTransform: 'none',
            '&:hover': { bgcolor: '#003be0' },
          }}
        >
          ADM Login
        </Button>

        <IconButton
          onClick={handleClick}
          size="small"
          sx={{
            ml: 2,
            border: '2px solid transparent',
            '&:hover': { borderColor: '#003be0' },
          }}
        >
          <Avatar sx={{ bgcolor: '#f1f5f9', color: '#003be0', fontWeight: 700 }}>
            {user
              ? String(
                user.username
                || user.first_name
                || user.name
                || user.mobile_number
                || 'U',
              ).charAt(0).toUpperCase()
              : 'U'}
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
              '& .MuiMenuItem-root': { py: 1.5 },
            },
          }}
        >
          <MenuItem onClick={handleProfile}>
            <ListItemIcon>
              <AccountCircle fontSize="small" sx={{ color: '#475569' }} />
            </ListItemIcon>
            <Typography variant="body2" fontWeight={600} color="#1e293b">
              Profile
            </Typography>
          </MenuItem>

          <Divider sx={{ my: 0.5 }} />

          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" sx={{ color: '#ef4444' }} />
            </ListItemIcon>
            <Typography variant="body2" fontWeight={600} color="#ef4444">
              Logout
            </Typography>
          </MenuItem>
        </Menu>
      </Stack>
    </Box>
  );
}
