import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  ArrowForward,
  LockOutlined,
  PhoneIphone,
  Visibility,
  VisibilityOff,
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
        background: 'linear-gradient(135deg, #e8eef7 0%, #dce6f5 50%, #e4ecf7 100%)',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={0}
          sx={{
            borderRadius: 5,
            boxShadow: '0 8px 32px rgba(59,130,246,0.10)',
            overflow: 'hidden',
            background: '#ffffff',
            p: { xs: 4, md: 6 },
          }}
        >
          <Stack spacing={4} alignItems="center" textAlign="center">

            {/* Lock icon avatar */}
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 16px rgba(37,99,235,0.25)',
              }}
            >
              <LockOutlined sx={{ color: 'white', fontSize: 36 }} />
            </Box>

            {/* Heading */}
            <Box>
              <Typography variant="h4" fontWeight={800} color="#1a202c" gutterBottom>
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Enter your mobile number and password to continue
              </Typography>
            </Box>

            {/* Form — native <form> element handled correctly via component prop */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ width: '100%' }}
            >
              <Stack spacing={3}>

                <TextField
                  fullWidth
                  required
                  label="Mobile Number"
                  inputProps={{ inputMode: 'tel' }}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIphone sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />

                <TextField
                  fullWidth
                  required
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            onClick={() => setShowPassword((prev) => !prev)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />

                {message && (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {message}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  endIcon={
                    loading
                      ? <CircularProgress size={18} color="inherit" />
                      : <ArrowForward />
                  }
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 8px 16px rgba(37,99,235,0.25)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 20px rgba(37,99,235,0.3)',
                      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    },
                    '&.Mui-disabled': {
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      opacity: 0.6,
                      color: 'white',
                    },
                  }}
                >
                  {loading ? 'Signing in…' : 'Sign In'}
                </Button>

                <Typography variant="body2" color="text.secondary">
                  Admin?{' '}
                  <Box
                    component="span"
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate('/admin/login')}
                    onKeyDown={(e) => e.key === 'Enter' && navigate('/admin/login')}
                    sx={{
                      color: '#2563eb',
                      cursor: 'pointer',
                      fontWeight: 600,
                      '&:hover': { textDecoration: 'underline' },
                    }}
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