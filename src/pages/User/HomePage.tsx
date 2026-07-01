import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
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
  Skeleton,
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
import {
  fetchAdvertisements,
  fetchCategories,
  fetchHomeSections,
  type Advertisement,
  type Category,
  type HomeSection,
  type HomeSectionProduct,
} from '../../api/homeApi';

// ─── Mobile Top Bar ───────────────────────────────────────────────────────────
const MobileTopBar = () => (
  <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'white' }}>
    <Stack direction="row" alignItems="center" spacing={1}>
      <LocalMallOutlined sx={{ color: '#003be0', fontSize: 28 }} />
      <Typography variant="h6" fontWeight={800} sx={{ color: '#0f172a' }}>
        RK Store
      </Typography>
    </Stack>
    <Stack direction="row" spacing={1}>
      <IconButton size="small" sx={{ color: '#003be0' }}><Search /></IconButton>
      <IconButton size="small" sx={{ color: '#003be0' }}>
        <Badge badgeContent={2} color="primary"><ShoppingCartOutlined /></Badge>
      </IconButton>
      <IconButton size="small" sx={{ color: '#003be0' }}><PersonOutline /></IconButton>
    </Stack>
  </Box>
);

// ─── Mobile Bottom Nav ────────────────────────────────────────────────────────
const MobileBottomNav = () => (
  <Box sx={{ display: { xs: 'block', md: 'none' }, position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, bgcolor: 'white' }}>
    <BottomNavigation showLabels sx={{ height: 65, borderTop: '1px solid #e2e8f0' }}>
      <BottomNavigationAction label="Home" icon={<Home sx={{ color: '#003be0' }} />} sx={{ color: '#003be0', '& .MuiBottomNavigationAction-label': { fontWeight: 600 } }} />
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

// ─── Trust Badges ─────────────────────────────────────────────────────────────
const TrustBadges = () => (
  <Box sx={{ display: { xs: 'block', md: 'none' }, bgcolor: 'white', p: 3, mb: 10, borderTop: '1px solid #e2e8f0' }}>
    <Grid container spacing={3}>
      {[
        { icon: <LocalShippingOutlined sx={{ color: '#64748b' }} />, title: 'Free Shipping', sub: 'On orders above ₹499' },
        { icon: <SupportAgentOutlined sx={{ color: '#64748b' }} />, title: 'Customer Support', sub: '24/7 support available' },
        { icon: <VerifiedUserOutlined sx={{ color: '#64748b' }} />, title: 'Secure Payment', sub: '100% secure payments' },
        { icon: <ReplayOutlined sx={{ color: '#64748b' }} />, title: 'Easy Returns', sub: 'Hassle-free returns' },
      ].map(({ icon, title, sub }) => (
        <Grid size={{ xs: 6 }} key={title}>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            {icon}
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>{title}</Typography>
              <Typography variant="caption" color="text.secondary">{sub}</Typography>
            </Box>
          </Stack>
        </Grid>
      ))}
    </Grid>
  </Box>
);

// ─── Skeleton Loaders ─────────────────────────────────────────────────────────
const BannerSkeleton = () => (
  <Skeleton variant="rounded" sx={{ borderRadius: { xs: 2, md: 3 }, mb: { xs: 4, md: 6 }, height: { xs: 180, md: 340 } }} />
);

const ChipsSkeleton = () => (
  <Stack direction="row" spacing={1.5} sx={{ mb: { xs: 3, md: 4 }, overflowX: 'hidden' }}>
    {[...Array(5)].map((_, i) => (
      <Skeleton key={i} variant="rounded" width={110} height={32} sx={{ borderRadius: 4, flexShrink: 0 }} />
    ))}
  </Stack>
);

const SectionSkeleton = () => (
  <Box sx={{ mb: { xs: 4, md: 6 } }}>
    <Skeleton variant="text" width={220} height={32} sx={{ mb: 2 }} />
    <Grid container spacing={{ xs: 2, md: 3 }}>
      {[...Array(4)].map((_, i) => (
        <Grid size={{ xs: 6, sm: 4, md: 3 }} key={i}>
          <Skeleton variant="rounded" height={220} sx={{ borderRadius: 2 }} />
        </Grid>
      ))}
    </Grid>
  </Box>
);

// ─── Hero Banner ──────────────────────────────────────────────────────────────
interface HeroBannerProps {
  ad: Advertisement;
  onPrev: () => void;
  onNext: () => void;
  showArrows: boolean;
}

const HeroBanner = ({ ad, onPrev, onNext, showArrows }: HeroBannerProps) => (
  <Box
    sx={{
      bgcolor: ad.bg_color,
      borderRadius: { xs: 2, md: 3 },
      p: { xs: 3, md: 8 },
      mb: { xs: 4, md: 6 },
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: { xs: 180, md: 'auto' },
      transition: 'background-color 0.5s ease',
    }}
  >
    {/* Decorative circles */}
    <Box sx={{ position: 'absolute', top: -100, right: -50, width: 300, height: 300, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
    <Box sx={{ position: 'absolute', bottom: -50, right: 150, width: 200, height: 200, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />

    {/* Text content */}
    <Box sx={{ position: 'relative', zIndex: 1, maxWidth: { xs: '65%', md: '50%' } }}>
      {ad.badge_text && (
        <Typography variant="caption" fontWeight={800} sx={{ bgcolor: '#FFC107', color: '#000', px: 1.5, py: 0.5, borderRadius: 1, display: 'inline-block', mb: 1, fontSize: { xs: '0.65rem', md: '0.875rem' } }}>
          {ad.badge_text}
        </Typography>
      )}
      <Typography variant="h3" fontWeight={900} sx={{ fontStyle: 'italic', mb: 0.5, fontSize: { xs: '1.75rem', md: '3.75rem' } }}>
        {ad.title}
      </Typography>
      {ad.discount_text && (
        <Typography variant="h6" fontWeight={800} sx={{ color: '#FFC107', mb: 1.5, fontSize: { xs: '1rem', md: '2.125rem' } }}>
          {ad.discount_text}
        </Typography>
      )}
      {ad.description && (
        <Typography variant="body2" sx={{ mb: { xs: 2, md: 4 }, opacity: 0.9, fontSize: { xs: '0.75rem', md: '1rem' } }}>
          {ad.description}
        </Typography>
      )}
      <Button
        variant="contained"
        href={ad.button_link || '/'}
        sx={{ bgcolor: 'white', color: ad.bg_color, fontWeight: 700, px: { xs: 2, md: 4 }, py: { xs: 1, md: 1.5 }, fontSize: { xs: '0.75rem', md: '0.875rem' }, '&:hover': { bgcolor: '#f1f5f9' } }}
      >
        {ad.button_text || 'SHOP NOW'}
      </Button>
    </Box>

    {/* Hero image */}
    {ad.image_url && (
      <Box sx={{ display: 'flex', position: 'relative', zIndex: 1, height: { xs: 120, md: 240 }, width: { xs: 120, md: 240 }, justifyContent: 'center', alignItems: 'center' }}>
        <Box
          component="img"
          src={ad.image_url}
          alt={ad.title}
          sx={{ width: { xs: '80%', md: '90%' }, objectFit: 'contain', borderRadius: 2, boxShadow: 4 }}
        />
      </Box>
    )}

    {/* Carousel arrows */}
    {showArrows && (
      <>
        <IconButton onClick={onPrev} sx={{ display: { xs: 'none', md: 'flex' }, position: 'absolute', left: 16, color: 'white', bgcolor: 'rgba(0,0,0,0.2)', '&:hover': { bgcolor: 'rgba(0,0,0,0.4)' } }}>
          <ArrowBackIos sx={{ pl: 0.5 }} />
        </IconButton>
        <IconButton onClick={onNext} sx={{ display: { xs: 'none', md: 'flex' }, position: 'absolute', right: 16, color: 'white', bgcolor: 'rgba(0,0,0,0.2)', '&:hover': { bgcolor: 'rgba(0,0,0,0.4)' } }}>
          <ArrowForwardIos />
        </IconButton>
      </>
    )}
  </Box>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HomePage(): React.ReactElement {
  const navigate = useNavigate();

  // Data state
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sections, setSections] = useState<HomeSection[]>([]);

  // Loading state
  const [loadingAds, setLoadingAds] = useState(true);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingSections, setLoadingSections] = useState(true);

  // Carousel state
  const [adIndex, setAdIndex] = useState(0);

  // Fetch all home data in parallel
  useEffect(() => {
    fetchAdvertisements()
      .then(setAdvertisements)
      .catch(() => setAdvertisements([]))
      .finally(() => setLoadingAds(false));

    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setLoadingCats(false));

    fetchHomeSections()
      .then(setSections)
      .catch(() => setSections([]))
      .finally(() => setLoadingSections(false));
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (advertisements.length <= 1) return;
    const timer = setInterval(() => {
      setAdIndex((prev) => (prev + 1) % advertisements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [advertisements.length]);

  const handlePrevAd = useCallback(() => {
    setAdIndex((prev) => (prev - 1 + advertisements.length) % advertisements.length);
  }, [advertisements.length]);

  const handleNextAd = useCallback(() => {
    setAdIndex((prev) => (prev + 1) % advertisements.length);
  }, [advertisements.length]);

  // ─── Product Section Renderer ───────────────────────────────────────────────
  const renderSection = (section: HomeSection) => (
    <Box key={section.id} sx={{ mb: { xs: 4, md: 6 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={700} color="#0f172a" sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
          {section.title}
        </Typography>
        {section.category_link_id && (
          <>
            <Button
              endIcon={<ChevronRight />}
              size="small"
              onClick={() => navigate(`/categories/${section.category_link_id}`)}
              sx={{ color: '#003be0', bgcolor: '#ffffff', fontWeight: 600, px: 2, border: '1px solid #003be0', borderRadius: 1.5, display: { xs: 'none', md: 'inline-flex' } }}
            >
              View More
            </Button>
            <Button
              endIcon={<ChevronRight />}
              size="small"
              onClick={() => navigate(`/categories/${section.category_link_id}`)}
              sx={{ color: '#003be0', fontWeight: 600, bgcolor: '#ffffff', px: 1.5, border: '1px solid #003be0', borderRadius: 1.5, display: { xs: 'inline-flex', md: 'none' } }}
            >
              View More
            </Button>
          </>
        )}
      </Stack>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {section.products.map((product: HomeSectionProduct) => (
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
                '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
              }}
            >
              <Box
                component="img"
                src={product.image_url || `https://placehold.co/300x300/e2e8f0/475569.png?text=${encodeURIComponent(product.name)}`}
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

  // Current advertisement to show
  const currentAd = advertisements[adIndex] ?? null;

  // ─── Fallback banner (if no ads from API) ──────────────────────────────────
  const fallbackBanner = (
    <Box
      sx={{
        bgcolor: '#003be0',
        borderRadius: { xs: 2, md: 3 },
        p: { xs: 3, md: 8 },
        mb: { xs: 4, md: 6 },
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: { xs: 180, md: 'auto' },
      }}
    >
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
        <Button variant="contained" sx={{ bgcolor: 'white', color: '#003be0', fontWeight: 700, px: { xs: 2, md: 4 }, py: { xs: 1, md: 1.5 }, fontSize: { xs: '0.75rem', md: '0.875rem' }, '&:hover': { bgcolor: '#f1f5f9' } }}>
          SHOP NOW
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
      <MobileTopBar />
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Header />
      </Box>

      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 }, pt: { xs: 2, md: 0 } }}>

        {/* ── Hero Banner ─────────────────────────────────────────────────── */}
        {loadingAds ? (
          <BannerSkeleton />
        ) : currentAd ? (
          <HeroBanner
            ad={currentAd}
            onPrev={handlePrevAd}
            onNext={handleNextAd}
            showArrows={advertisements.length > 1}
          />
        ) : (
          fallbackBanner
        )}

        {/* Carousel dot indicators */}
        {!loadingAds && advertisements.length > 1 && (
          <Stack direction="row" justifyContent="center" spacing={1} sx={{ mt: -3, mb: 3 }}>
            {advertisements.map((_, i) => (
              <Box
                key={i}
                onClick={() => setAdIndex(i)}
                sx={{
                  width: i === adIndex ? 20 : 8,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: i === adIndex ? '#003be0' : '#cbd5e1',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Stack>
        )}

        {/* ── Category Chips ───────────────────────────────────────────────── */}
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Typography variant="subtitle1" fontWeight={700} color="#0f172a" sx={{ mb: 1.5, fontSize: { xs: '0.95rem', md: '1rem' } }}>
            Browse by Category
          </Typography>
          {loadingCats ? (
            <ChipsSkeleton />
          ) : (
            <Stack direction="row" spacing={1.5} sx={{ overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
              {categories.map((cat) => (
                <Chip
                  key={cat.category_id}
                  label={`${cat.category_icon} ${cat.category_name}`}
                  onClick={() => navigate(`/categories/${cat.category_id}`)}
                  sx={{
                    bgcolor: `${cat.category_color}15`,
                    color: cat.category_color,
                    fontWeight: 700,
                    fontSize: { xs: '0.72rem', md: '0.78rem' },
                    border: `1.5px solid ${cat.category_color}40`,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    '&:hover': { bgcolor: cat.category_color, color: 'white' },
                    transition: 'all 0.2s',
                  }}
                />
              ))}
              <Chip
                label="🔍 All Categories"
                onClick={() => navigate('/categories')}
                sx={{
                  bgcolor: '#003be015',
                  color: '#003be0',
                  fontWeight: 700,
                  fontSize: { xs: '0.72rem', md: '0.78rem' },
                  border: '1.5px solid #003be040',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  '&:hover': { bgcolor: '#003be0', color: 'white' },
                  transition: 'all 0.2s',
                }}
              />
            </Stack>
          )}
        </Box>

        {/* ── Home Sections ────────────────────────────────────────────────── */}
        {loadingSections ? (
          <>
            <SectionSkeleton />
            <SectionSkeleton />
            <SectionSkeleton />
          </>
        ) : sections.length > 0 ? (
          sections.map(renderSection)
        ) : (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography color="#64748b">No products available right now. Check back soon!</Typography>
          </Box>
        )}

      </Container>

      <TrustBadges />
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Footer />
      </Box>
      <MobileBottomNav />
    </Box>
  );
}