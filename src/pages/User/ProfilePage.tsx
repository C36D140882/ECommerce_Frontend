import React from 'react';
import Header from "./Header";
import Footer from "./Footer";
import { Box, Container, Typography, Paper, Grid, Avatar, Divider, Button } from '@mui/material';
import { getUserData, logout } from '../../api/api';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage(): React.ReactElement {
  const navigate = useNavigate();
  const rawUser = getUserData() || {};
  const user = {
    username: String(rawUser.username || rawUser.first_name || rawUser.name || rawUser.mobile_number || 'Guest User'),
    email: rawUser.email || 'guest@rkstore.com',
    role: rawUser.role || 'User',
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 } }}>
        <Header />

        <Box sx={{ py: 6, px: { xs: 2, md: 4 } }}>
          <Typography variant="h4" fontWeight={800} color="#0f172a" sx={{ mb: 4 }}>
            My Profile
          </Typography>

          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: 'white' }}>
            <Grid container spacing={4} alignItems="center">
              <Grid>
                <Avatar sx={{ width: 100, height: 100, bgcolor: '#0047FF', fontSize: 40 }}>
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
              </Grid>
              <Grid size="grow">
                <Typography variant="h5" fontWeight={700} color="#0f172a" sx={{ mb: 1 }}>
                  {user.username}
                </Typography>
                <Typography variant="body1" color="#475569" sx={{ mb: 1 }}>
                  {user.email}
                </Typography>
                <Typography variant="body2" sx={{ display: 'inline-block', bgcolor: '#e0f2fe', color: '#0369a1', px: 1.5, py: 0.5, borderRadius: 1, fontWeight: 600 }}>
                  Role: {user.role}
                </Typography>
              </Grid>
              <Grid>
                <Button variant="outlined" color="error" onClick={handleLogout} sx={{ fontWeight: 600, px: 3 }}>
                  Logout
                </Button>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" fontWeight={700} color="#0f172a" sx={{ mb: 2 }}>
              Account Settings
            </Typography>
            <Typography variant="body2" color="#64748b">
              Your profile information is managed by your organization's administrator.
              If you need to update your email or role, please contact support.
            </Typography>
          </Paper>
        </Box>

      </Container>
      <Footer />
    </Box>
  );
}
