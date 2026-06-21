import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { LockOutlined, ShoppingBagOutlined } from '@mui/icons-material';
import { API_URL } from '../../api/api';

export default function AdminLoginPage(): React.ReactElement {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, password }), // Admin often uses email
      });
      const data = await response.json();

      if (response.ok && data.user.role === 'Admin') {
        localStorage.setItem('adminSession', 'active');
        localStorage.setItem('userTokens', JSON.stringify({ access: data.access, refresh: data.refresh }));
        localStorage.setItem('userData', JSON.stringify(data.user));
        localStorage.setItem('userSession', JSON.stringify(data.user));
        navigate('/admin/dashboard');
      } else if (response.ok && data.user.role !== 'Admin') {
        setMessage('Access denied. Admin role required.');
      } else {
        setMessage(data.detail || data.error || 'Invalid credentials.');
      }
    } catch (error) {
      setMessage('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #07111f 0%, #111827 45%, #172554 100%)', p: 3 }}>
      <Card sx={{ width: '100%', maxWidth: 1100, borderRadius: 4, overflow: 'hidden', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.35)' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' } }}>
          <Box sx={{ p: { xs: 3, md: 5 }, background: 'linear-gradient(145deg, #0f172a 0%, #111827 55%, #172554 100%)', color: 'white' }}>
            <Stack spacing={2}>
              <Chip label="Admin Access" sx={{ width: 'fit-content', bgcolor: 'rgba(125, 211, 252, 0.12)', color: '#e0f2fe', border: '1px solid rgba(125, 211, 252, 0.18)' }} />
              <Typography variant="h3" fontWeight={800}>Welcome back, Admin</Typography>
              <Typography color="rgba(224, 242, 254, 0.9)">Sign in to manage products, inventory, and orders from your central control center.</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {['Secure UI', 'Admin Tools', 'System Control'].map((item) => (
                  <Chip key={item} label={item} sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#eff6ff', border: '1px solid rgba(148,163,184,0.18)' }} />
                ))}
              </Stack>
            </Stack>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, display: 'grid', gap: 2 }}>
              <TextField 
                label="Email ID" 
                value={identifier} 
                onChange={(e) => setIdentifier(e.target.value)} 
                required 
                fullWidth 
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(15, 23, 42, 0.85)', color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' } }} 
              />
              <TextField 
                label="Password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                fullWidth 
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(15, 23, 42, 0.85)', color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' } }} 
              />
              <Button type="submit" disabled={loading} variant="contained" size="large" sx={{ borderRadius: 2, py: 1.2, background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)' }}>
                {loading ? 'Authenticating...' : 'Sign in to dashboard'}
              </Button>
            </Box>

            {message ? <Alert severity="error" sx={{ mt: 2 }}>{message}</Alert> : null}
            <Typography variant="body2" color="rgba(224, 242, 254, 0.85)" sx={{ mt: 2 }}>Secure admin portal access only.</Typography>
            <Button href="/" variant="text" sx={{ mt: 1, color: '#bfdbfe', justifyContent: 'flex-start', px: 0 }}>Back to storefront</Button>
          </Box>

          <CardContent sx={{ p: { xs: 3, md: 5 }, bgcolor: '#0b1220', color: 'white' }}>
            <Stack spacing={2.5}>
              <Avatar sx={{ width: 56, height: 56, bgcolor: 'rgba(56, 189, 248, 0.16)', color: '#7dd3fc' }}>
                <LockOutlined />
              </Avatar>
              <Box>
                <Typography variant="overline" color="#7dd3fc">Dashboard Highlights</Typography>
                <Typography variant="h4" fontWeight={700}>System at a glance</Typography>
              </Box>
              <Stack spacing={1.2} sx={{ color: '#e5eefb' }}>
                {[
                  'Track total system users and roles',
                  'Manage product inventory seamlessly',
                  'Oversee store orders and statuses'
                ].map((item) => (
                  <Stack key={item} direction="row" spacing={1.25} alignItems="flex-start">
                    <ShoppingBagOutlined sx={{ color: '#7dd3fc', mt: 0.2 }} />
                    <Typography variant="body1">{item}</Typography>
                  </Stack>
                ))}
              </Stack>
              <Box sx={{ display: 'grid', gap: 1.2 }}>
                <Box sx={{ borderRadius: 3, p: 2, bgcolor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(148,163,184,0.18)' }}>Admin Security Node</Box>
                <Box sx={{ borderRadius: 3, p: 2, bgcolor: 'linear-gradient(135deg, rgba(37, 99, 235, 0.18), rgba(56, 189, 248, 0.16))', border: '1px solid rgba(125, 211, 252, 0.18)' }}>System Online</Box>
              </Box>
            </Stack>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
}
