import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  GlobalStyles,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  CreditCardRounded,
  LocalOfferRounded,
  LocalShippingRounded,
  LockOutlined,
  PhoneIphoneRounded,
  SearchRounded,
  ShieldRounded,
  ShoppingBagRounded,
  ShoppingCartRounded,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { API_URL } from '../../api/api';

type MessageType = 'error' | 'info';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    minHeight: 58,
    borderRadius: '14px',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s ease',
    '& fieldset': {
      borderColor: '#d9deea',
    },
    '&:hover fieldset': {
      borderColor: '#8eb2ff',
    },
    '&.Mui-focused': {
      boxShadow: '0 0 0 4px rgba(13, 110, 253, 0.08)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#0d6efd',
      borderWidth: '1.5px',
    },
  },
  '& .MuiInputBase-input': {
    fontSize: '0.96rem',
    color: '#101828',
    '&::placeholder': {
      color: '#98a2b3',
      opacity: 1,
    },
  },
};

function StoreLogo(): React.ReactElement {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Box
        sx={{
          width: 46,
          height: 46,
          display: 'grid',
          placeItems: 'center',
          borderRadius: '14px',
          color: '#ffffff',
          background: 'linear-gradient(135deg, #2680ff 0%, #0755df 100%)',
          boxShadow: '0 10px 24px rgba(13, 110, 253, 0.25)',
        }}
      >
        <ShoppingBagRounded sx={{ fontSize: 30 }} />
      </Box>

      <Typography
        sx={{
          fontSize: { xs: '1.7rem', md: '2rem' },
          lineHeight: 1,
          fontWeight: 900,
          color: '#0d6efd',
          letterSpacing: '-0.04em',
        }}
      >
        RK{' '}
        <Box component="span" sx={{ color: '#0b1020' }}>
          Store
        </Box>
      </Typography>
    </Stack>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  iconColor?: string;
}

