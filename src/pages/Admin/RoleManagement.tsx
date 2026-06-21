import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Button, Card, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Stack, Alert,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { fetchWithAuth } from '../../api/api';
import { readCache, writeCache } from '../../api/adminCache';

/**
 * Cache key must match the entry in clearAllAdminCache() in adminCache.ts.
 * sessionStorage is used → cache survives in-app navigation but is wiped
 * on a full browser page refresh, which triggers a fresh API call.
 */
const CACHE_KEY = 'adminRolesCache';

const EMPTY_ROLE = { id: '', role_name: '' };

export default function RoleManagement(): React.ReactElement {
  const [roles, setRoles] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<any>(EMPTY_ROLE);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  /**
   * useRef guard: prevents the useEffect from firing twice in React 18
   * StrictMode (which mounts → unmounts → remounts in dev).
   * In production this is a no-op; in dev it avoids duplicate API calls.
   */
  const hasFetched = useRef(false);

  /**
   * loadData(forceUpdate = false)
   *
   * forceUpdate = false (default, on mount):
   *   → Check sessionStorage cache first.
   *   → If cache is valid (within TTL), use it and skip the API call.
   *   → If cache is empty/expired, fetch from API and write to cache.
   *
   * forceUpdate = true (after create / edit / delete):
   *   → Bypass cache, fetch fresh data, overwrite cache.
   *
   * Browser refresh wipes sessionStorage → cache is always empty on reload
   * → fresh API call happens automatically.
   */
  const loadData = async (forceUpdate = false) => {
    if (!forceUpdate) {
      const cached = readCache<any[]>(CACHE_KEY);
      if (cached) {
        setRoles(cached);
        setLoading(false);
        return; // ← skip API call entirely
      }
    }

    setLoading(true);
    try {
      const rRes = await fetchWithAuth('/auth/roles/');
      if (rRes.ok) {
        const fetched = await rRes.json();
        setRoles(fetched);
        writeCache(CACHE_KEY, fetched); // persist to sessionStorage
      }
    } catch {
      setError('Failed to load roles. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return; // StrictMode guard
    hasFetched.current = true;
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Dialog helpers ────────────────────────────────────────────────────────

  const openCreate = () => { setCurrent(EMPTY_ROLE); setError(''); setOpen(true); };
  const openEdit = (role: any) => {
    setCurrent({ id: role.id, role_name: role.role_name });
    setError('');
    setOpen(true);
  };

  // ── CRUD handlers ─────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!current.role_name.trim()) { setError('Role name is required.'); return; }
    setSaving(true);
    setError('');
    try {
      const isEdit = !!current.id;
      const url = isEdit ? `/auth/roles/${current.id}/` : '/auth/roles/';
      const res = await fetchWithAuth(url, {
        method: isEdit ? 'PUT' : 'POST',
        body: JSON.stringify({ role_name: current.role_name }),
      });
      if (res.ok) {
        setOpen(false);
        loadData(true); // force cache refresh after mutation
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
    if (!window.confirm('Delete this role? Users with this role will lose their access.')) return;
    const res = await fetchWithAuth(`/auth/roles/${id}/`, { method: 'DELETE' });
    if (res.ok) loadData(true); // force cache refresh after mutation
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="#1e293b">Role Management</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Create and manage roles to control user access levels
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
          Add Role
        </Button>
      </Stack>

      {/* Table */}
      <Card sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                {['#', 'Role Name', 'Created', 'Actions'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 700, color: '#475569' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4, color: '#94a3b8' }}>
                    {loading ? 'Loading…' : 'No roles yet. Click "Add Role" to create one.'}
                  </TableCell>
                </TableRow>
              ) : roles.map((role, index) => (
                <TableRow key={role.id} hover>
                  <TableCell sx={{ color: '#64748b', fontSize: 13 }}>
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={600} color="#1e293b">{role.role_name}</Typography>
                  </TableCell>
                  <TableCell sx={{ color: '#64748b', fontSize: 13 }}>
                    {role.created_at ? new Date(role.created_at).toLocaleDateString() : '—'}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5}>
                      <IconButton size="small" color="primary" onClick={() => openEdit(role)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(role.id)}>
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
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {current.id ? 'Edit Role' : 'Create New Role'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

          <TextField
            fullWidth autoFocus
            label="Role Name"
            placeholder="e.g. Manager, Sales Executive"
            value={current.role_name}
            onChange={(e) => setCurrent({ ...current, role_name: e.target.value })}
            sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
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
            {saving ? 'Saving…' : current.id ? 'Update Role' : 'Create Role'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}