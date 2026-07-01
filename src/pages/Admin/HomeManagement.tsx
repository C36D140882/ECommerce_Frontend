import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Add,
  CategoryOutlined,
  Close,
  DeleteOutline,
  EditOutlined,
  HomeOutlined,
  ImageOutlined,
  Inventory2Outlined,
  Refresh,
  Save,
  Search,
  ViewCarouselOutlined,
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
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  deleteAdminAdvertisement,
  deleteAdminCategory,
  deleteAdminHomeProduct,
  deleteAdminHomeSection,
  getAdminAdvertisements,
  getAdminCategories,
  getAdminHomeProducts,
  getAdminHomeSections,
  saveAdminAdvertisement,
  saveAdminCategory,
  saveAdminHomeProduct,
  saveAdminHomeSection,
  type AdminAdvertisement,
  type AdminCategory,
  type AdminHomeSection,
  type AdminHomeSectionProduct,
  type AdvertisementPayload,
  type CategoryPayload,
  type HomeProductPayload,
  type HomeSectionPayload,
} from '../../api/adminHomeApi';

type TabKey = 'advertisements' | 'categories' | 'sections' | 'products';
type DeleteTarget = { type: TabKey; id: number; label: string } | null;

const emptyAdvertisement: AdvertisementPayload = {
  title: '',
  subtitle: '',
  badge_text: 'BEST OFFER',
  discount_text: 'UP TO 50% OFF',
  description: '',
  button_text: 'SHOP NOW',
  button_link: '/',
  bg_color: '#0047FF',
  image_url: '',
  is_active: true,
  order: 0,
};

const emptyCategory: CategoryPayload = {
  category_id: '',
  category_name: '',
  category_icon: '',
  category_color: '#0047FF',
  description: '',
  is_active: true,
  order: 0,
};

const emptySection: HomeSectionPayload = {
  title: '',
  section_key: '',
  category_link_id: null,
  is_active: true,
  order: 0,
};

