import React, { useEffect, useState, useRef } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
} from '@mui/material';
import { People, Security, CheckCircle, Cancel, TrendingUp } from '@mui/icons-material';
import { fetchWithAuth } from '../../api/api';
import { readCache, writeCache } from '../../api/adminCache';

const CACHE_KEY = 'adminDashboardCache';

export default function AdminDashboard(): React.ReactElement {
  const [stats, setStats] = useState({ users: 0, roles: 0, active: 0, inactive: 0 });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchStats = async () => {
      // ── Serve from cache if available ─────────────────────────────────────
      const cached = readCache<{ stats: typeof stats; recentUsers: any[] }>(CACHE_KEY);
      if (cached) {
        setStats(cached.stats);
        setRecentUsers(cached.recentUsers);
        setLoading(false);
        return;
      }

      // ── Fetch from API ─────────────────────────────────────────────────────
      try {
        const [uRes, rRes] = await Promise.all([
          fetchWithAuth('/auth/users/'),
          fetchWithAuth('/auth/roles/'),
        ]);
        if (!uRes.ok || !rRes.ok) return;

        const users = await uRes.json();
        const roles = await rRes.json();
        const active = users.filter((u: any) => u.status === 'Active').length;

        const newStats = { users: users.length, roles: roles.length, active, inactive: users.length - active };
        const recent = users.slice(0, 5);

        writeCache(CACHE_KEY, { stats: newStats, recentUsers: recent });
        setStats(newStats);
        setRecentUsers(recent);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Total Users',
      value: stats.users,
      icon: <People sx={{ fontSize: 28 }} />,
      color: '#3b82f6',
      bg: '#eff6ff',
      trend: '+12%',
    },
    {
      title: 'Total Roles',
      value: stats.roles,
      icon: <Security sx={{ fontSize: 28 }} />,
      color: '#8b5cf6',
      bg: '#f5f3ff',
      trend: 'Custom',
    },
    {
      title: 'Active Users',
      value: stats.active,
      icon: <CheckCircle sx={{ fontSize: 28 }} />,
      color: '#10b981',
      bg: '#ecfdf5',
      trend: '+5%',
    },
    {
      title: 'Inactive Users',
      value: stats.inactive,
      icon: <Cancel sx={{ fontSize: 28 }} />,
      color: '#ef4444',
      bg: '#fef2f2',
      trend: '-2%',
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} color="#1e293b">
          Dashboard Overview
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Welcome back, Admin. Here's what's happening.
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {cards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={card.title}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                border: '1px solid #f1f5f9',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mb: 1 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h3" fontWeight={800} color="#1e293b" sx={{ lineHeight: 1 }}>
                      {loading ? '—' : card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: card.bg, color: card.color }}>
                    {card.icon}
                  </Box>
                </Stack>
                <Stack direction="row" alignItems="center" sx={{ mt: 2 }}>
                  <TrendingUp sx={{ fontSize: 14, color: '#10b981', mr: 0.5 }} />
                  <Typography variant="caption" color="#10b981" fontWeight={600}>
                    {card.trend}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                    this month
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Users */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          border: '1px solid #f1f5f9',
        }}
      >
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography variant="h6" fontWeight={700} color="#1e293b">
            Recent Users
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Latest registered users in the system
          </Typography>
        </Box>
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Mobile</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', color: '#94a3b8', py: 4 }}>
                    {loading ? 'Loading…' : 'No users found.'}
                  </TableCell>
                </TableRow>
              ) : (
                recentUsers.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{u.name}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{u.email}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{u.mobile_number || '—'}</TableCell>
                    <TableCell>
                      <Chip label={u.role_name || 'None'} size="small" variant="outlined" color="primary" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={u.status}
                        size="small"
                        color={u.status === 'Active' ? 'success' : 'error'}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}