import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Button, Card, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Select,
  MenuItem, FormControl, InputLabel, Chip, Stack, Alert, Skeleton,
} from '@mui/material';
import { Edit, Delete, Add, Block, CheckCircle } from '@mui/icons-material';
import { fetchWithAuth } from '../../api/api';
import { readCache, writeCache } from '../../api/adminCache';

const CACHE_KEY = 'adminUsersCache';

const EMPTY_USER = {
  id: '', name: '', email: '', mobile_number: '', password: '', role_id: '', status: 'Active',
};

export default function UserManagement(): React.ReactElement {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(EMPTY_USER);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  const loadData = async (forceUpdate = false) => {
    if (!forceUpdate) {
      const cached = readCache<{ users: any[]; roles: any[] }>(CACHE_KEY);
      if (cached) {
        setUsers(cached.users);
        setRoles(cached.roles);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    try {
      const [uRes, rRes] = await Promise.all([
        fetchWithAuth('/auth/users/'),
        fetchWithAuth('/auth/roles/'),
      ]);

      let fetchedUsers: any[] = [];
      let fetchedRoles: any[] = [];

      if (uRes.ok) fetchedUsers = await uRes.json();
      if (rRes.ok) fetchedRoles = await rRes.json();

      setUsers(fetchedUsers);
      setRoles(fetchedRoles);
      writeCache(CACHE_KEY, { users: fetchedUsers, roles: fetchedRoles });
    } catch {
      setError('Failed to load data. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Dialog helpers ────────────────────────────────────────────────────────

  const openCreate = () => { setCurrentUser(EMPTY_USER); setError(''); setOpen(true); };
  const openEdit = (user: any) => {
    setCurrentUser({ ...user, password: '', role_id: user.role_id ?? '' });
    setError('');
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); setError(''); };

  // ── CRUD handlers ─────────────────────────────────────────────────────────

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const isEdit = !!currentUser.id;
      const url = isEdit ? `/auth/users/${currentUser.id}/` : '/auth/users/';

      const payload = { ...currentUser };
      if (isEdit && !payload.password) delete payload.password;

      const res = await fetchWithAuth(url, {
        method: isEdit ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        handleClose();
        loadData(true);
      } else {
        const data = await res.json();
        setError(data?.detail ?? JSON.stringify(data));
      }
    } catch {
      setError('Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    const res = await fetchWithAuth(`/auth/users/${id}/`, { method: 'DELETE' });
    if (res.ok) loadData(true);
  };

  const toggleStatus = async (id: string) => {
    const res = await fetchWithAuth(`/auth/users/${id}/toggle_status/`, { method: 'POST' });
    if (res.ok) loadData(true);
  };

  // ── Skeleton rows ─────────────────────────────────────────────────────────

  const SkeletonRows = () => (
    <>
      {[1, 2, 3].map(n => (
        <TableRow key={n}>
          {[160, 200, 120, 80, 70, 90].map((w, i) => (
            <TableCell key={i}><Skeleton width={w} /></TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );

  // ── Render ────────────────────────────────────────────────────────────────

  const activeCount = users.filter(u => u.status === 'Active').length;

  return (
    <Box>
      {/* ── Header ── */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h5" fontWeight={600} color="text.primary">
            User management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage all system users, assign roles, and control access
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={openCreate}
          disableElevation
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 2.5,
            bgcolor: '#1e40af',
            '&:hover': { bgcolor: '#1e3a8a' },
          }}
        >
          Add user
        </Button>
      </Stack>

      {/* ── Summary chips ── */}
      {!loading && users.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip
            label={`${users.length} user${users.length !== 1 ? 's' : ''}`}
            size="small"
            sx={{
              bgcolor: '#eff6ff',
              color: '#1e40af',
              fontWeight: 600,
              fontSize: 12,
              border: '1px solid #bfdbfe',
            }}
          />
          <Chip
            label={`${activeCount} active`}
            size="small"
            sx={{
              bgcolor: '#f0fdf4',
              color: '#15803d',
              fontWeight: 600,
              fontSize: 12,
              border: '1px solid #bbf7d0',
            }}
          />
          {users.length - activeCount > 0 && (
            <Chip
              label={`${users.length - activeCount} inactive`}
              size="small"
              sx={{
                bgcolor: '#fef2f2',
                color: '#b91c1c',
                fontWeight: 600,
                fontSize: 12,
                border: '1px solid #fecaca',
              }}
            />
          )}
        </Stack>
      )}

      {/* ── Table card ── */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                {['Name', 'Email', 'Mobile', 'Role', 'Status', 'Actions'].map(h => (
                  <TableCell
                    key={h}
                    sx={{
                      fontWeight: 600,
                      fontSize: 12,
                      color: 'text.secondary',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      py: 1.5,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <SkeletonRows />
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    sx={{ textAlign: 'center', py: 6, color: 'text.disabled', fontSize: 14 }}
                  >
                    No users found — click <strong>Add user</strong> to create one.
                  </TableCell>
                </TableRow>
              ) : (
                users.map(user => (
                  <TableRow
                    key={user.id}
                    hover
                    sx={{ '&:last-child td': { borderBottom: 0 } }}
                  >
                    <TableCell>
                      <Typography fontWeight={600} fontSize={14} color="text.primary">
                        {user.name}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ color: 'text.secondary', fontSize: 14 }}>
                      {user.email}
                    </TableCell>

                    <TableCell sx={{ color: 'text.secondary', fontSize: 14 }}>
                      {user.mobile_number || '—'}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={user.role_name || 'No role'}
                        size="small"
                        sx={{
                          bgcolor: '#eff6ff',
                          color: '#1e40af',
                          fontWeight: 500,
                          fontSize: 12,
                          border: '1px solid #bfdbfe',
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={user.status}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: 12,
                          ...(user.status === 'Active'
                            ? { bgcolor: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }
                            : { bgcolor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }),
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <IconButton
                          size="small"
                          title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
                          onClick={() => toggleStatus(user.id)}
                          sx={{
                            border: '1px solid',
                            borderRadius: 1.5,
                            ...(user.status === 'Active'
                              ? { color: 'error.main', borderColor: '#fecaca', '&:hover': { bgcolor: '#fef2f2' } }
                              : { color: 'success.main', borderColor: '#bbf7d0', '&:hover': { bgcolor: '#f0fdf4' } }),
                          }}
                        >
                          {user.status === 'Active'
                            ? <Block fontSize="small" />
                            : <CheckCircle fontSize="small" />}
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={() => openEdit(user)}
                          aria-label={`Edit ${user.name}`}
                          sx={{
                            color: '#1e40af',
                            border: '1px solid #bfdbfe',
                            borderRadius: 1.5,
                            '&:hover': { bgcolor: '#eff6ff' },
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={() => handleDelete(user.id)}
                          aria-label={`Delete ${user.name}`}
                          sx={{
                            color: 'error.main',
                            border: '1px solid #fecaca',
                            borderRadius: 1.5,
                            '&:hover': { bgcolor: '#fef2f2' },
                          }}
                        >
                          <Delete fontSize="small" />
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

      {/* ── Create / Edit dialog ── */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: 16, pb: 1 }}>
          {currentUser.id ? 'Edit user' : 'Add new user'}
        </DialogTitle>

        <DialogContent
          sx={{ pt: '12px !important', display: 'flex', flexDirection: 'column', gap: 2.5 }}
        >
          {error && (
            <Alert severity="error" sx={{ borderRadius: 2, fontSize: 13 }}>
              {error}
            </Alert>
          )}

          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              autoFocus
              label="Full name"
              value={currentUser.name || ''}
              onChange={e => setCurrentUser({ ...currentUser, name: e.target.value })}
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              label="Mobile number"
              value={currentUser.mobile_number || ''}
              onChange={e => setCurrentUser({ ...currentUser, mobile_number: e.target.value })}
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Stack>

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={currentUser.email || ''}
            onChange={e => setCurrentUser({ ...currentUser, email: e.target.value })}
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            placeholder={currentUser.id ? 'Leave blank to keep unchanged' : 'Enter password'}
            onChange={e => setCurrentUser({ ...currentUser, password: e.target.value })}
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          <FormControl
            fullWidth
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          >
            <InputLabel>Role</InputLabel>
            <Select
              value={currentUser.role_id || ''}
              label="Role"
              onChange={e => setCurrentUser({ ...currentUser, role_id: e.target.value })}
            >
              <MenuItem value=""><em>No role</em></MenuItem>
              {roles.map(r => (
                <MenuItem key={r.id} value={r.id}>{r.role_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving}
            disableElevation
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              bgcolor: '#1e40af',
              '&:hover': { bgcolor: '#1e3a8a' },
            }}
          >
            {saving ? 'Saving…' : currentUser.id ? 'Update user' : 'Create user'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}