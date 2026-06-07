import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  DashboardOutlined,
  LogoutOutlined,
  StorefrontOutlined,
  TrendingUpOutlined,
} from '@mui/icons-material';
import { mockOrders, mockProducts } from '../data/mockStore';

interface ProductForm {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: string;
  status: string;
}

export default function AdminDashboard(): React.ReactElement {
  const navigate = useNavigate();
  const [products, setProducts] = useState(mockProducts);
  const [orders] = useState(mockOrders);
  const [form, setForm] = useState<ProductForm>({
    id: '',
    name: '',
    category: '',
    price: '',
    stock: '',
    status: 'Active',
  });

  useEffect(() => {
    if (!localStorage.getItem('adminSession')) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const summary = useMemo(
    () => ({
      totalProducts: products.length,
      totalStock: products.reduce((sum, item) => sum + item.stock, 0),
      totalValue: products.reduce((sum, item) => sum + item.price * item.stock, 0),
    }),
    [products]
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name || !form.category || !form.price) return;

    const nextProduct = {
      id: form.id ? Number(form.id) : Date.now(),
      name: form.name,
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock || 0),
      status: form.status,
    };

    setProducts((prev) => {
      const exists = prev.some((item) => item.id === nextProduct.id);
      return exists
        ? prev.map((item) => (item.id === nextProduct.id ? nextProduct : item))
        : [nextProduct, ...prev];
    });

    setForm({ id: '', name: '', category: '', price: '', stock: '', status: 'Active' });
  };

  const handleEdit = (product: typeof mockProducts[0]) => {
    setForm({
      id: String(product.id),
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      status: product.status,
    });
  };

  const handleDelete = (productId: number) => {
    setProducts((prev) => prev.filter((item) => item.id !== productId));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #07111f 0%, #111827 45%, #172554 100%)',
        color: 'white',
        p: { xs: 2, md: 3 },
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: 'auto', display: 'grid', gap: 3 }}>
        {/* Header card - same as before */}
        <Card sx={{ borderRadius: 4, bgcolor: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.18)', boxShadow: '0 18px 40px rgba(15,23,42,0.35)' }}>
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
              <Box>
                <Chip label="Admin Dashboard" sx={{ bgcolor: 'rgba(125,211,252,0.12)', color: '#e0f2fe', border: '1px solid rgba(125,211,252,0.18)' }} />
                <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>Store Control Center</Typography>
                <Typography color="rgba(224,242,254,0.88)">Manage catalog, inventory value, and orders from one polished panel.</Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" startIcon={<StorefrontOutlined />} href="/" sx={{ color: '#bfdbfe', borderColor: 'rgba(147,197,253,0.35)' }}>Open storefront</Button>
                <Button variant="contained" startIcon={<LogoutOutlined />} onClick={() => { localStorage.removeItem('adminSession'); navigate('/admin/login'); }} sx={{ background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)' }}>Logout</Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Main Grid Layout - CORRECT: using Grid container and Grid items */}
        <Grid container spacing={3}>
          {/* Left column */}
          <Box>
            <Stack spacing={3}>
              {/* Overview Card */}
              <Card sx={{ borderRadius: 4, bgcolor: 'rgba(15,23,42,0.94)', border: '1px solid rgba(148,163,184,0.18)', boxShadow: '0 16px 32px rgba(15,23,42,0.35)' }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(56,189,248,0.15)', color: '#7dd3fc' }}><DashboardOutlined /></Avatar>
                    <Box>
                      <Typography variant="overline" color="#7dd3fc">Overview</Typography>
                      <Typography variant="h6" fontWeight={700}>Today at a glance</Typography>
                    </Box>
                  </Stack>
                  <Stack spacing={1.5}>
                    {[
                      { label: 'Products', value: summary.totalProducts },
                      { label: 'In stock', value: summary.totalStock },
                      { label: 'Inventory value', value: `$${summary.totalValue.toFixed(2)}` },
                    ].map((item) => (
                      <Paper key={item.label} sx={{ p: 1.5, bgcolor: 'rgba(15,23,42,0.9)', border: '1px solid rgba(148,163,184,0.16)', borderRadius: 3 }}>
                        <Typography variant="body2" color="rgba(224,242,254,0.82)">{item.label}</Typography>
                        <Typography variant="h5" fontWeight={800} color="white">{item.value}</Typography>
                      </Paper>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
              {/* Quick notes Card */}
              <Card sx={{ borderRadius: 4, bgcolor: 'rgba(15,23,42,0.94)', border: '1px solid rgba(148,163,184,0.18)', boxShadow: '0 16px 32px rgba(15,23,42,0.35)' }}>
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                    <TrendingUpOutlined sx={{ color: '#7dd3fc' }} />
                    <Typography variant="h6" fontWeight={700}>Quick notes</Typography>
                  </Stack>
                  <Typography color="rgba(224,242,254,0.88)">Orders are ready for review and product updates are synced with the mock store.</Typography>
                </CardContent>
              </Card>
            </Stack>
          </Box>

          {/* Right column */}
          <Box>
            <Stack spacing={3}>
              {/* Add/Edit Product Card */}
              <Card sx={{ borderRadius: 4, bgcolor: 'rgba(15,23,42,0.94)', border: '1px solid rgba(148,163,184,0.18)', boxShadow: '0 16px 32px rgba(15,23,42,0.35)' }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Box>
                      <Typography variant="overline" color="#7dd3fc">Product manager</Typography>
                      <Typography variant="h6" fontWeight={700}>Add / Edit Product</Typography>
                    </Box>
                    <Chip label="Quick CRUD" sx={{ bgcolor: 'rgba(56,189,248,0.12)', color: '#e0f2fe', border: '1px solid rgba(125,211,252,0.18)' }} />
                  </Stack>
                  <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    <TextField label="Product name" name="name" value={form.name} onChange={handleChange} required fullWidth sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(15,23,42,0.85)', color: 'white' } }} />
                    <TextField label="Category" name="category" value={form.category} onChange={handleChange} required fullWidth sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(15,23,42,0.85)', color: 'white' } }} />
                    <TextField label="Price" name="price" type="number" value={form.price} onChange={handleChange} required fullWidth sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(15,23,42,0.85)', color: 'white' } }} />
                    <TextField label="Stock" name="stock" type="number" value={form.stock} onChange={handleChange} fullWidth sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(15,23,42,0.85)', color: 'white' } }} />
                    <TextField select label="Status" name="status" value={form.status} onChange={handleChange} fullWidth sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(15,23,42,0.85)', color: 'white' } }}>
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Featured">Featured</MenuItem>
                      <MenuItem value="Out of stock">Out of stock</MenuItem>
                    </TextField>
                    <Button type="submit" variant="contained" size="large" sx={{ alignSelf: 'flex-end', background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)' }}>{form.id ? 'Update Product' : 'Add Product'}</Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Product List Card */}
              <Card sx={{ borderRadius: 4, bgcolor: 'rgba(15,23,42,0.94)', border: '1px solid rgba(148,163,184,0.18)', boxShadow: '0 16px 32px rgba(15,23,42,0.35)' }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Box>
                      <Typography variant="overline" color="#7dd3fc">Inventory</Typography>
                      <Typography variant="h6" fontWeight={700}>Product List</Typography>
                    </Box>
                    <Chip label={`${products.length} items`} sx={{ bgcolor: 'rgba(56,189,248,0.12)', color: '#e0f2fe', border: '1px solid rgba(125,211,252,0.18)' }} />
                  </Stack>
                  <TableContainer component={Paper} sx={{ bgcolor: 'rgba(15,23,42,0.88)', border: '1px solid rgba(148,163,184,0.16)', borderRadius: 3 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: '#bfdbfe' }}>Name</TableCell>
                          <TableCell sx={{ color: '#bfdbfe' }}>Category</TableCell>
                          <TableCell sx={{ color: '#bfdbfe' }}>Price</TableCell>
                          <TableCell sx={{ color: '#bfdbfe' }}>Stock</TableCell>
                          <TableCell sx={{ color: '#bfdbfe' }}>Status</TableCell>
                          <TableCell sx={{ color: '#bfdbfe' }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id} sx={{ '& td': { borderColor: 'rgba(148,163,184,0.14)' } }}>
                            <TableCell sx={{ color: 'white' }}>{product.name}</TableCell>
                            <TableCell sx={{ color: 'white' }}>{product.category}</TableCell>
                            <TableCell sx={{ color: 'white' }}>${product.price}</TableCell>
                            <TableCell sx={{ color: 'white' }}>{product.stock}</TableCell>
                            <TableCell sx={{ color: 'white' }}>{product.status}</TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={1}>
                                <Button size="small" onClick={() => handleEdit(product)} sx={{ color: '#bfdbfe' }}>Edit</Button>
                                <Button size="small" color="error" onClick={() => handleDelete(product.id)}>Delete</Button>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>

              {/* Orders Card */}
              <Card sx={{ borderRadius: 4, bgcolor: 'rgba(15,23,42,0.94)', border: '1px solid rgba(148,163,184,0.18)', boxShadow: '0 16px 32px rgba(15,23,42,0.35)' }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Box>
                      <Typography variant="overline" color="#7dd3fc">Orders</Typography>
                      <Typography variant="h6" fontWeight={700}>Recent Orders</Typography>
                    </Box>
                    <Chip label="Live feed" sx={{ bgcolor: 'rgba(56,189,248,0.12)', color: '#e0f2fe', border: '1px solid rgba(125,211,252,0.18)' }} />
                  </Stack>
                  <Stack spacing={1.2}>
                    {orders.map((order) => (
                      <Paper key={order.id} sx={{ p: 1.4, bgcolor: 'rgba(15,23,42,0.88)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 3 }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
                          <Box>
                            <Typography variant="subtitle2" color="white">{order.id}</Typography>
                            <Typography variant="body2" color="rgba(224,242,254,0.82)">{order.customer}</Typography>
                          </Box>
                          <Typography variant="body2" color="#bfdbfe">${order.total}</Typography>
                          <Chip label={order.status} size="small" sx={{ bgcolor: 'rgba(56,189,248,0.12)', color: '#e0f2fe' }} />
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
}