import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Button, Card, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Select,
  MenuItem, FormControl, InputLabel, Chip, Stack, Alert,
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
    // Return cache if it exists and we're not forcing an update
    if (!forceUpdate) {
      const cached = readCache<{ users: any[], roles: any[] }>(CACHE_KEY);
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

      let fetchedUsers = [];
      let fetchedRoles = [];

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
  }, []);

  const openCreate = () => { setCurrentUser(EMPTY_USER); setError(''); setOpen(true); };
  const openEdit = (user: any) => {
    setCurrentUser({ ...user, password: '', role_id: user.role_id ?? '' });
    setError('');
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const isEdit = !!currentUser.id;
      const url = isEdit ? `/auth/users/${currentUser.id}/` : '/auth/users/';

      // Don't send blank password on edit
      const payload = { ...currentUser };
      if (isEdit && !payload.password) delete payload.password;

      const res = await fetchWithAuth(url, {
        method: isEdit ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setOpen(false);
        loadData(true); // force cache refresh
      } else {
        const data = await res.json();
        setError(JSON.stringify(data));
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
    if (res.ok) loadData(true); // force cache refresh
  };

  const toggleStatus = async (id: string) => {
    const res = await fetchWithAuth(`/auth/users/${id}/toggle_status/`, { method: 'POST' });
    if (res.ok) loadData(true); // force cache refresh
  };

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="#1e293b">User Management</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage all system users, assign roles, and control access
          </Typography>
        </Box>
        <Button
          variant="contained" startIcon={<Add />}
          onClick={openCreate}
          sx={{
            borderRadius: 2, textTransform: 'none', fontWeight: 600,
            background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
          }}
        >
          Add User
        </Button>
      </Stack>

      {/* Table */}
      <Card sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                {['Name', 'Email', 'Mobile', 'Role', 'Status', 'Actions'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 700, color: '#475569' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: '#94a3b8' }}>
                    {loading ? 'Loading…' : 'No users found.'}
                  </TableCell>
                </TableRow>
              ) : users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>{user.name}</TableCell>
                  <TableCell sx={{ color: '#475569' }}>{user.email}</TableCell>
                  <TableCell sx={{ color: '#475569' }}>{user.mobile_number || '—'}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role_name || 'No Role'}
                      size="small" variant="outlined" color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status}
                      size="small"
                      color={user.status === 'Active' ? 'success' : 'error'}
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5}>
                      <IconButton
                        size="small"
                        title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        color={user.status === 'Active' ? 'error' : 'success'}
                        onClick={() => toggleStatus(user.id)}
                      >
                        {user.status === 'Active' ? <Block fontSize="small" /> : <CheckCircle fontSize="small" />}
                      </IconButton>
                      <IconButton size="small" color="primary" onClick={() => openEdit(user)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(user.id)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {currentUser.id ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

          <TextField
            fullWidth label="Full Name"
            value={currentUser.name || ''}
            onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
            sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            autoFocus
          />
          <TextField
            fullWidth label="Email"
            type="email"
            value={currentUser.email || ''}
            onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <TextField
            fullWidth label="Mobile Number"
            value={currentUser.mobile_number || ''}
            onChange={(e) => setCurrentUser({ ...currentUser, mobile_number: e.target.value })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <TextField
            fullWidth label="Password"
            type="password"
            placeholder={currentUser.id ? 'Leave blank to keep unchanged' : 'Enter password'}
            onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={currentUser.role_id || ''}
              label="Role"
              onChange={(e) => setCurrentUser({ ...currentUser, role_id: e.target.value })}
            >
              <MenuItem value=""><em>No Role</em></MenuItem>
              {roles.map(r => (
                <MenuItem key={r.id} value={r.id}>{r.role_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button onClick={() => setOpen(false)} variant="outlined" sx={{ borderRadius: 2, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            {saving ? 'Saving…' : currentUser.id ? 'Update User' : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}