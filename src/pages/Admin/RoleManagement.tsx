import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Button, Card, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Stack,
  Alert, Chip, Skeleton,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { fetchWithAuth } from '../../api/api';
import { readCache, writeCache } from '../../api/adminCache';

const CACHE_KEY = 'adminRolesCache';
const EMPTY_ROLE = { id: '', role_name: '' };

export default function RoleManagement(): React.ReactElement {
  const [roles, setRoles] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<any>(EMPTY_ROLE);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  const loadData = async (forceUpdate = false) => {
    if (!forceUpdate) {
      const cached = readCache<any[]>(CACHE_KEY);
      if (cached) {
        setRoles(cached);
        setLoading(false);
        return;
      }
    }
    setLoading(true);
    try {
      const rRes = await fetchWithAuth('/auth/roles/');
      if (rRes.ok) {
        const fetched = await rRes.json();
        setRoles(fetched);
        writeCache(CACHE_KEY, fetched);
      }
    } catch {
      setError('Failed to load roles. Check your connection.');
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

  const openCreate = () => { setCurrent(EMPTY_ROLE); setError(''); setOpen(true); };
  const openEdit = (role: any) => {
    setCurrent({ id: role.id, role_name: role.role_name });
    setError('');
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); setError(''); };

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
    if (!window.confirm('Delete this role? Users with this role will lose their access.')) return;
    const res = await fetchWithAuth(`/auth/roles/${id}/`, { method: 'DELETE' });
    if (res.ok) loadData(true);
  };

  // ── Skeleton rows ─────────────────────────────────────────────────────────

  const SkeletonRows = () => (
    <>
      {[1, 2, 3].map(n => (
        <TableRow key={n}>
          <TableCell><Skeleton width={20} /></TableCell>
          <TableCell><Skeleton width={140} /></TableCell>
          <TableCell><Skeleton width={90} /></TableCell>
          <TableCell><Skeleton width={64} /></TableCell>
        </TableRow>
      ))}
    </>
  );

  // ── Render ────────────────────────────────────────────────────────────────

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
            Role management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Create and manage roles to control user access levels
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
          Add role
        </Button>
      </Stack>

      {/* ── Summary chip ── */}
      {!loading && roles.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip
            label={`${roles.length} role${roles.length !== 1 ? 's' : ''}`}
            size="small"
            sx={{
              bgcolor: '#eff6ff',
              color: '#1e40af',
              fontWeight: 600,
              fontSize: 12,
              border: '1px solid #bfdbfe',
            }}
          />
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
                {['#', 'Role name', 'Created', 'Actions'].map(h => (
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
              ) : roles.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    sx={{
                      textAlign: 'center',
                      py: 6,
                      color: 'text.disabled',
                      fontSize: 14,
                    }}
                  >
                    No roles yet — click <strong>Add role</strong> to create one.
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role, index) => (
                  <TableRow
                    key={role.id}
                    hover
                    sx={{ '&:last-child td': { borderBottom: 0 } }}
                  >
                    <TableCell sx={{ color: 'text.disabled', fontSize: 13, width: 48 }}>
                      {index + 1}
                    </TableCell>

                    <TableCell>
                      <Typography fontWeight={600} fontSize={14} color="text.primary">
                        {role.role_name}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>
                      {role.created_at
                        ? new Date(role.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : '—'}
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <IconButton
                          size="small"
                          onClick={() => openEdit(role)}
                          aria-label={`Edit ${role.role_name}`}
                          sx={{
                            color: '#1e40af',
                            border: '1px solid',
                            borderColor: '#bfdbfe',
                            borderRadius: 1.5,
                            '&:hover': { bgcolor: '#eff6ff' },
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={() => handleDelete(role.id)}
                          aria-label={`Delete ${role.role_name}`}
                          sx={{
                            color: 'error.main',
                            border: '1px solid',
                            borderColor: '#fecaca',
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
        maxWidth="xs"
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
          {current.id ? 'Edit role' : 'Create new role'}
        </DialogTitle>

        <DialogContent sx={{ pt: '12px !important', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && (
            <Alert severity="error" sx={{ borderRadius: 2, fontSize: 13 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            autoFocus
            label="Role name"
            placeholder="e.g. Manager, Sales Executive"
            value={current.role_name}
            onChange={e => setCurrent({ ...current, role_name: e.target.value })}
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
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
            {saving ? 'Saving…' : current.id ? 'Update role' : 'Create role'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}