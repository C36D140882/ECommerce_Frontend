import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "./Header";
import Footer from "./Footer";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Paper,
  IconButton,
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Grid,
  Chip,
} from '@mui/material';
import {
  ChevronRight,
  ArrowForwardIos,
  ArrowBackIos,
  Search,
  ShoppingCartOutlined,
  PersonOutline,
  Home,
  GridView,
  LocalMallOutlined,
  LocalShippingOutlined,
  SupportAgentOutlined,
  VerifiedUserOutlined,
  ReplayOutlined,
} from '@mui/icons-material';
import homeData from '../../data/home.json';
import { allCategories } from '../../data/categories/index';

// Mobile Top Bar
const MobileTopBar = () => (
  <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'white' }}>
    <Stack direction="row" alignItems="center" spacing={1}>
      <LocalMallOutlined sx={{ color: '#0047FF', fontSize: 28 }} />
      <Typography variant="h6" fontWeight={800} sx={{ color: '#0f172a' }}>
        RK Store
      </Typography>
    </Stack>
    <Stack direction="row" spacing={1}>
      <IconButton size="small" sx={{ color: '#0047FF' }}>
        <Search />
      </IconButton>
      <IconButton size="small" sx={{ color: '#0047FF' }}>
        <Badge badgeContent={2} color="primary">
          <ShoppingCartOutlined />
        </Badge>
      </IconButton>
      <IconButton size="small" sx={{ color: '#0047FF' }}>
        <PersonOutline />
      </IconButton>
    </Stack>
  </Box>
);

// Mobile Bottom Nav
const MobileBottomNav = () => (
  <Box sx={{ display: { xs: 'block', md: 'none' }, position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, bgcolor: 'white' }}>
    <BottomNavigation showLabels sx={{ height: 65, borderTop: '1px solid #e2e8f0' }}>
      <BottomNavigationAction label="Home" icon={<Home sx={{ color: '#0047FF' }} />} sx={{ color: '#0047FF', '& .MuiBottomNavigationAction-label': { fontWeight: 600 } }} />
      <BottomNavigationAction label="Categories" icon={<GridView />} />
      <BottomNavigationAction label="Orders" icon={<LocalMallOutlined />} />
      <BottomNavigationAction label="Cart" icon={
        <Badge badgeContent={2} color="primary" sx={{ '& .MuiBadge-badge': { right: -3, top: 3 } }}>
          <ShoppingCartOutlined />
        </Badge>
      } />
      <BottomNavigationAction label="Account" icon={<PersonOutline />} />
    </BottomNavigation>
  </Box>
);

// Trust Badges for Mobile
const TrustBadges = () => (
  <Box sx={{ display: { xs: 'block', md: 'none' }, bgcolor: 'white', p: 3, mb: 10, borderTop: '1px solid #e2e8f0' }}>
    <Grid container spacing={3}>
      <Grid size={{ xs: 6 }}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <LocalShippingOutlined sx={{ color: '#64748b' }} />
          <Box>
            <Typography variant="subtitle2" fontWeight={700}>Free Shipping</Typography>
            <Typography variant="caption" color="text.secondary">On orders above ₹499</Typography>
          </Box>
        </Stack>
      </Grid>
      <Grid size={{ xs: 6 }}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <SupportAgentOutlined sx={{ color: '#64748b' }} />
          <Box>
            <Typography variant="subtitle2" fontWeight={700}>Customer Support</Typography>
            <Typography variant="caption" color="text.secondary">24/7 support available</Typography>
          </Box>
        </Stack>
      </Grid>
      <Grid size={{ xs: 6 }}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <VerifiedUserOutlined sx={{ color: '#64748b' }} />
          <Box>
            <Typography variant="subtitle2" fontWeight={700}>Secure Payment</Typography>
            <Typography variant="caption" color="text.secondary">100% secure payments</Typography>
          </Box>
        </Stack>
      </Grid>
      <Grid size={{ xs: 6 }}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <ReplayOutlined sx={{ color: '#64748b' }} />
          <Box>
            <Typography variant="subtitle2" fontWeight={700}>Easy Returns</Typography>
            <Typography variant="caption" color="text.secondary">Hassle-free returns</Typography>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  </Box>
);