function FeatureCard({
  icon,
  title,
  subtitle,
  iconColor = '#0d6efd',
}: FeatureCardProps): React.ReactElement {
  return (
    <Box
      sx={{
        width: 176,
        p: 1.5,
        borderRadius: '17px',
        backgroundColor: '#ffffff',
        border: '1px solid rgba(255,255,255,0.6)',
        boxShadow: '0 18px 44px rgba(0, 28, 105, 0.2)',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.1}>
        <Box
          sx={{
            flexShrink: 0,
            width: 40,
            height: 40,
            display: 'grid',
            placeItems: 'center',
            borderRadius: '12px',
            color: iconColor,
            backgroundColor: `${iconColor}14`,
          }}
        >
          {icon}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              color: '#101828',
              fontSize: '0.78rem',
              lineHeight: 1.25,
              fontWeight: 800,
            }}
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography
              sx={{
                mt: 0.25,
                color: '#667085',
                fontSize: '0.63rem',
                lineHeight: 1.35,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
}

function PhonePreview(): React.ReactElement {
  const categories = [
    ['🥦', 'Groceries'],
    ['🧃', 'Beverages'],
    ['🍿', 'Snacks'],
    ['🧴', 'Care'],
  ];

  const products = [
    ['🍚', 'Basmati Rice', '₹499'],
    ['🫗', 'Sunflower Oil', '₹249'],
    ['🌾', 'Wheat Flour', '₹199'],
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 4,
        width: { xs: 205, sm: 230, md: 270, lg: 300 },
        height: { xs: 410, sm: 465, md: 535, lg: 590 },
        p: { xs: '7px', md: '9px' },
        borderRadius: { xs: '31px', md: '41px' },
        background: 'linear-gradient(145deg, #111827 0%, #60697b 48%, #111827 100%)',
        boxShadow:
          '0 35px 70px rgba(0, 18, 79, 0.45), inset 0 0 0 2px rgba(255,255,255,0.22)',
        transform: { xs: 'rotate(-1deg)', md: 'rotate(2deg)' },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          borderRadius: { xs: '25px', md: '33px' },
          backgroundColor: '#f7f9fd',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 7,
            left: '50%',
            zIndex: 6,
            width: '30%',
            height: { xs: 12, md: 16 },
            borderRadius: '0 0 11px 11px',
            backgroundColor: '#111827',
            transform: 'translateX(-50%)',
          }}
        />

        <Box sx={{ height: '100%', p: { xs: 1.1, md: 1.5 }, pt: { xs: 2.6, md: 3.4 } }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <ShoppingBagRounded sx={{ color: '#0d6efd', fontSize: { xs: 18, md: 22 } }} />
              <Typography sx={{ color: '#0d6efd', fontSize: { xs: '0.7rem', md: '0.85rem' }, fontWeight: 900 }}>
                RK <Box component="span" sx={{ color: '#111827' }}>Store</Box>
              </Typography>
            </Stack>

            <Box sx={{ position: 'relative' }}>
              <ShoppingCartRounded sx={{ color: '#111827', fontSize: { xs: 20, md: 24 } }} />
              <Box
                sx={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  width: 14,
                  height: 14,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: '50%',
                  color: '#ffffff',
                  backgroundColor: '#ef233c',
                  fontSize: '0.42rem',
                  fontWeight: 900,
                }}
              >
                3
              </Box>
            </Box>
          </Stack>

          <Box
            sx={{
              mt: 1,
              px: 1,
              height: { xs: 28, md: 34 },
              display: 'flex',
              alignItems: 'center',
              gap: 0.6,
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              boxShadow: '0 5px 14px rgba(16, 24, 40, 0.08)',
            }}
          >
            <SearchRounded sx={{ color: '#7b8497', fontSize: { xs: 13, md: 16 } }} />
            <Typography sx={{ color: '#98a2b3', fontSize: { xs: '0.43rem', md: '0.52rem' } }}>
              Search products...
            </Typography>
          </Box>

          <Box
            sx={{
              position: 'relative',
              mt: 1,
              minHeight: { xs: 92, md: 120 },
              p: { xs: 1.1, md: 1.5 },
              overflow: 'hidden',
              borderRadius: { xs: '11px', md: '14px' },
              color: '#ffffff',
              background: 'linear-gradient(135deg, #0878ff 0%, #1251df 55%, #062d9d 100%)',
              boxShadow: '0 12px 24px rgba(8, 77, 213, 0.3)',
            }}
          >
            <Typography sx={{ fontSize: { xs: '0.42rem', md: '0.53rem' }, opacity: 0.95 }}>
              Exclusive Deals
            </Typography>

            <Typography
              sx={{
                mt: 0.35,
                maxWidth: '64%',
                fontSize: { xs: '0.92rem', md: '1.18rem' },
                lineHeight: 1.05,
                fontWeight: 950,
              }}
            >
              UP TO
              <br />
              50% OFF
            </Typography>

            <Box
              sx={{
                mt: 0.75,
                width: 'fit-content',
                px: 0.9,
                py: 0.4,
                borderRadius: '5px',
                backgroundColor: '#ff6b00',
                fontSize: { xs: '0.36rem', md: '0.45rem' },
                fontWeight: 800,
              }}
            >
              Shop Now
            </Box>

            <Box
              sx={{
                position: 'absolute',
                right: -7,
                bottom: -13,
                fontSize: { xs: '3.8rem', md: '5rem' },
                transform: 'rotate(-7deg)',
                filter: 'drop-shadow(0 9px 8px rgba(0,0,0,0.22))',
              }}
            >
              🛒
            </Box>
          </Box>

          <Stack direction="row" justifyContent="space-between" sx={{ mt: 1.2 }}>
            {categories.map(([emoji, label]) => (
              <Box key={label} sx={{ width: '23%', textAlign: 'center' }}>
                <Box
                  sx={{
                    width: { xs: 31, md: 40 },
                    height: { xs: 31, md: 40 },
                    mx: 'auto',
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 5px 13px rgba(16, 24, 40, 0.08)',
                    fontSize: { xs: '0.95rem', md: '1.25rem' },
                  }}
                >
                  {emoji}
                </Box>

                <Typography
                  noWrap
                  sx={{
                    mt: 0.4,
                    color: '#475467',
                    fontSize: { xs: '0.35rem', md: '0.44rem' },
                    fontWeight: 700,
                  }}
                >
                  {label}
                </Typography>
              </Box>
            ))}
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.15 }}>
            <Typography sx={{ color: '#111827', fontSize: { xs: '0.52rem', md: '0.66rem' }, fontWeight: 900 }}>
              Best Selling Products
            </Typography>
            <Typography sx={{ color: '#0d6efd', fontSize: { xs: '0.4rem', md: '0.48rem' }, fontWeight: 800 }}>
              View All
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.65 }}>
            {products.map(([emoji, title, price]) => (
              <Box
                key={title}
                sx={{
                  width: '31.5%',
                  minWidth: 0,
                  p: 0.65,
                  borderRadius: '9px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #edf0f6',
                }}
              >
                <Box
                  sx={{
                    height: { xs: 42, md: 55 },
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: '7px',
                    backgroundColor: '#f4f7fc',
                    fontSize: { xs: '1.35rem', md: '1.7rem' },
                  }}
                >
                  {emoji}
                </Box>

                <Typography noWrap sx={{ mt: 0.5, color: '#1d2939', fontSize: { xs: '0.38rem', md: '0.45rem' }, fontWeight: 800 }}>
                  {title}
                </Typography>
                <Typography sx={{ mt: 0.1, color: '#111827', fontSize: { xs: '0.39rem', md: '0.46rem' }, fontWeight: 900 }}>
                  {price}
                </Typography>
              </Box>
            ))}
          </Stack>

          <Stack direction="row" justifyContent="center" spacing={0.45} sx={{ mt: 1 }}>
            {[0, 1, 2, 3].map((item) => (
              <Box
                key={item}
                sx={{
                  width: item === 0 ? 11 : 5,
                  height: 5,
                  borderRadius: '8px',
                  backgroundColor: item === 0 ? '#0d6efd' : '#d2d7e2',
                }}
              />
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

function HeroSection(): React.ReactElement {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: 560, sm: 640, md: '100dvh' },
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, sm: 4, md: 3, lg: 5 },
        pt: 0,
        pb: 0,
        background:
          'radial-gradient(circle at 75% 18%, rgba(72, 151, 255, 0.75), transparent 30%), linear-gradient(145deg, #2478f3 0%, #0755df 48%, #003bb5 100%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: { xs: 320, md: 620 },
          height: { xs: 320, md: 620 },
          top: { xs: -170, md: -300 },
          right: { xs: -150, md: -250 },
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.12)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: { xs: 250, md: 480 },
          height: { xs: 250, md: 480 },
          right: { xs: -150, md: -190 },
          bottom: { xs: -120, md: -210 },
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.12)',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 820,
          minHeight: { xs: 490, sm: 570, md: 690 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            zIndex: 5,
            top: { xs: 35, sm: 65, md: '18%' },
            left: { xs: -8, sm: '6%', md: '2%' },
            transform: { xs: 'scale(0.73)', sm: 'scale(0.88)', md: 'scale(1)' },
            transformOrigin: 'left center',
          }}
        >
          <FeatureCard
            icon={<LocalOfferRounded />}
            title="25% OFF"
            subtitle="Mega Discount"
            iconColor="#ff6b00"
          />
        </Box>

        <Box
          sx={{
            position: 'absolute',
            zIndex: 5,
            top: { xs: 115, sm: 148, md: '35%' },
            left: { xs: -8, sm: '6%', md: '2%' },
            transform: { xs: 'scale(0.69)', sm: 'scale(0.84)', md: 'scale(1)' },
            transformOrigin: 'left center',
          }}
        >
          <FeatureCard
            icon={<LocalShippingRounded />}
            title="Free Delivery"
            subtitle="Orders above ₹499"
          />
        </Box>

        <Box
          sx={{
            position: 'absolute',
            zIndex: 5,
            top: { xs: 58, sm: 95, md: '27%' },
            right: { xs: -8, sm: '4%', md: '-1%' },
            transform: { xs: 'scale(0.68)', sm: 'scale(0.82)', md: 'scale(1)' },
            transformOrigin: 'right center',
          }}
        >
          <FeatureCard
            icon={<ShieldRounded />}
            title="Secure Payments"
            iconColor="#14a66a"
          />
        </Box>

        <Box
          sx={{
            position: 'absolute',
            zIndex: 5,
            top: { xs: 137, sm: 180, md: '43%' },
            right: { xs: -8, sm: '4%', md: '-1%' },
            transform: { xs: 'scale(0.66)', sm: 'scale(0.8)', md: 'scale(1)' },
            transformOrigin: 'right center',
          }}
        >
          <FeatureCard
            icon={<CreditCardRounded />}
            title="Multiple Payment"
            subtitle="UPI, cards and wallets"
          />
        </Box>

        <PhonePreview />

        <Box
          sx={{
            position: 'absolute',
            left: { md: '4%', lg: '5%' },
            bottom: { md: 56, lg: 65 },
            zIndex: 3,
            display: { xs: 'none', md: 'block' },
            fontSize: { md: '7.2rem', lg: '8.8rem' },
            transform: 'rotate(-8deg)',
            filter: 'drop-shadow(0 25px 20px rgba(0, 24, 90, 0.3))',
          }}
        >
          🛒
        </Box>

        <Box
          sx={{
            position: 'absolute',
            right: { md: '1%', lg: '3%' },
            bottom: { md: 43, lg: 54 },
            zIndex: 3,
            display: { xs: 'none', md: 'block' },
            fontSize: { md: '6.4rem', lg: '7.8rem' },
            filter: 'drop-shadow(0 22px 18px rgba(0, 24, 90, 0.3))',
          }}
        >
          🧺
        </Box>

        <Box
          sx={{
            position: 'absolute',
            zIndex: 6,
            right: { md: '6%', lg: '7%' },
            bottom: { md: 5, lg: 12 },
            display: { xs: 'none', md: 'block' },
          }}
        >
          <FeatureCard
            icon={<ShieldRounded />}
            title="Safe & Fast Checkout"
            subtitle="Secure UPI, cards and wallets"
          />
        </Box>
      </Box>
    </Box>
  );
}

