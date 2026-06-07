import React, { useMemo, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Stack,
  InputAdornment,
  Avatar,
  Paper,
} from '@mui/material';
import {
  Search,
  Category,
  ShoppingBag,
  Dashboard,
  Storefront,
  TrendingUp,
} from '@mui/icons-material';
import { mockProducts } from '../data/mockStore';

export default function HomePage(): React.ReactElement {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(8);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(mockProducts.map((item) => item.category)))],
    []
  );

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((item) => {
      const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === 'All' || item.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [category, query]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setVisibleCount(8);
  };

  const handleCategoryChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setCategory(e.target.value as string);
    setVisibleCount(8);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #07111f 0%, #111827 45%, #172554 100%)',
        color: 'white',
        py: { xs: 2, md: 3 },
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 } }}>
        {/* Header / Navbar */}
        <Card
          sx={{
            borderRadius: 4,
            bgcolor: 'rgba(15, 23, 42, 0.92)',
            border: '1px solid rgba(148, 163, 184, 0.18)',
            boxShadow: '0 18px 40px rgba(15, 23, 42, 0.35)',
            mb: 4,
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', md: 'center' }}
              spacing={2}
            >
              <Box>
                <Chip
                  label="Storefront"
                  sx={{
                    bgcolor: 'rgba(125, 211, 252, 0.12)',
                    color: '#e0f2fe',
                    border: '1px solid rgba(125, 211, 252, 0.18)',
                  }}
                />
                <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>
                  E‑Shop
                </Typography>
                <Typography color="rgba(224, 242, 254, 0.88)">
                  Discover modern products, smart deals, and a polished admin dashboard.
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<Storefront />}
                  href="/"
                  sx={{ color: '#bfdbfe', borderColor: 'rgba(147,197,253,0.35)' }}
                >
                  Home
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Dashboard />}
                  href="/admin/login"
                  sx={{ background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)' }}
                >
                  Admin Login
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Hero Section */}
        <Card
          sx={{
            borderRadius: 4,
            bgcolor: 'rgba(15, 23, 42, 0.94)',
            border: '1px solid rgba(148, 163, 184, 0.18)',
            boxShadow: '0 16px 32px rgba(15, 23, 42, 0.35)',
            mb: 4,
            textAlign: 'center',
            py: { xs: 4, md: 6 },
            px: { xs: 2, md: 4 },
          }}
        >
          <Typography
            variant="overline"
            sx={{ color: '#7dd3fc', letterSpacing: 2, fontWeight: 600 }}
          >
            Fresh collection
          </Typography>
          <Typography
            variant="h2"
            fontWeight={800}
            sx={{
              background: 'linear-gradient(120deg, #ffffff, #38bdf8)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              mb: 2,
              fontSize: { xs: '2rem', md: '3.5rem' },
            }}
          >
            Discover modern products, smart deals
          </Typography>
          <Typography color="rgba(224,242,254,0.88)" sx={{ maxWidth: 700, mx: 'auto' }}>
            Search across categories, review featured products, and jump into the admin panel for
            inventory control.
          </Typography>
        </Card>

        {/* Filter Bar */}
        <Card
          sx={{
            borderRadius: 4,
            bgcolor: 'rgba(15, 23, 42, 0.94)',
            border: '1px solid rgba(148, 163, 184, 0.18)',
            boxShadow: '0 16px 32px rgba(15, 23, 42, 0.35)',
            mb: 4,
          }}
        >
          <CardContent>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <TextField
                fullWidth
                placeholder="Search products..."
                value={query}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    bgcolor: 'rgba(15, 23, 42, 0.85)',
                    color: 'white',
                    borderRadius: 3,
                  },
                }}
                sx={{ '& .MuiOutlinedInput-root': { color: 'white' } }}
              />
              <FormControl fullWidth>
                <Select
                  value={category}
                  // onChange={handleCategoryChange}
                  displayEmpty
                  sx={{
                    bgcolor: 'rgba(15, 23, 42, 0.85)',
                    color: 'white',
                    borderRadius: 3,
                    '& .MuiSelect-icon': { color: 'white' },
                  }}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </CardContent>
        </Card>

        {/* Info Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Box>
            <Card
              sx={{
                borderRadius: 4,
                bgcolor: 'rgba(15, 23, 42, 0.94)',
                border: '1px solid rgba(148, 163, 184, 0.18)',
                boxShadow: '0 16px 32px rgba(15, 23, 42, 0.35)',
                height: '100%',
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#7dd3fc' }}>
                    <Category />
                  </Avatar>
                  <Typography variant="h6" fontWeight={700}>
                    Top Categories
                  </Typography>
                </Stack>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {categories
                    .filter((c) => c !== 'All')
                    .map((cat) => (
                      <Chip
                        key={cat}
                        label={cat}
                        sx={{
                          bgcolor: 'rgba(125, 211, 252, 0.12)',
                          color: '#e0f2fe',
                          border: '1px solid rgba(125, 211, 252, 0.18)',
                        }}
                      />
                    ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
          <Box>
            <Card
              sx={{
                borderRadius: 4,
                bgcolor: 'rgba(15, 23, 42, 0.94)',
                border: '1px solid rgba(148, 163, 184, 0.18)',
                boxShadow: '0 16px 32px rgba(15, 23, 42, 0.35)',
                height: '100%',
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#7dd3fc' }}>
                    <TrendingUp />
                  </Avatar>
                  <Typography variant="h6" fontWeight={700}>
                    Store Highlights
                  </Typography>
                </Stack>
                <Stack spacing={1}>
                  <Typography color="rgba(224,242,254,0.88)">
                    ✨ Responsive storefront layout
                  </Typography>
                  <Typography color="rgba(224,242,254,0.88)">
                    🔍 Search and category filters
                  </Typography>
                  <Typography color="rgba(224,242,254,0.88)">
                    🛠️ Admin CRUD-ready dashboard
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* Products Section */}
        <Card
          sx={{
            borderRadius: 4,
            bgcolor: 'rgba(15, 23, 42, 0.94)',
            border: '1px solid rgba(148, 163, 184, 0.18)',
            boxShadow: '0 16px 32px rgba(15, 23, 42, 0.35)',
            mb: 4,
          }}
        >
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 3 }}
              flexWrap="wrap"
            >
              <Typography variant="h5" fontWeight={700}>
                Featured Products
              </Typography>
              <Chip
                label={`${filteredProducts.length} items`}
                sx={{
                  bgcolor: 'rgba(56, 189, 248, 0.12)',
                  color: '#e0f2fe',
                  border: '1px solid rgba(125, 211, 252, 0.18)',
                }}
              />
            </Stack>

            <Grid container spacing={3}>
              {visibleProducts.map((product) => (
                <Box key={product.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: 'rgba(15, 23, 42, 0.88)',
                      border: '1px solid rgba(148, 163, 184, 0.16)',
                      borderRadius: 3,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 30px -12px rgba(0,0,0,0.5)',
                        borderColor: 'rgba(125, 211, 252, 0.4)',
                      },
                    }}
                  >
                    <Chip
                      label={product.category}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(125, 211, 252, 0.12)',
                        color: '#7dd3fc',
                        mb: 1.5,
                      }}
                    />
                    <Typography variant="h6" fontWeight={700} color="white">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="rgba(224,242,254,0.82)" sx={{ mt: 0.5 }}>
                      {product.status} • {product.stock} in stock
                    </Typography>
                    <Typography variant="h5" fontWeight={800} color="#38bdf8" sx={{ mt: 1.5 }}>
                      ${product.price.toFixed(2)}
                    </Typography>
                  </Paper>
                </Box>
              ))}
            </Grid>

            {filteredProducts.length === 0 && (
              <Typography textAlign="center" color="rgba(224,242,254,0.88)" sx={{ py: 4 }}>
                No products match your search.
              </Typography>
            )}

            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
              {filteredProducts.length > visibleCount && (
                <Button
                  variant="outlined"
                  onClick={() => setVisibleCount((prev) => prev + 4)}
                  sx={{
                    color: '#bfdbfe',
                    borderColor: 'rgba(147,197,253,0.35)',
                    '&:hover': { borderColor: '#38bdf8' },
                  }}
                >
                  Load more products
                </Button>
              )}
              {visibleCount > 8 && (
                <Button
                  variant="outlined"
                  onClick={() => setVisibleCount(8)}
                  sx={{
                    color: '#bfdbfe',
                    borderColor: 'rgba(147,197,253,0.35)',
                    '&:hover': { borderColor: '#f97316' },
                  }}
                >
                  Show less
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', py: 3, mt: 2 }}>
          <Typography color="rgba(224,242,254,0.7)" variant="body2">
            © 2026 E-Shop • Admin dashboard and storefront UI ready for your next integration.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}