export default function HomePage(): React.ReactElement {
  const navigate = useNavigate();

  const renderSection = (title: string, products: any[], categoryId?: string) => (
    <Box sx={{ mb: { xs: 4, md: 6 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={700} color="#0f172a" sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
          {title}
        </Typography>
        <Button
          endIcon={<ChevronRight />}
          size="small"
          onClick={() => categoryId && navigate(`/categories/${categoryId}`)}
          sx={{
            color: '#0047FF',
            bgcolor: '#ffffff',
            fontWeight: 600,
            px: 2,
            border: '1px solid #0047FF',
            borderRadius: 1.5,
            display: { xs: 'none', md: 'inline-flex' },
          }}
        >
          View More
        </Button>
        <Button
          endIcon={<ChevronRight />}
          size="small"
          onClick={() => categoryId && navigate(`/categories/${categoryId}`)}
          sx={{
            color: '#0047FF',
            fontWeight: 600,
            bgcolor: '#ffffff',
            px: 1.5,
            border: '1px solid #0047FF',
            borderRadius: 1.5,
            display: { xs: 'inline-flex', md: 'none' },
          }}
        >
          View More
        </Button>
      </Stack>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {products.map((product) => (
          <Grid size={{ xs: 6, sm: 4, md: 3 }} key={product.id}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 1.5, md: 2 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                border: '1px solid #e2e8f0',
                borderRadius: 2,
                transition: 'box-shadow 0.2s',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                },
              }}
            >
              <Box
                component="img"
                src={product.imageUrl}
                alt={product.name}
                sx={{ width: { xs: 100, md: 120 }, height: { xs: 100, md: 120 }, objectFit: 'contain', mb: 2 }}
              />
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <Typography variant="subtitle2" fontWeight={700} color="#0f172a" sx={{ lineHeight: 1.2, mb: 1, fontSize: { xs: '0.85rem', md: '0.875rem' } }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="#64748b" sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' }, lineHeight: 1.4 }}>
                  {product.description}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
      <MobileTopBar />

      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Header />
      </Box>

      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 }, pt: { xs: 2, md: 0 } }}>
        {/* Hero Banner */}
        <Box
          sx={{
            bgcolor: '#0047FF',
            borderRadius: { xs: 2, md: 3 },
            p: { xs: 3, md: 8 },
            mb: { xs: 4, md: 6 },
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: { xs: 180, md: 'auto' }
          }}
        >
          {/* Background decorative elements */}
          <Box sx={{ position: 'absolute', top: -100, right: -50, width: 300, height: 300, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
          <Box sx={{ position: 'absolute', bottom: -50, right: 150, width: 200, height: 200, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />

          <Box sx={{ position: 'relative', zIndex: 1, maxWidth: { xs: '65%', md: '50%' } }}>
            <Typography variant="caption" fontWeight={800} sx={{ bgcolor: '#FFC107', color: '#000', px: 1.5, py: 0.5, borderRadius: 1, display: 'inline-block', mb: 1, fontSize: { xs: '0.65rem', md: '0.875rem' } }}>
              BEST OFFER
            </Typography>
            <Typography variant="h3" fontWeight={900} sx={{ fontStyle: 'italic', mb: 0.5, fontSize: { xs: '1.75rem', md: '3.75rem' } }}>
              MEGA SALE
            </Typography>
            <Typography variant="h6" fontWeight={800} sx={{ color: '#FFC107', mb: 1.5, fontSize: { xs: '1rem', md: '2.125rem' } }}>
              UP TO 50% OFF
            </Typography>
            <Typography variant="body2" sx={{ mb: { xs: 2, md: 4 }, opacity: 0.9, fontSize: { xs: '0.75rem', md: '1rem' } }}>
              Shop the best products<br />at unbeatable prices!
            </Typography>
            <Button variant="contained" sx={{ bgcolor: 'white', color: '#0047FF', fontWeight: 700, px: { xs: 2, md: 4 }, py: { xs: 1, md: 1.5 }, fontSize: { xs: '0.75rem', md: '0.875rem' }, '&:hover': { bgcolor: '#f1f5f9' } }}>
              SHOP NOW
            </Button>
          </Box>

          <Box sx={{ display: 'flex', position: 'relative', zIndex: 1, height: { xs: 120, md: 240 }, width: { xs: 120, md: 240 }, justifyContent: 'center', alignItems: 'center' }}>
            {/* Mock products for banner */}
            <Box
              component="img"
              src="https://placehold.co/300x300/e2e8f0/475569.png?text=Rice"
              sx={{ position: 'absolute', width: '50%', transform: 'rotate(-15deg)', left: '10%', zIndex: 1, borderRadius: 1, boxShadow: 3, display: { xs: 'none', md: 'block' } }}
            />
            <Box
              component="img"
              src="https://placehold.co/300x300/e2e8f0/475569.png?text=Atta"
              sx={{ position: 'absolute', width: { xs: '80%', md: '60%' }, zIndex: 2, borderRadius: 1, boxShadow: 4 }}
            />
            <Box
              component="img"
              src="https://placehold.co/300x300/e2e8f0/475569.png?text=Oil"
              sx={{ position: 'absolute', width: '40%', transform: 'rotate(15deg)', right: '10%', zIndex: 1, borderRadius: 1, boxShadow: 3, display: { xs: 'none', md: 'block' } }}
            />
          </Box>

          {/* Carousel Arrows */}
          <IconButton sx={{ display: { xs: 'none', md: 'flex' }, position: 'absolute', left: 16, color: 'white', bgcolor: 'rgba(0,0,0,0.2)', '&:hover': { bgcolor: 'rgba(0,0,0,0.4)' } }}>
            <ArrowBackIos sx={{ pl: 0.5 }} />
          </IconButton>
          <IconButton sx={{ display: { xs: 'none', md: 'flex' }, position: 'absolute', right: 16, color: 'white', bgcolor: 'rgba(0,0,0,0.2)', '&:hover': { bgcolor: 'rgba(0,0,0,0.4)' } }}>
            <ArrowForwardIos />
          </IconButton>
        </Box>

        {/* Category Quick Filters */}
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Typography variant="subtitle1" fontWeight={700} color="#0f172a" sx={{ mb: 1.5, fontSize: { xs: '0.95rem', md: '1rem' } }}>
            Browse by Category
          </Typography>
          <Stack direction="row" spacing={1.5} sx={{ overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
            {allCategories.map((cat) => (
              <Chip
                key={cat.categoryId}
                label={`${cat.categoryIcon} ${cat.categoryName}`}
                onClick={() => navigate(`/categories/${cat.categoryId}`)}
                sx={{
                  bgcolor: `${cat.categoryColor}15`,
                  color: cat.categoryColor,
                  fontWeight: 700,
                  fontSize: { xs: '0.72rem', md: '0.78rem' },
                  border: `1.5px solid ${cat.categoryColor}40`,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  '&:hover': { bgcolor: cat.categoryColor, color: 'white' },
                  transition: 'all 0.2s',
                }}
              />
            ))}
            <Chip
              label="🔍 All Categories"
              onClick={() => navigate('/categories')}
              sx={{
                bgcolor: '#0047FF15',
                color: '#0047FF',
                fontWeight: 700,
                fontSize: { xs: '0.72rem', md: '0.78rem' },
                border: '1.5px solid #0047FF40',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                '&:hover': { bgcolor: '#0047FF', color: 'white' },
                transition: 'all 0.2s',
              }}
            />
          </Stack>
        </Box>

        {/* Product Sections */}
        {renderSection("Best Selling Products", homeData.bestSelling, 'grocery-essentials')}
        {renderSection("Grocery Essentials", homeData.groceries, 'grocery-essentials')}
        {renderSection("Personal Care & Home Care", homeData.personalCare, 'personal-care-home-care')}

      </Container>

      <TrustBadges />
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Footer />
      </Box>
      <MobileBottomNav />
    </Box>
  );
}