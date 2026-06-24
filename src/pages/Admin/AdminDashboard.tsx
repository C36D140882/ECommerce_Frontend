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
  IconButton,
  Avatar,
} from '@mui/material';
import {
  People,
  Security,
  CheckCircle,
  Cancel,
  TrendingUp,
  TrendingDown,
  PersonAdd,
  AddModerator,
  GridOn,
  PictureAsPdf,
  AddCircleOutline,
  EditOutlined,
  DeleteOutline,
  VisibilityOutlined,
  ManageAccountsOutlined,
  AdminPanelSettingsOutlined,
  VpnKeyOutlined,
  SettingsOutlined,
} from '@mui/icons-material';
import { fetchWithAuth } from '../../api/api';
import { readCache, writeCache } from '../../api/adminCache';

const CACHE_KEY = 'adminDashboardCache';

/* ------------------------------------------------------------------ */
/* Reusable config types                                              */
/* ------------------------------------------------------------------ */

interface StatCardConfig {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  trend: string;
  trendUp: boolean;
  subtitle: string;
}

interface QuickActionConfig {
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

interface ModuleLink {
  label: string;
  icon: React.ReactNode;
  color: string;
}

interface ManagementModuleConfig {
  title: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  links: ModuleLink[];
}

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

  /* ---------------------------------------------------------------- */
  /* UI-only configuration (no business logic here)                    */
  /* ---------------------------------------------------------------- */

  const cards: StatCardConfig[] = [
    {
      title: 'Total Users',
      value: loading ? '—' : stats.users,
      icon: <People sx={{ fontSize: 26 }} />,
      color: '#2563eb',
      bg: '#eff6ff',
      trend: '+12.5%',
      trendUp: true,
      subtitle: 'from last month',
    },
    {
      title: 'Total Roles',
      value: loading ? '—' : stats.roles,
      icon: <Security sx={{ fontSize: 26 }} />,
      color: '#8b5cf6',
      bg: '#f5f3ff',
      trend: '+8.4%',
      trendUp: true,
      subtitle: 'from last month',
    },
    {
      title: 'Active Users',
      value: loading ? '—' : stats.active,
      icon: <CheckCircle sx={{ fontSize: 26 }} />,
      color: '#10b981',
      bg: '#ecfdf5',
      trend: '+10.2%',
      trendUp: true,
      subtitle: 'from last month',
    },
    {
      title: 'Inactive Users',
      value: loading ? '—' : stats.inactive,
      icon: <Cancel sx={{ fontSize: 26 }} />,
      color: '#ef4444',
      bg: '#fef2f2',
      trend: '-5.1%',
      trendUp: false,
      subtitle: 'from last month',
    },
  ];

  const quickActions: QuickActionConfig[] = [
    { label: 'Add User', icon: <PersonAdd />, color: '#2563eb', bg: '#eff6ff' },
    { label: 'Add Role', icon: <AddModerator />, color: '#10b981', bg: '#ecfdf5' },
    { label: 'Export Excel', icon: <GridOn />, color: '#8b5cf6', bg: '#f5f3ff' },
    { label: 'Export PDF', icon: <PictureAsPdf />, color: '#ef4444', bg: '#fef2f2' },
  ];

  const managementModules: ManagementModuleConfig[] = [
    {
      title: 'User Management',
      icon: <ManageAccountsOutlined />,
      color: '#2563eb',
      bg: '#eff6ff',
      links: [
        { label: 'Add User', icon: <AddCircleOutline sx={{ fontSize: 16 }} />, color: '#2563eb' },
        { label: 'Edit User', icon: <EditOutlined sx={{ fontSize: 16 }} />, color: '#2563eb' },
        { label: 'Delete User', icon: <DeleteOutline sx={{ fontSize: 16 }} />, color: '#ef4444' },
        { label: 'View Users', icon: <VisibilityOutlined sx={{ fontSize: 16 }} />, color: '#2563eb' },
      ],
    },
    {
      title: 'Role Management',
      icon: <AdminPanelSettingsOutlined />,
      color: '#10b981',
      bg: '#ecfdf5',
      links: [
        { label: 'Add Role', icon: <AddCircleOutline sx={{ fontSize: 16 }} />, color: '#10b981' },
        { label: 'Edit Role', icon: <EditOutlined sx={{ fontSize: 16 }} />, color: '#10b981' },
        { label: 'Delete Role', icon: <DeleteOutline sx={{ fontSize: 16 }} />, color: '#ef4444' },
        { label: 'View Roles', icon: <VisibilityOutlined sx={{ fontSize: 16 }} />, color: '#10b981' },
      ],
    },
    {
      title: 'Permission Management',
      icon: <VpnKeyOutlined />,
      color: '#8b5cf6',
      bg: '#f5f3ff',
      links: [
        { label: 'Add Permission', icon: <AddCircleOutline sx={{ fontSize: 16 }} />, color: '#8b5cf6' },
        { label: 'Edit Permission', icon: <EditOutlined sx={{ fontSize: 16 }} />, color: '#8b5cf6' },
        { label: 'Delete Permission', icon: <DeleteOutline sx={{ fontSize: 16 }} />, color: '#ef4444' },
        { label: 'View Permissions', icon: <VisibilityOutlined sx={{ fontSize: 16 }} />, color: '#8b5cf6' },
      ],
    },
    {
      title: 'System Management',
      icon: <SettingsOutlined />,
      color: '#f59e0b',
      bg: '#fffbeb',
      links: [
        { label: 'System Settings', icon: <SettingsOutlined sx={{ fontSize: 16 }} />, color: '#f59e0b' },
        { label: 'Audit Logs', icon: <VisibilityOutlined sx={{ fontSize: 16 }} />, color: '#f59e0b' },
        { label: 'Backup Data', icon: <EditOutlined sx={{ fontSize: 16 }} />, color: '#f59e0b' },
        { label: 'Clear Cache', icon: <DeleteOutline sx={{ fontSize: 16 }} />, color: '#ef4444' },
      ],
    },
  ];