const emptyProduct: HomeProductPayload = {
  section: 0,
  name: '',
  description: '',
  image_url: '',
  order: 0,
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const matchesSearch = (search: string, ...values: Array<string | number | null | undefined>) => {
  const query = search.trim().toLowerCase();
  if (!query) return true;
  return values.some((value) => String(value ?? '').toLowerCase().includes(query));
};

const previewSx = {
  width: '100%',
  height: 170,
  objectFit: 'cover',
  bgcolor: '#f8fafc',
  borderBottom: '1px solid #e2e8f0',
} as const;

export default function HomeManagement(): React.ReactElement {
  const [tab, setTab] = useState<TabKey>('advertisements');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [advertisements, setAdvertisements] = useState<AdminAdvertisement[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [sections, setSections] = useState<AdminHomeSection[]>([]);
  const [products, setProducts] = useState<AdminHomeSectionProduct[]>([]);

  const [advertisementForm, setAdvertisementForm] = useState<AdvertisementPayload>(emptyAdvertisement);
  const [categoryForm, setCategoryForm] = useState<CategoryPayload>(emptyCategory);
  const [sectionForm, setSectionForm] = useState<HomeSectionPayload>(emptySection);
  const [productForm, setProductForm] = useState<HomeProductPayload>(emptyProduct);

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [notice, setNotice] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showNotice = (message: string, severity: 'success' | 'error' = 'success') => {
    setNotice({ open: true, message, severity });
  };

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [adsData, categoryData, sectionData, productData] = await Promise.all([
        getAdminAdvertisements(),
        getAdminCategories(),
        getAdminHomeSections(),
        getAdminHomeProducts(),
      ]);
      setAdvertisements(adsData);
      setCategories(categoryData);
      setSections(sectionData);
      setProducts(productData);
    } catch (error) {
      showNotice(error instanceof Error ? error.message : 'Unable to load home content.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const resetCurrentForm = () => {
    setEditingId(null);
    setShowForm(false);
    setAdvertisementForm(emptyAdvertisement);
    setCategoryForm(emptyCategory);
    setSectionForm(emptySection);
    setProductForm({ ...emptyProduct, section: sections[0]?.id ?? 0 });
  };

  const startAdd = () => {
    setEditingId(null);
    setShowForm(true);
    if (tab === 'advertisements') setAdvertisementForm(emptyAdvertisement);
    if (tab === 'categories') setCategoryForm(emptyCategory);
    if (tab === 'sections') setSectionForm(emptySection);
    if (tab === 'products') setProductForm({ ...emptyProduct, section: sections[0]?.id ?? 0 });
  };

  const handleTabChange = (_event: React.SyntheticEvent, value: TabKey) => {
    setTab(value);
    setSearch('');
    setShowForm(false);
    setEditingId(null);
  };

  const saveAdvertisement = async () => {
    if (!advertisementForm.title.trim()) {
      showNotice('Advertisement title is required.', 'error');
      return;
    }
    setSaving(true);
    try {
      await saveAdminAdvertisement(advertisementForm, editingId ?? undefined);
      showNotice(editingId ? 'Advertisement updated successfully.' : 'Advertisement added successfully.');
      resetCurrentForm();
      await loadAll();
    } catch (error) {
      showNotice(error instanceof Error ? error.message : 'Unable to save advertisement.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const saveCategory = async () => {
    if (!categoryForm.category_name.trim() || !categoryForm.category_id.trim()) {
      showNotice('Category name and category ID are required.', 'error');
      return;
    }
    setSaving(true);
    try {
      await saveAdminCategory(categoryForm, editingId ?? undefined);
      showNotice(editingId ? 'Category updated successfully.' : 'Category added successfully.');
      resetCurrentForm();
      await loadAll();
    } catch (error) {
      showNotice(error instanceof Error ? error.message : 'Unable to save category.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const saveSection = async () => {
    if (!sectionForm.title.trim() || !sectionForm.section_key.trim()) {
      showNotice('Section title and section key are required.', 'error');
      return;
    }
    setSaving(true);
    try {
      await saveAdminHomeSection(sectionForm, editingId ?? undefined);
      showNotice(editingId ? 'Home section updated successfully.' : 'Home section added successfully.');
      resetCurrentForm();
      await loadAll();
    } catch (error) {
      showNotice(error instanceof Error ? error.message : 'Unable to save home section.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const saveProduct = async () => {
    if (!productForm.name.trim() || !productForm.section) {
      showNotice('Product name and home section are required.', 'error');
      return;
    }
    setSaving(true);
    try {
      await saveAdminHomeProduct(productForm, editingId ?? undefined);
      showNotice(editingId ? 'Home product updated successfully.' : 'Home product added successfully.');
      resetCurrentForm();
      await loadAll();
    } catch (error) {
      showNotice(error instanceof Error ? error.message : 'Unable to save home product.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      if (deleteTarget.type === 'advertisements') await deleteAdminAdvertisement(deleteTarget.id);
      if (deleteTarget.type === 'categories') await deleteAdminCategory(deleteTarget.id);
      if (deleteTarget.type === 'sections') await deleteAdminHomeSection(deleteTarget.id);
      if (deleteTarget.type === 'products') await deleteAdminHomeProduct(deleteTarget.id);
      showNotice(`${deleteTarget.label} deleted successfully.`);
      setDeleteTarget(null);
      resetCurrentForm();
      await loadAll();
    } catch (error) {
      showNotice(error instanceof Error ? error.message : 'Unable to delete item.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const filteredAdvertisements = useMemo(
    () => advertisements.filter((item) => matchesSearch(search, item.title, item.subtitle, item.badge_text, item.discount_text)),
    [advertisements, search],
  );

  const filteredCategories = useMemo(
    () => categories.filter((item) => matchesSearch(search, item.category_name, item.category_id, item.description)),
    [categories, search],
  );

  const filteredSections = useMemo(
    () => sections.filter((item) => matchesSearch(search, item.title, item.section_key, item.category_link_id)),
    [sections, search],
  );

  const filteredProducts = useMemo(
    () => products.filter((item) => matchesSearch(search, item.name, item.section_title, item.description)),
    [products, search],
  );

  const activeCount = advertisements.filter((item) => item.is_active).length
    + categories.filter((item) => item.is_active).length
    + sections.filter((item) => item.is_active).length;

  const renderAdvertisementForm = () => (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, border: '1px solid #dbeafe', mb: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={800}>{editingId ? 'Edit Advertisement' : 'Add Advertisement'}</Typography>
        <IconButton onClick={resetCurrentForm}><Close /></IconButton>
      </Stack>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField fullWidth required label="Title" value={advertisementForm.title} onChange={(e) => setAdvertisementForm({ ...advertisementForm, title: e.target.value })} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField fullWidth label="Subtitle" value={advertisementForm.subtitle} onChange={(e) => setAdvertisementForm({ ...advertisementForm, subtitle: e.target.value })} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField fullWidth label="Badge Text" value={advertisementForm.badge_text} onChange={(e) => setAdvertisementForm({ ...advertisementForm, badge_text: e.target.value })} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField fullWidth label="Discount Text" value={advertisementForm.discount_text} onChange={(e) => setAdvertisementForm({ ...advertisementForm, discount_text: e.target.value })} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField fullWidth label="Button Text" value={advertisementForm.button_text} onChange={(e) => setAdvertisementForm({ ...advertisementForm, button_text: e.target.value })} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField fullWidth label="Display Order" type="number" value={advertisementForm.order} onChange={(e) => setAdvertisementForm({ ...advertisementForm, order: Number(e.target.value) })} inputProps={{ min: 0 }} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField fullWidth label="Button Link" value={advertisementForm.button_link} onChange={(e) => setAdvertisementForm({ ...advertisementForm, button_link: e.target.value })} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField fullWidth label="Image URL" value={advertisementForm.image_url} onChange={(e) => setAdvertisementForm({ ...advertisementForm, image_url: e.target.value })} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField fullWidth multiline minRows={3} label="Description" value={advertisementForm.description} onChange={(e) => setAdvertisementForm({ ...advertisementForm, description: e.target.value })} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth type="color" label="Background Color" value={advertisementForm.bg_color} onChange={(e) => setAdvertisementForm({ ...advertisementForm, bg_color: e.target.value })} InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControlLabel control={<Switch checked={advertisementForm.is_active} onChange={(e) => setAdvertisementForm({ ...advertisementForm, is_active: e.target.checked })} />} label="Active on user home page" />
        </Grid>
      </Grid>
      {advertisementForm.image_url && (
        <Box component="img" src={advertisementForm.image_url} alt="Advertisement preview" sx={{ mt: 2, width: 220, height: 120, objectFit: 'cover', borderRadius: 2, border: '1px solid #e2e8f0' }} />
      )}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3 }}>
        <Button variant="contained" startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save />} onClick={() => void saveAdvertisement()} disabled={saving}>
          {editingId ? 'Update Advertisement' : 'Save Advertisement'}
        </Button>
        <Button variant="outlined" onClick={resetCurrentForm} disabled={saving}>Cancel</Button>
      </Stack>
    </Paper>
  );

  const renderCategoryForm = () => (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, border: '1px solid #dbeafe', mb: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={800}>{editingId ? 'Edit Category' : 'Add Category'}</Typography>
        <IconButton onClick={resetCurrentForm}><Close /></IconButton>
      </Stack>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth required label="Category Name" value={categoryForm.category_name}
            onChange={(e) => {
              const name = e.target.value;
              setCategoryForm({ ...categoryForm, category_name: name, category_id: editingId ? categoryForm.category_id : slugify(name) });
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField fullWidth required label="Category ID / Slug" value={categoryForm.category_id} onChange={(e) => setCategoryForm({ ...categoryForm, category_id: slugify(e.target.value) })} helperText="Example: grocery-essentials" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField fullWidth label="Category Icon" value={categoryForm.category_icon} onChange={(e) => setCategoryForm({ ...categoryForm, category_icon: e.target.value })} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField fullWidth type="color" label="Category Color" value={categoryForm.category_color} onChange={(e) => setCategoryForm({ ...categoryForm, category_color: e.target.value })} InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField fullWidth label="Display Order" type="number" value={categoryForm.order} onChange={(e) => setCategoryForm({ ...categoryForm, order: Number(e.target.value) })} inputProps={{ min: 0 }} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControlLabel control={<Switch checked={categoryForm.is_active} onChange={(e) => setCategoryForm({ ...categoryForm, is_active: e.target.checked })} />} label="Active" />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField fullWidth multiline minRows={3} label="Description" value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} />
        </Grid>
      </Grid>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3 }}>
        <Button variant="contained" startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save />} onClick={() => void saveCategory()} disabled={saving}>
          {editingId ? 'Update Category' : 'Save Category'}
        </Button>
        <Button variant="outlined" onClick={resetCurrentForm} disabled={saving}>Cancel</Button>
      </Stack>
    </Paper>
  );

  const renderSectionForm = () => (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, border: '1px solid #dbeafe', mb: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={800}>{editingId ? 'Edit Home Section' : 'Add Home Section'}</Typography>
        <IconButton onClick={resetCurrentForm}><Close /></IconButton>
      </Stack>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth required label="Section Title" value={sectionForm.title}
            onChange={(e) => {
              const title = e.target.value;
              setSectionForm({ ...sectionForm, title, section_key: editingId ? sectionForm.section_key : slugify(title) });
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField fullWidth required label="Section Key" value={sectionForm.section_key} onChange={(e) => setSectionForm({ ...sectionForm, section_key: slugify(e.target.value) })} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField select fullWidth label="View More Category" value={sectionForm.category_link_id ?? ''} onChange={(e) => setSectionForm({ ...sectionForm, category_link_id: e.target.value || null })}>
            <MenuItem value="">No category link</MenuItem>
            {categories.map((category) => <MenuItem key={category.id} value={category.category_id}>{category.category_name}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField fullWidth label="Display Order" type="number" value={sectionForm.order} onChange={(e) => setSectionForm({ ...sectionForm, order: Number(e.target.value) })} inputProps={{ min: 0 }} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControlLabel control={<Switch checked={sectionForm.is_active} onChange={(e) => setSectionForm({ ...sectionForm, is_active: e.target.checked })} />} label="Active" />
        </Grid>
      </Grid>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3 }}>
        <Button variant="contained" startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save />} onClick={() => void saveSection()} disabled={saving}>
          {editingId ? 'Update Section' : 'Save Section'}
        </Button>
        <Button variant="outlined" onClick={resetCurrentForm} disabled={saving}>Cancel</Button>
      </Stack>
    </Paper>
  );

  const renderProductForm = () => (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, border: '1px solid #dbeafe', mb: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={800}>{editingId ? 'Edit Home Product' : 'Add Home Product'}</Typography>
        <IconButton onClick={resetCurrentForm}><Close /></IconButton>
      </Stack>
      {sections.length === 0 ? (
        <Alert severity="warning">Create a home section before adding section products.</Alert>
      ) : (
        <>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField select fullWidth required label="Home Section" value={productForm.section || ''} onChange={(e) => setProductForm({ ...productForm, section: Number(e.target.value) })}>
                {sections.map((section) => <MenuItem key={section.id} value={section.id}>{section.title}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth required label="Product Name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField fullWidth label="Image URL" value={productForm.image_url} onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Display Order" type="number" value={productForm.order} onChange={(e) => setProductForm({ ...productForm, order: Number(e.target.value) })} inputProps={{ min: 0 }} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth multiline minRows={3} label="Description" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
            </Grid>
          </Grid>
          {productForm.image_url && (
            <Box component="img" src={productForm.image_url} alt="Product preview" sx={{ mt: 2, width: 170, height: 130, objectFit: 'cover', borderRadius: 2, border: '1px solid #e2e8f0' }} />
          )}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3 }}>
            <Button variant="contained" startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save />} onClick={() => void saveProduct()} disabled={saving}>
              {editingId ? 'Update Product' : 'Save Product'}
            </Button>
            <Button variant="outlined" onClick={resetCurrentForm} disabled={saving}>Cancel</Button>
          </Stack>
        </>
      )}
    </Paper>
  );

  const renderCurrentForm = () => {
    if (!showForm) return null;
    if (tab === 'advertisements') return renderAdvertisementForm();
    if (tab === 'categories') return renderCategoryForm();
    if (tab === 'sections') return renderSectionForm();
    return renderProductForm();
  };

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100%', p: { xs: 1, md: 2 } }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={900} color="#1e293b">Home Content Management</Typography>
          <Typography variant="body2" color="text.secondary">Manage all dynamic content shown on the customer home page.</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={() => void loadAll()} disabled={loading}>Refresh</Button>
          <Button variant="contained" startIcon={<Add />} onClick={startAdd}>Add New</Button>
        </Stack>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Advertisements', value: advertisements.length, icon: <ViewCarouselOutlined />, bg: '#eff6ff', color: '#2563eb' },
          { label: 'Categories', value: categories.length, icon: <CategoryOutlined />, bg: '#ecfdf5', color: '#059669' },
          { label: 'Home Sections', value: sections.length, icon: <HomeOutlined />, bg: '#fff7ed', color: '#ea580c' },
          { label: 'Active Content', value: activeCount, icon: <Inventory2Outlined />, bg: '#f5f3ff', color: '#7c3aed' },
        ].map((item) => (
          <Grid size={{ xs: 6, lg: 3 }} key={item.label}>
            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>{item.label}</Typography>
                    <Typography variant="h4" fontWeight={900} color="#1e293b">{item.value}</Typography>
                  </Box>
                  <Avatar variant="rounded" sx={{ bgcolor: item.bg, color: item.color }}>{item.icon}</Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden', mb: 3 }}>
        <Tabs value={tab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" sx={{ px: 1 }}>
          <Tab value="advertisements" label={`Advertisements (${advertisements.length})`} icon={<ViewCarouselOutlined />} iconPosition="start" />
          <Tab value="categories" label={`Categories (${categories.length})`} icon={<CategoryOutlined />} iconPosition="start" />
          <Tab value="sections" label={`Sections (${sections.length})`} icon={<HomeOutlined />} iconPosition="start" />
          <Tab value="products" label={`Products (${products.length})`} icon={<Inventory2Outlined />} iconPosition="start" />
        </Tabs>
        <Divider />
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search home content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
          />
        </Box>
      </Paper>

      {renderCurrentForm()}

      {loading ? (
        <Box sx={{ minHeight: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Box>
      ) : (
        <>
          {tab === 'advertisements' && (
            <Grid container spacing={2}>
              {filteredAdvertisements.map((item) => (
                <Grid size={{ xs: 12, md: 6, xl: 4 }} key={item.id}>
                  <Card elevation={0} sx={{ height: '100%', borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    {item.image_url ? <Box component="img" src={item.image_url} alt={item.title} sx={previewSx} /> : <Box sx={{ ...previewSx, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImageOutlined sx={{ fontSize: 54, color: '#cbd5e1' }} /></Box>}
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                        <Box>
                          <Typography variant="h6" fontWeight={800}>{item.title}</Typography>
                          <Typography variant="body2" color="text.secondary">{item.discount_text || item.subtitle || 'No subtitle'}</Typography>
                        </Box>
                        <Chip size="small" label={item.is_active ? 'Active' : 'Inactive'} color={item.is_active ? 'success' : 'default'} />
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, minHeight: 40 }}>{item.description || 'No description'}</Typography>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                        <Chip size="small" variant="outlined" label={`Order: ${item.order}`} />
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Edit"><IconButton onClick={() => { setEditingId(item.id); setAdvertisementForm({ title: item.title, subtitle: item.subtitle, badge_text: item.badge_text, discount_text: item.discount_text, description: item.description, button_text: item.button_text, button_link: item.button_link, bg_color: item.bg_color, image_url: item.image_url, is_active: item.is_active, order: item.order }); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><EditOutlined /></IconButton></Tooltip>
                          <Tooltip title="Delete"><IconButton color="error" onClick={() => setDeleteTarget({ type: 'advertisements', id: item.id, label: item.title })}><DeleteOutline /></IconButton></Tooltip>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {tab === 'categories' && (
            <Grid container spacing={2}>
              {filteredCategories.map((item) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={item.id}>
                  <Card elevation={0} sx={{ height: '100%', borderRadius: 3, border: '1px solid #e2e8f0' }}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ bgcolor: item.category_color, fontSize: 22 }}>{item.category_icon || item.category_name[0]}</Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight={800}>{item.category_name}</Typography>
                            <Typography variant="caption" color="text.secondary">{item.category_id}</Typography>
                          </Box>
                        </Stack>
                        <Chip size="small" label={item.is_active ? 'Active' : 'Inactive'} color={item.is_active ? 'success' : 'default'} />
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, minHeight: 42 }}>{item.description || 'No description'}</Typography>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                        <Chip size="small" variant="outlined" label={`Order: ${item.order}`} />
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Edit"><IconButton onClick={() => { setEditingId(item.id); setCategoryForm({ category_id: item.category_id, category_name: item.category_name, category_icon: item.category_icon, category_color: item.category_color, description: item.description, is_active: item.is_active, order: item.order }); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><EditOutlined /></IconButton></Tooltip>
                          <Tooltip title="Delete"><IconButton color="error" onClick={() => setDeleteTarget({ type: 'categories', id: item.id, label: item.category_name })}><DeleteOutline /></IconButton></Tooltip>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {tab === 'sections' && (
            <Grid container spacing={2}>
              {filteredSections.map((item) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={item.id}>
                  <Card elevation={0} sx={{ height: '100%', borderRadius: 3, border: '1px solid #e2e8f0' }}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="h6" fontWeight={800}>{item.title}</Typography>
                          <Typography variant="caption" color="text.secondary">{item.section_key}</Typography>
                        </Box>
                        <Chip size="small" label={item.is_active ? 'Active' : 'Inactive'} color={item.is_active ? 'success' : 'default'} />
                      </Stack>
                      <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
                        <Chip size="small" label={`${item.products.length} products`} />
                        <Chip size="small" variant="outlined" label={`Order: ${item.order}`} />
                        {item.category_link_id && <Chip size="small" variant="outlined" label={`Link: ${item.category_link_id}`} />}
                      </Stack>
                      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                        <Tooltip title="Edit"><IconButton onClick={() => { setEditingId(item.id); setSectionForm({ title: item.title, section_key: item.section_key, category_link_id: item.category_link_id, is_active: item.is_active, order: item.order }); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><EditOutlined /></IconButton></Tooltip>
                        <Tooltip title="Delete section and its products"><IconButton color="error" onClick={() => setDeleteTarget({ type: 'sections', id: item.id, label: item.title })}><DeleteOutline /></IconButton></Tooltip>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {tab === 'products' && (
            <Grid container spacing={2}>
              {filteredProducts.map((item) => (
                <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={item.id}>
                  <Card elevation={0} sx={{ height: '100%', borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    {item.image_url ? <Box component="img" src={item.image_url} alt={item.name} sx={previewSx} /> : <Box sx={{ ...previewSx, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImageOutlined sx={{ fontSize: 54, color: '#cbd5e1' }} /></Box>}
                    <CardContent>
                      <Chip size="small" color="primary" variant="outlined" label={item.section_title} sx={{ mb: 1 }} />
                      <Typography variant="h6" fontWeight={800}>{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ minHeight: 42 }}>{item.description || 'No description'}</Typography>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                        <Chip size="small" variant="outlined" label={`Order: ${item.order}`} />
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Edit"><IconButton onClick={() => { setEditingId(item.id); setProductForm({ section: item.section, name: item.name, description: item.description, image_url: item.image_url, order: item.order }); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><EditOutlined /></IconButton></Tooltip>
                          <Tooltip title="Delete"><IconButton color="error" onClick={() => setDeleteTarget({ type: 'products', id: item.id, label: item.name })}><DeleteOutline /></IconButton></Tooltip>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {((tab === 'advertisements' && filteredAdvertisements.length === 0)
            || (tab === 'categories' && filteredCategories.length === 0)
            || (tab === 'sections' && filteredSections.length === 0)
            || (tab === 'products' && filteredProducts.length === 0)) && (
            <Paper elevation={0} sx={{ p: 6, borderRadius: 3, border: '1px dashed #cbd5e1', textAlign: 'center' }}>
              <HomeOutlined sx={{ fontSize: 52, color: '#cbd5e1' }} />
              <Typography variant="h6" fontWeight={800} sx={{ mt: 1 }}>No content found</Typography>
              <Typography variant="body2" color="text.secondary">Add new content or change the search text.</Typography>
              <Button variant="contained" startIcon={<Add />} sx={{ mt: 2 }} onClick={startAdd}>Add New</Button>
            </Paper>
          )}
        </>
      )}

      <Dialog open={Boolean(deleteTarget)} onClose={() => !saving && setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={800}>Delete Home Content?</DialogTitle>
        <DialogContent>
          <Typography>
            Delete <strong>{deleteTarget?.label}</strong>? This action cannot be undone.
            {deleteTarget?.type === 'sections' && ' All products inside this section will also be deleted.'}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} disabled={saving}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => void confirmDelete()} disabled={saving} startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <DeleteOutline />}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={notice.open} autoHideDuration={4000} onClose={() => setNotice({ ...notice, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={notice.severity} variant="filled" onClose={() => setNotice({ ...notice, open: false })}>{notice.message}</Alert>
      </Snackbar>
    </Box>
  );
}
