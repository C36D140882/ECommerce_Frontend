import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Add,
  BusinessOutlined,
  DeleteOutline,
  EditOutlined,
  EmailOutlined,
  LanguageOutlined,
  LocationOnOutlined,
  MapOutlined,
  PersonOutline,
  PhoneOutlined,
  Refresh,
  Save,
  Search,
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  deleteAdminCompany,
  getAdminCompanies,
  saveAdminCompany,
  type AdminCompany,
  type CompanyPayload,
} from '../../api/companyApi';

const emptyCompany: CompanyPayload = {
  company_name: '',
  company_slug: '',
  contact_person: '',
  designation: '',
  phone_number: '',
  alternate_phone: '',
  email: '',
  website: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  logo_url: '',
  map_image_url: '',
  latitude: null,
  longitude: null,
  description: '',
  is_active: true,
  order: 0,
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const logoFallback = (name: string) =>
  `https://placehold.co/160x160/f8fafc/1e3a8a.png?text=${encodeURIComponent(name.slice(0, 3).toUpperCase())}`;

const mapFallback = (name: string) =>
  `https://placehold.co/760x260/e2e8f0/475569.png?text=${encodeURIComponent(`${name} Location`)}`;

export default function CompanyManagement(): React.ReactElement {
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CompanyPayload>(emptyCompany);
  const [deleteTarget, setDeleteTarget] = useState<AdminCompany | null>(null);
  const [notice, setNotice] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const showNotice = (message: string, severity: 'success' | 'error' = 'success') => {
    setNotice({ open: true, message, severity });
  };

  const loadCompanies = useCallback(async () => {
    setLoading(true);
    try {
      setCompanies(await getAdminCompanies());
    } catch (error) {
      showNotice(error instanceof Error ? error.message : 'Unable to load companies.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCompanies();
  }, [loadCompanies]);

  const filteredCompanies = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return companies;
    return companies.filter((company) =>
      [
        company.company_name,
        company.company_slug,
        company.contact_person,
        company.phone_number,
        company.email,
        company.city,
        company.state,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [companies, search]);

  const activeCount = companies.filter((company) => company.is_active).length;
  const inactiveCount = companies.length - activeCount;

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyCompany);
    setShowForm(false);
  };

  const startAdd = () => {
    setEditingId(null);
    setForm({ ...emptyCompany, order: companies.length + 1 });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startEdit = (company: AdminCompany) => {
    setEditingId(company.id);
    setForm({
      company_name: company.company_name,
      company_slug: company.company_slug,
      contact_person: company.contact_person,
      designation: company.designation,
      phone_number: company.phone_number,
      alternate_phone: company.alternate_phone,
      email: company.email,
      website: company.website,
      address: company.address,
      city: company.city,
      state: company.state,
      pincode: company.pincode,
      logo_url: company.logo_url,
      map_image_url: company.map_image_url,
      latitude: company.latitude,
      longitude: company.longitude,
      description: company.description,
      is_active: company.is_active,
      order: company.order,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateField = <K extends keyof CompanyPayload>(key: K, value: CompanyPayload[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleCompanyNameChange = (value: string) => {
    setForm((current) => ({
      ...current,
      company_name: value,
      company_slug: editingId || current.company_slug ? current.company_slug : slugify(value),
    }));
  };

  const validateForm = (): string | null => {
    if (!form.company_name.trim()) return 'Company name is required.';
    if (!form.company_slug.trim()) return 'Company slug is required.';
    if (!form.contact_person.trim()) return 'Contact person is required.';
    if (!form.phone_number.trim()) return 'Phone number is required.';
    if (!form.address.trim()) return 'Address is required.';
    if ((form.latitude === null) !== (form.longitude === null)) {
      return 'Enter both latitude and longitude, or leave both blank.';
    }
    return null;
  };

  const handleSave = async () => {
    const validationMessage = validateForm();
    if (validationMessage) {
      showNotice(validationMessage, 'error');
      return;
    }

    setSaving(true);
    try {
      const payload: CompanyPayload = {
        ...form,
        company_name: form.company_name.trim(),
        company_slug: slugify(form.company_slug),
        contact_person: form.contact_person.trim(),
        phone_number: form.phone_number.trim(),
        address: form.address.trim(),
        latitude: form.latitude === '' ? null : form.latitude,
        longitude: form.longitude === '' ? null : form.longitude,
      };
      await saveAdminCompany(payload, editingId ?? undefined);
      showNotice(editingId ? 'Company updated successfully.' : 'Company added successfully.');
      resetForm();
      await loadCompanies();
    } catch (error) {
      showNotice(error instanceof Error ? error.message : 'Unable to save company.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteAdminCompany(deleteTarget.id);
      showNotice('Company deleted successfully.');
      setDeleteTarget(null);
      await loadCompanies();
    } catch (error) {
      showNotice(error instanceof Error ? error.message : 'Unable to delete company.', 'error');
    }
  };

  const toggleStatus = async (company: AdminCompany) => {
    try {
      const payload: CompanyPayload = {
        company_name: company.company_name,
        company_slug: company.company_slug,
        contact_person: company.contact_person,
        designation: company.designation,
        phone_number: company.phone_number,
        alternate_phone: company.alternate_phone,
        email: company.email,
        website: company.website,
        address: company.address,
        city: company.city,
        state: company.state,
        pincode: company.pincode,
        logo_url: company.logo_url,
        map_image_url: company.map_image_url,
        latitude: company.latitude,
        longitude: company.longitude,
        description: company.description,
        is_active: !company.is_active,
        order: company.order,
      };
      await saveAdminCompany(payload, company.id);
      showNotice(`Company ${company.is_active ? 'disabled' : 'enabled'} successfully.`);
      await loadCompanies();
    } catch (error) {
      showNotice(error instanceof Error ? error.message : 'Unable to update company status.', 'error');
    }
  };

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', md: 'center' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" fontWeight={900} color="#0f172a">
            Company Management
          </Typography>
          <Typography variant="body2" color="#64748b" sx={{ mt: 0.4 }}>
            Manage the company cards displayed on the user-side Companies page.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.25}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => void loadCompanies()}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={startAdd}>
            Add Company
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 2,
          mb: 3,
        }}
      >
        {[
          { label: 'Total Companies', value: companies.length, color: '#1d4ed8' },
          { label: 'Active Companies', value: activeCount, color: '#059669' },
          { label: 'Inactive Companies', value: inactiveCount, color: '#dc2626' },
        ].map((item) => (
          <Paper key={item.label} elevation={0} sx={{ p: 2.25, border: '1px solid #e2e8f0' }}>
            <Typography variant="body2" color="#64748b">{item.label}</Typography>
            <Typography variant="h4" fontWeight={900} sx={{ color: item.color, mt: 0.5 }}>
              {item.value}
            </Typography>
          </Paper>
        ))}
      </Box>

      {showForm && (
        <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: 3, border: '1px solid #dbeafe' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
            <Box>
              <Typography variant="h6" fontWeight={900} color="#0f172a">
                {editingId ? 'Edit Company' : 'Add New Company'}
              </Typography>
              <Typography variant="body2" color="#64748b">
                Enter company, contact, address and map details.
              </Typography>
            </Box>
            <FormControlLabel
              control={(
                <Switch
                  checked={form.is_active}
                  onChange={(event) => updateField('is_active', event.target.checked)}
                />
              )}
              label={form.is_active ? 'Active' : 'Inactive'}
            />
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
              gap: 2,
            }}
          >
            <TextField
              required
              label="Company Name"
              value={form.company_name}
              onChange={(event) => handleCompanyNameChange(event.target.value)}
            />
            <TextField
              required
              label="Company Slug"
              value={form.company_slug}
              onChange={(event) => updateField('company_slug', slugify(event.target.value))}
              helperText="Unique URL-safe key"
            />
            <TextField
              required
              label="Contact Person"
              value={form.contact_person}
              onChange={(event) => updateField('contact_person', event.target.value)}
            />
            <TextField
              label="Designation"
              value={form.designation}
              onChange={(event) => updateField('designation', event.target.value)}
            />
            <TextField
              required
              label="Phone Number"
              value={form.phone_number}
              onChange={(event) => updateField('phone_number', event.target.value)}
            />
            <TextField
              label="Alternate Phone"
              value={form.alternate_phone}
              onChange={(event) => updateField('alternate_phone', event.target.value)}
            />
            <TextField
              type="email"
              label="Email Address"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
            />
            <TextField
              label="Website URL"
              value={form.website}
              onChange={(event) => updateField('website', event.target.value)}
              placeholder="https://example.com"
            />
            <TextField
              label="Logo URL"
              value={form.logo_url}
              onChange={(event) => updateField('logo_url', event.target.value)}
              placeholder="https://.../logo.png"
            />
            <TextField
              label="Custom Map Image URL"
              value={form.map_image_url}
              onChange={(event) => updateField('map_image_url', event.target.value)}
              helperText="Optional. Latitude/longitude generate a map automatically."
            />
            <TextField
              required
              multiline
              minRows={2}
              label="Address"
              value={form.address}
              onChange={(event) => updateField('address', event.target.value)}
              sx={{ gridColumn: { md: '1 / -1' } }}
            />
            <TextField
              label="City"
              value={form.city}
              onChange={(event) => updateField('city', event.target.value)}
            />
            <TextField
              label="State"
              value={form.state}
              onChange={(event) => updateField('state', event.target.value)}
            />
            <TextField
              label="Pincode"
              value={form.pincode}
              onChange={(event) => updateField('pincode', event.target.value)}
            />
            <TextField
              type="number"
              label="Display Order"
              value={form.order}
              onChange={(event) => updateField('order', Math.max(0, Number(event.target.value)))}
              inputProps={{ min: 0 }}
            />
            <TextField
              type="number"
              label="Latitude"
              value={form.latitude ?? ''}
              onChange={(event) => updateField('latitude', event.target.value || null)}
              inputProps={{ min: -90, max: 90, step: '0.000001' }}
            />
            <TextField
              type="number"
              label="Longitude"
              value={form.longitude ?? ''}
              onChange={(event) => updateField('longitude', event.target.value || null)}
              inputProps={{ min: -180, max: 180, step: '0.000001' }}
            />
            <TextField
              multiline
              minRows={3}
              label="Description"
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              sx={{ gridColumn: { md: '1 / -1' } }}
            />
          </Box>

          {(form.logo_url || form.map_image_url) && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '220px 1fr' },
                gap: 2,
                mt: 2.5,
              }}
            >
              {form.logo_url && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Logo Preview</Typography>
                  <Box
                    component="img"
                    src={form.logo_url}
                    alt="Logo preview"
                    sx={{ mt: 0.75, width: '100%', height: 130, objectFit: 'contain', border: '1px solid #e2e8f0' }}
                  />
                </Box>
              )}
              {form.map_image_url && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Map Preview</Typography>
                  <Box
                    component="img"
                    src={form.map_image_url}
                    alt="Map preview"
                    sx={{ mt: 0.75, width: '100%', height: 130, objectFit: 'cover', border: '1px solid #e2e8f0' }}
                  />
                </Box>
              )}
            </Box>
          )}

          <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button variant="outlined" onClick={resetForm} disabled={saving}>
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save />}
              onClick={() => void handleSave()}
              disabled={saving}
            >
              {editingId ? 'Update Company' : 'Save Company'}
            </Button>
          </Stack>
        </Paper>
      )}

      <Paper elevation={0} sx={{ p: 2, mb: 2, border: '1px solid #e2e8f0' }}>
        <TextField
          fullWidth
          size="small"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by company, person, phone, email or location..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {loading ? (
        <Box sx={{ minHeight: 260, display: 'grid', placeItems: 'center' }}>
          <CircularProgress />
        </Box>
      ) : filteredCompanies.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', border: '1px dashed #cbd5e1' }}>
          <BusinessOutlined sx={{ fontSize: 54, color: '#94a3b8' }} />
          <Typography fontWeight={800} color="#334155" sx={{ mt: 1 }}>
            No company records found
          </Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(3, minmax(0, 1fr))' },
            gap: 2.5,
          }}
        >
          {filteredCompanies.map((company) => (
            <Card key={company.id} elevation={0} sx={{ border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <CardContent sx={{ pb: 1.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Avatar
                    src={company.logo_url || logoFallback(company.company_name)}
                    sx={{ width: 68, height: 68, bgcolor: '#fff', border: '1px solid #e2e8f0' }}
                    imgProps={{ style: { objectFit: 'contain', padding: 5 } }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box sx={{ minWidth: 0 }}>
                        <Typography fontWeight={900} color="#0f172a" noWrap>
                          {company.company_name}
                        </Typography>
                        <Typography variant="caption" color="#64748b" noWrap>
                          {company.company_slug}
                        </Typography>
                      </Box>
                      <Chip
                        size="small"
                        label={company.is_active ? 'Active' : 'Inactive'}
                        color={company.is_active ? 'success' : 'default'}
                        variant={company.is_active ? 'filled' : 'outlined'}
                      />
                    </Stack>
                    <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mt: 1 }}>
                      <PersonOutline sx={{ fontSize: 18, color: '#64748b' }} />
                      <Typography variant="body2" color="#334155" noWrap>{company.contact_person}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mt: 0.5 }}>
                      <PhoneOutlined sx={{ fontSize: 18, color: '#64748b' }} />
                      <Typography variant="body2" color="#334155">{company.phone_number}</Typography>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>

              <Box
                component="img"
                src={company.resolved_map_image_url || mapFallback(company.company_name)}
                alt={`${company.company_name} map`}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = mapFallback(company.company_name);
                }}
                sx={{ width: '100%', height: 135, objectFit: 'cover', bgcolor: '#f8fafc' }}
              />

              <CardContent sx={{ pt: 1.5 }}>
                <Stack direction="row" spacing={0.8} alignItems="flex-start">
                  <LocationOnOutlined sx={{ fontSize: 18, color: '#64748b', mt: 0.2 }} />
                  <Typography variant="body2" color="#475569" sx={{ minHeight: 40 }}>
                    {[company.address, company.city, company.state].filter(Boolean).join(', ')}
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.5 }}>
                  <Button
                    size="small"
                    onClick={() => void toggleStatus(company)}
                    color={company.is_active ? 'warning' : 'success'}
                  >
                    {company.is_active ? 'Disable' : 'Enable'}
                  </Button>
                  <Stack direction="row" spacing={0.5}>
                    {company.map_url && (
                      <Tooltip title="Open map">
                        <IconButton
                          size="small"
                          component="a"
                          href={company.map_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <MapOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {company.website && (
                      <Tooltip title="Open website">
                        <IconButton
                          size="small"
                          component="a"
                          href={company.website}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <LanguageOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {company.email && (
                      <Tooltip title={company.email}>
                        <IconButton size="small" component="a" href={`mailto:${company.email}`}>
                          <EmailOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Edit company">
                      <IconButton size="small" color="primary" onClick={() => startEdit(company)}>
                        <EditOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete company">
                      <IconButton size="small" color="error" onClick={() => setDeleteTarget(company)}>
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Company</DialogTitle>
        <DialogContent>
          <Typography>
            Delete <strong>{deleteTarget?.company_name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => void handleDelete()}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notice.open}
        autoHideDuration={3500}
        onClose={() => setNotice((current) => ({ ...current, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={notice.severity}
          onClose={() => setNotice((current) => ({ ...current, open: false }))}
          variant="filled"
        >
          {notice.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
