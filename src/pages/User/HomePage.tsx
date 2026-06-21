import React from 'react';
import Header from "./Header";
import Footer from "./Footer";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Stack,
  Paper,
  IconButton,
} from '@mui/material';
import { ChevronRight, ArrowForwardIos, ArrowBackIos } from '@mui/icons-material';
import { mockProducts } from '../../data/mockStore';

export default function HomePage(): React.ReactElement {
  const bestSelling = mockProducts.filter((p) => p.category === 'Best Selling Products');
  const groceries = mockProducts.filter((p) => p.category === 'Grocery Essentials');
  const personalCare = mockProducts.filter((p) => p.category === 'Personal Care & Home Care');

  const renderSection = (title: string, products: typeof mockProducts) => (
    <Box sx={{ mb: 6 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={700} color="#0f172a">
          {title}
        </Typography>
        <Button 
          endIcon={<ChevronRight />} 
          sx={{ textTransform: 'none', color: '#0047FF', fontWeight: 600, border: '1px solid #e2e8f0', borderRadius: 2 }}
        >
          View More
        </Button>
      </Stack>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
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
                sx={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 1 }}
              />
              <Box>
                <Typography variant="subtitle2" fontWeight={700} color="#0f172a" sx={{ lineHeight: 1.2, mb: 0.5 }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="#64748b" sx={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
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
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 } }}>
        <Header />

        {/* Hero Banner */}
        <Box
          sx={{
            bgcolor: '#0047FF',
            borderRadius: 3,
            p: { xs: 4, md: 8 },
            mb: 6,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Background decorative elements */}
          <Box sx={{ position: 'absolute', top: -100, right: -50, width: 300, height: 300, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
          <Box sx={{ position: 'absolute', bottom: -50, right: 150, width: 200, height: 200, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
          
          <Box sx={{ position: 'relative', zIndex: 1, maxWidth: '50%' }}>
            <Typography variant="subtitle1" fontWeight={800} sx={{ bgcolor: '#FFC107', color: '#000', px: 2, py: 0.5, borderRadius: 1, display: 'inline-block', mb: 2 }}>
              BEST OFFER
            </Typography>
            <Typography variant="h2" fontWeight={900} sx={{ fontStyle: 'italic', mb: 1 }}>
              MEGA SALE
            </Typography>
            <Typography variant="h4" fontWeight={800} sx={{ color: '#FFC107', mb: 2 }}>
              UP TO 50% OFF
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
              Shop the best products<br />at unbeatable prices!
            </Typography>
            <Button variant="contained" sx={{ bgcolor: 'white', color: '#0047FF', fontWeight: 700, px: 4, py: 1.5, '&:hover': { bgcolor: '#f1f5f9' } }}>
              SHOP NOW
            </Button>
          </Box>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, position: 'relative', zIndex: 1 }}>
             {/* Abstract representation of items in the banner */}
             <Box sx={{ width: 120, height: 160, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2, transform: 'rotate(-10deg)' }}></Box>
             <Box sx={{ width: 140, height: 200, bgcolor: 'rgba(255,255,255,0.3)', borderRadius: 2, zIndex: 2 }}></Box>
             <Box sx={{ width: 120, height: 160, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2, transform: 'rotate(10deg)' }}></Box>
          </Box>
          
          {/* Carousel Arrows */}
          <IconButton sx={{ position: 'absolute', left: 16, color: 'white', bgcolor: 'rgba(0,0,0,0.2)', '&:hover': { bgcolor: 'rgba(0,0,0,0.4)' } }}>
            <ArrowBackIos sx={{ pl: 0.5 }} />
          </IconButton>
          <IconButton sx={{ position: 'absolute', right: 16, color: 'white', bgcolor: 'rgba(0,0,0,0.2)', '&:hover': { bgcolor: 'rgba(0,0,0,0.4)' } }}>
            <ArrowForwardIos />
          </IconButton>
        </Box>

        {/* Product Sections */}
        {renderSection("Best Selling Products", bestSelling)}
        {renderSection("Grocery Essentials", groceries)}
        {renderSection("Personal Care & Home Care", personalCare)}

      </Container>
      
      <Footer />
    </Box>
  );
}