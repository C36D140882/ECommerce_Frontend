import React from 'react';
import { Box, Container, Grid, Typography, Stack, IconButton, Link } from '@mui/material';
import { Facebook, Instagram, Twitter, YouTube } from '@mui/icons-material';

export default function Footer(): React.ReactElement {
  return (
    <Box sx={{ bgcolor: 'white', pt: 6, mt: 'auto', borderTop: '1px solid #e2e8f0' }}>
      <Container maxWidth="xl">
        <Grid container spacing={4} sx={{ mb: 4, px: { xs: 2, md: 3 } }}>
          {/* About Us */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, color: '#0f172a' }}>
              About Us
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6 }}>
              RK Store is your one-stop destination
              for quality products at the best prices.
              We are committed to delivering the
              best shopping experience.
            </Typography>
          </Grid>

          {/* Contact Information */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, color: '#0f172a' }}>
              Contact Information
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ color: '#475569' }}>
                📞 +91 98765 43210
              </Typography>
              <Typography variant="body2" sx={{ color: '#475569' }}>
                ✉️ support@rkstore.com
              </Typography>
              <Typography variant="body2" sx={{ color: '#475569' }}>
                📍 Chennai, Tamil Nadu, India
              </Typography>
            </Stack>
          </Grid>

          {/* Customer Support */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, color: '#0f172a' }}>
              Customer Support
            </Typography>
            <Grid container spacing={1}>
              <Grid size={{ xs: 6 }}>
                <Stack spacing={1}>
                  <Link href="#" color="inherit" underline="none" sx={{ color: '#475569', '&:hover': { color: '#0ea5e9' }, fontSize: '0.875rem' }}>Help Center</Link>
                  <Link href="#" color="inherit" underline="none" sx={{ color: '#475569', '&:hover': { color: '#0ea5e9' }, fontSize: '0.875rem' }}>Shipping & Delivery</Link>
                  <Link href="#" color="inherit" underline="none" sx={{ color: '#475569', '&:hover': { color: '#0ea5e9' }, fontSize: '0.875rem' }}>Returns & Refunds</Link>
                  <Link href="#" color="inherit" underline="none" sx={{ color: '#475569', '&:hover': { color: '#0ea5e9' }, fontSize: '0.875rem' }}>Track Your Order</Link>
                </Stack>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Stack spacing={1}>
                  <Link href="#" color="inherit" underline="none" sx={{ color: '#475569', '&:hover': { color: '#0ea5e9' }, fontSize: '0.875rem' }}>Privacy Policy</Link>
                  <Link href="#" color="inherit" underline="none" sx={{ color: '#475569', '&:hover': { color: '#0ea5e9' }, fontSize: '0.875rem' }}>Terms & Conditions</Link>
                  <Link href="#" color="inherit" underline="none" sx={{ color: '#475569', '&:hover': { color: '#0ea5e9' }, fontSize: '0.875rem' }}>Refund Policy</Link>
                </Stack>
              </Grid>
            </Grid>
          </Grid>

          {/* Follow Us */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, color: '#0f172a' }}>
              Follow Us
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton size="small" sx={{ bgcolor: '#3b5998', color: 'white', '&:hover': { bgcolor: '#2d4373' } }}>
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ bgcolor: '#e1306c', color: 'white', '&:hover': { bgcolor: '#c13584' } }}>
                <Instagram fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ bgcolor: '#1da1f2', color: 'white', '&:hover': { bgcolor: '#0c85d0' } }}>
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ bgcolor: '#ff0000', color: 'white', '&:hover': { bgcolor: '#cc0000' } }}>
                <YouTube fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>
      </Container>
      
      {/* Bottom Bar */}
      <Box sx={{ bgcolor: '#1e3a8a', color: 'white', py: 2, textAlign: 'center' }}>
        <Typography variant="body2">
          Copyright © 2026 RK Store. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
}