export default function UserLoginPage(): React.ReactElement {
  const navigate = useNavigate();

  const [mobileNumber, setMobileNumber] = useState<string>(
    () => localStorage.getItem('rememberedUserMobile') ?? '',
  );
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<MessageType>('error');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const cleanedMobileNumber = mobileNumber.trim();

    if (!cleanedMobileNumber) {
      setMessageType('error');
      setMessage('Please enter your mobile number.');
      return;
    }

    if (!password) {
      setMessageType('error');
      setMessage('Please enter your password.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile_number: cleanedMobileNumber,
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessageType('error');
        setMessage(
          data.detail ||
          data.error ||
          data.message ||
          'Login failed. Please check your credentials.',
        );
        return;
      }

      if (!data.access || !data.user) {
        setMessageType('error');
        setMessage('Invalid response received from the server.');
        return;
      }

      localStorage.setItem(
        'userTokens',
        JSON.stringify({
          access: data.access,
          refresh: data.refresh,
        }),
      );
      localStorage.setItem('userSession', JSON.stringify(data.user));
      localStorage.setItem('userData', JSON.stringify(data.user));

      const role = String(data.user.role ?? '').toLowerCase();

      if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/home', { replace: true });
      }
    } catch (error) {
      console.error('User login error:', error);
      setMessageType('error');
      setMessage('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GlobalStyles
        styles={{
          'html, body, #root': {
            width: '100%',
            minHeight: '100%',
            margin: 0,
            padding: 0,
          },
          body: {
            overflowX: 'hidden',
          },
        }}
      />

      <Box
        sx={{
          width: '100%',
          minHeight: '100dvh',
          overflowX: 'hidden',
          color: '#101828',
          backgroundColor: '#ffffff',
        }}
      >
        <Box
          component="header"
          sx={{
            position: { xs: 'relative', md: 'absolute' },
            top: 0,
            left: 0,
            right: 0,
            zIndex: 20,
            height: { xs: 92, md: 106 },
            display: 'flex',
            alignItems: 'center',
            backgroundColor: { xs: '#ffffff', md: 'transparent' },
          }}
        >
          <Container
            maxWidth={false}
            sx={{
              width: '100%',
              maxWidth: 1600,
              px: { xs: 2.5, sm: 4, md: 5, lg: 7 },
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent={{ xs: 'center', md: 'space-between' }}
            >
              <StoreLogo />
            </Stack>
          </Container>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '49% 51%', lg: '48% 52%' },
            minHeight: { xs: 'auto', md: '100dvh' },
          }}
        >
          <Box
            component="main"
            sx={{
              position: 'relative',
              minHeight: { xs: 'auto', md: '100dvh' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: { xs: 2, sm: 4, md: 4, lg: 6 },
              pt: { xs: 1.5, md: 0 },
              pb: { xs: 4, md: 0 },
              background:
                'radial-gradient(circle at 3% 65%, rgba(255, 148, 66, 0.22) 0 5px, transparent 6px), linear-gradient(145deg, #ffffff 0%, #ffffff 74%, #f3f7ff 100%)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: { xs: 10, md: 130 },
                left: { xs: -25, md: -10 },
                width: 140,
                height: 140,
                opacity: 0.3,
                backgroundImage: 'radial-gradient(circle, #9dbdf9 2px, transparent 2.5px)',
                backgroundSize: '17px 17px',
              },
            }}
          >
            <Card
              elevation={0}
              sx={{
                position: 'relative',
                zIndex: 2,
                width: '100%',
                maxWidth: { xs: 560, md: 600, lg: 630 },
                p: { xs: 2.5, sm: 4, md: 4.2, lg: 5 },
                borderRadius: { xs: '26px', sm: '30px', md: '34px' },
                border: '1px solid rgba(36, 82, 162, 0.08)',
                backgroundColor: 'rgba(255,255,255,0.97)',
                boxShadow: {
                  xs: '0 18px 55px rgba(28, 66, 130, 0.12)',
                  md: '0 28px 75px rgba(21, 51, 112, 0.16)',
                },
                backdropFilter: 'blur(16px)',
              }}
            >
              <Box sx={{ mb: 3.2, textAlign: 'center' }}>
                <Typography
                  component="h1"
                  sx={{
                    color: '#0a1025',
                    fontSize: { xs: '2rem', sm: '2.45rem', md: '2.65rem' },
                    lineHeight: 1.12,
                    fontWeight: 900,
                    letterSpacing: '-0.045em',
                  }}
                >
                  Welcome Back
                </Typography>

                <Typography
                  sx={{
                    mt: 1.1,
                    color: '#667085',
                    fontSize: { xs: '0.9rem', sm: '0.98rem' },
                    lineHeight: 1.55,
                  }}
                >
                  Login to continue shopping and manage your orders.
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={2.3}>
                  <Box>
                    <Typography
                      component="label"
                      htmlFor="mobile-number"
                      sx={{ display: 'block', mb: 0.9, color: '#101828', fontSize: '0.95rem', fontWeight: 800 }}
                    >
                      Mobile Number
                    </Typography>

                    <TextField
                      id="mobile-number"
                      fullWidth
                      required
                      value={mobileNumber}
                      onChange={(event) => {
                        setMobileNumber(event.target.value);
                        if (message) setMessage('');
                      }}
                      placeholder="Enter your mobile number"
                      autoComplete="tel"
                      sx={fieldSx}
                      slotProps={{
                        htmlInput: {
                          inputMode: 'tel',
                          maxLength: 15,
                        },
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIphoneRounded sx={{ color: '#4d5870', fontSize: 23 }} />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      component="label"
                      htmlFor="password"
                      sx={{ display: 'block', mb: 0.9, color: '#101828', fontSize: '0.95rem', fontWeight: 800 }}
                    >
                      Password
                    </Typography>

                    <TextField
                      id="password"
                      fullWidth
                      required
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        if (message) setMessage('');
                      }}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      sx={fieldSx}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlined sx={{ color: '#4d5870', fontSize: 23 }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                type="button"
                                edge="end"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                onClick={() => setShowPassword((previous) => !previous)}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Box>

                  {message && (
                    <Alert severity={messageType} sx={{ borderRadius: '13px' }}>
                      {message}
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{
                      minHeight: 60,
                      borderRadius: '14px',
                      color: '#ffffff',
                      background: 'linear-gradient(110deg, #1670ff 0%, #0757eb 50%, #0643c7 100%)',
                      boxShadow: '0 14px 30px rgba(17, 92, 237, 0.3)',
                      fontSize: { xs: '1rem', sm: '1.08rem' },
                      fontWeight: 850,
                      textTransform: 'none',
                      transition: 'all 0.22s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        background: 'linear-gradient(110deg, #0d63f4 0%, #074fde 50%, #043bb8 100%)',
                        boxShadow: '0 18px 35px rgba(17, 92, 237, 0.36)',
                      },
                      '&.Mui-disabled': {
                        color: '#ffffff',
                        background: 'linear-gradient(110deg, #1670ff 0%, #0757eb 50%, #0643c7 100%)',
                        opacity: 0.65,
                      },
                    }}
                  >
                    {loading ? (
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <CircularProgress size={20} color="inherit" />
                        <Box component="span">Signing in...</Box>
                      </Stack>
                    ) : (
                      'Login'
                    )}
                  </Button>

                  <Box
                    sx={{
                      p: { xs: 1.6, sm: 1.9 },
                      borderRadius: '15px',
                      background: 'linear-gradient(110deg, #f0f6ff 0%, #f8faff 100%)',
                      border: '1px solid #e8effb',
                    }}
                  >
                    <Stack direction="row" spacing={1.4} alignItems="center">
                      <Box
                        sx={{
                          flexShrink: 0,
                          width: { xs: 48, sm: 54 },
                          height: { xs: 48, sm: 54 },
                          display: 'grid',
                          placeItems: 'center',
                          borderRadius: '15px',
                          color: '#ffffff',
                          background: 'linear-gradient(145deg, #2b8bff 0%, #0757e7 100%)',
                          boxShadow: '0 10px 20px rgba(13, 94, 233, 0.26)',
                        }}
                      >
                        <ShieldRounded sx={{ fontSize: { xs: 29, sm: 33 } }} />
                      </Box>

                      <Box>
                        <Typography sx={{ color: '#101828', fontSize: { xs: '0.88rem', sm: '1rem' }, fontWeight: 850 }}>
                          100% Secure Login
                        </Typography>
                        <Typography sx={{ mt: 0.25, color: '#667085', fontSize: { xs: '0.72rem', sm: '0.8rem' }, lineHeight: 1.45 }}>
                          Your account and transactions are protected with industry-standard encryption.
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </Card>

            <Typography
              sx={{
                position: { xs: 'relative', md: 'absolute' },
                bottom: { md: 20 },
                mt: { xs: 3, md: 0 },
                color: '#667085',
                fontSize: { xs: '0.75rem', sm: '0.82rem' },
                textAlign: 'center',
              }}
            >
              © {new Date().getFullYear()} RK Store. All Rights Reserved.
            </Typography>
          </Box>

          <HeroSection />
        </Box>
      </Box>
    </>
  );
}