  // Placeholder distribution for the role/status donut widget (UI only)
  const totalForDonut = stats.active + stats.inactive || 1;
  const activePct = Math.round((stats.active / totalForDonut) * 100);
  const inactivePct = 100 - activePct;

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100%', p: { xs: 2, md: 3 } }}>
      {/* ---------------------------------------------------------------- */}
      {/* Header                                                           */}
      {/* ---------------------------------------------------------------- */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800} color="#1e293b">
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          Welcome back, Admin. Here&apos;s what&apos;s happening.
        </Typography>
      </Box>

      {/* ---------------------------------------------------------------- */}
      {/* Stat Cards                                                       */}
      {/* ---------------------------------------------------------------- */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {cards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={card.title}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 4,
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                border: '1px solid #f1f5f9',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: '0 8px 20px rgba(0,0,0,0.10)',
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
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: card.bg, color: card.color }}>
                    {card.icon}
                  </Box>
                </Stack>
                <Stack direction="row" alignItems="center" sx={{ mt: 2 }}>
                  {card.trendUp ? (
                    <TrendingUp sx={{ fontSize: 14, color: '#10b981', mr: 0.5 }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 14, color: '#ef4444', mr: 0.5 }} />
                  )}
                  <Typography variant="caption" color={card.trendUp ? '#10b981' : '#ef4444'} fontWeight={600}>
                    {card.trend}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                    {card.subtitle}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ---------------------------------------------------------------- */}
      {/* Quick Actions + Analytics overview                              */}
      {/* ---------------------------------------------------------------- */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card
            elevation={0}
            sx={{ borderRadius: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', height: '100%' }}
          >
            <Box sx={{ p: 3, pb: 1.5 }}>
              <Typography variant="h6" fontWeight={700} color="#1e293b">
                Quick Actions
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ p: 3 }}>
              <Grid container spacing={2}>
                {quickActions.map((action) => (
                  <Grid size={6} key={action.label}>
                    <Stack
                      alignItems="center"
                      justifyContent="center"
                      spacing={1}
                      sx={{
                        py: 2,
                        borderRadius: 3,
                        border: '1px solid #f1f5f9',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: action.bg, borderColor: action.color },
                      }}
                    >
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: action.bg,
                          color: action.color,
                        }}
                      >
                        {action.icon}
                      </Box>
                      <Typography variant="caption" fontWeight={600} color="#475569" textAlign="center">
                        {action.label}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <Card
            elevation={0}
            sx={{ borderRadius: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', height: '100%' }}
          >
            <Box sx={{ p: 3, pb: 1.5 }}>
              <Typography variant="h6" fontWeight={700} color="#1e293b">
                Analytics Overview
              </Typography>
              <Typography variant="body2" color="text.secondary">
                User and role distribution snapshot
              </Typography>
            </Box>
            <Divider />
            <Grid container spacing={0}>
              {/* User growth placeholder bars */}
              <Grid size={{ xs: 12, sm: 4 }} sx={{ p: 3, borderRight: { sm: '1px solid #f1f5f9' } }}>
                <Typography variant="body2" fontWeight={600} color="#475569" sx={{ mb: 2 }}>
                  User Growth
                </Typography>
                <Stack direction="row" spacing={1} alignItems="flex-end" sx={{ height: 90 }}>
                  {[40, 65, 50, 80, 60, 95].map((h, i) => (
                    <Box
                      key={i}
                      sx={{
                        flex: 1,
                        height: `${h}%`,
                        borderRadius: 1,
                        bgcolor: i === 5 ? '#2563eb' : '#dbeafe',
                      }}
                    />
                  ))}
                </Stack>
                <Typography variant="h6" fontWeight={800} color="#1e293b" sx={{ mt: 1.5 }}>
                  {stats.users}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total registered users
                </Typography>
              </Grid>

              {/* Active users placeholder */}
              <Grid size={{ xs: 12, sm: 4 }} sx={{ p: 3, borderRight: { sm: '1px solid #f1f5f9' } }}>
                <Typography variant="body2" fontWeight={600} color="#475569" sx={{ mb: 2 }}>
                  Active Users
                </Typography>
                <Box sx={{ position: 'relative', height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box
                    sx={{
                      width: 90,
                      height: 90,
                      borderRadius: '50%',
                      background: `conic-gradient(#10b981 0% ${activePct}%, #f1f5f9 ${activePct}% 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: 62,
                        height: 62,
                        borderRadius: '50%',
                        bgcolor: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="body2" fontWeight={800} color="#1e293b">
                        {activePct}%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Typography variant="h6" fontWeight={800} color="#1e293b" sx={{ mt: 1.5 }}>
                  {stats.active}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Active out of {stats.users} users
                </Typography>
              </Grid>

              {/* Role distribution placeholder */}
              <Grid size={{ xs: 12, sm: 4 }} sx={{ p: 3 }}>
                <Typography variant="body2" fontWeight={600} color="#475569" sx={{ mb: 2 }}>
                  Role Distribution
                </Typography>
                <Stack spacing={1.25} sx={{ mt: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                      <Typography variant="caption" color="#475569">
                        Active ({activePct}%)
                      </Typography>
                    </Stack>
                  </Stack>
                  <Box sx={{ height: 6, borderRadius: 3, bgcolor: '#ecfdf5', overflow: 'hidden' }}>
                    <Box sx={{ height: '100%', width: `${activePct}%`, bgcolor: '#10b981' }} />
                  </Box>

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ef4444' }} />
                      <Typography variant="caption" color="#475569">
                        Inactive ({inactivePct}%)
                      </Typography>
                    </Stack>
                  </Stack>
                  <Box sx={{ height: 6, borderRadius: 3, bgcolor: '#fef2f2', overflow: 'hidden' }}>
                    <Box sx={{ height: '100%', width: `${inactivePct}%`, bgcolor: '#ef4444' }} />
                  </Box>
                </Stack>
                <Typography variant="h6" fontWeight={800} color="#1e293b" sx={{ mt: 2 }}>
                  {stats.roles}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total roles configured
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>

      {/* ---------------------------------------------------------------- */}
      {/* Management Modules                                               */}
      {/* ---------------------------------------------------------------- */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={700} color="#1e293b" sx={{ mb: 2 }}>
          Management Modules (CRUD Operations)
        </Typography>
        <Grid container spacing={3}>
          {managementModules.map((module) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={module.title}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 4,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  border: '1px solid #f1f5f9',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: module.bg,
                        color: module.color,
                      }}
                    >
                      {module.icon}
                    </Box>
                    <Typography variant="subtitle1" fontWeight={700} color="#1e293b">
                      {module.title}
                    </Typography>
                  </Stack>
                  <Stack spacing={1.25}>
                    {module.links.map((link) => (
                      <Stack
                        key={link.label}
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{
                          cursor: 'pointer',
                          color: link.color,
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        {link.icon}
                        <Typography variant="body2" fontWeight={500}>
                          {link.label}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ---------------------------------------------------------------- */}
      {/* Recent Users                                                     */}
      {/* ---------------------------------------------------------------- */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
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
        <TableContainer sx={{ maxHeight: 480 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#475569', bgcolor: '#f8fafc' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', bgcolor: '#f8fafc' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', bgcolor: '#f8fafc' }}>Mobile</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', bgcolor: '#f8fafc' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', bgcolor: '#f8fafc' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', bgcolor: '#f8fafc' }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', color: '#94a3b8', py: 4 }}>
                    {loading ? 'Loading…' : 'No users found.'}
                  </TableCell>
                </TableRow>
              ) : (
                recentUsers.map((u) => (
                  <TableRow
                    key={u.id}
                    hover
                    sx={{
                      '&:hover': { bgcolor: '#f8fafc' },
                      '&:last-child td': { borderBottom: 0 },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: '#2563eb' }}>
                          {String(u.name || '?').charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body2" fontWeight={600} color="#1e293b">
                          {u.name}
                        </Typography>
                      </Stack>
                    </TableCell>
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
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <IconButton size="small" sx={{ color: '#2563eb' }}>
                          <VisibilityOutlined sx={{ fontSize: 18 }} />
                        </IconButton>
                        <IconButton size="small" sx={{ color: '#475569' }}>
                          <EditOutlined sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Stack>
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