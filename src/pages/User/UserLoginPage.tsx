import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert, Box, Button, Card, Container, Stack,
  TextField, Typography, InputAdornment, IconButton,
} from '@mui/material';
import {
  PhoneIphone, LockOutlined, Visibility, VisibilityOff, ArrowForward,
} from '@mui/icons-material';
import { API_URL } from '../../api/api';

export default function UserLoginPage(): React.ReactElement {
  const navigate = useNavigate();

  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        body: JSON.stringify({ mobile_number: mobileNumber, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userTokens', JSON.stringify({ access: data.access, refresh: data.refresh }));
        localStorage.setItem('userSession', JSON.stringify(data.user));
        localStorage.setItem('userData', JSON.stringify(data.user));

        // Admin → admin dashboard | everyone else → home page
        if (data.user.role === 'Admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/home', { replace: true });
        }
      } else {
        setMessage(data.detail || data.error || 'Login failed. Please check your credentials.');
      }
    } catch {
      setMessage('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 5,
            boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(10px)',
            p: { xs: 4, md: 6 },
          }}
        >
          <Stack spacing={4} alignItems="center" textAlign="center">

            <Box sx={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(99,102,241,0.3)',
            }}>
              <LockOutlined sx={{ color: 'white', fontSize: 36 }} />
            </Box>

            <Box>
              <Typography variant="h4" fontWeight={800} color="#1e1b4b" gutterBottom>
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Enter your mobile number and password to continue
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <Stack spacing={3}>

                <TextField
                  fullWidth required
                  label="Mobile Number"
                  inputMode="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIphone sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />

                <TextField
                  fullWidth required
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />

                {message && (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>{message}</Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  endIcon={<ArrowForward />}
                  sx={{
                    py: 1.5, borderRadius: 3,
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    fontSize: '1.05rem', fontWeight: 600, textTransform: 'none',
                    boxShadow: '0 8px 16px rgba(99,102,241,0.25)',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 20px rgba(99,102,241,0.3)' },
                  }}
                >
                  {loading ? 'Signing in…' : 'Sign In'}
                </Button>

                <Typography variant="body2" color="text.secondary">
                  Admin?{' '}
                  <Box
                    component="span"
                    onClick={() => navigate('/admin/login')}
                    sx={{ color: '#6366f1', cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
                  >
                    Sign in here
                  </Box>
                </Typography>

              </Stack>
            </Box>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}