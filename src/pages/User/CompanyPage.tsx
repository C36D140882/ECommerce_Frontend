import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowBack,
  BusinessOutlined,
  Close,
  EmailOutlined,
  LanguageOutlined,
  LocationOnOutlined,
  MapOutlined,
  PersonOutline,
  PhoneOutlined,
  Search,
  VisibilityOutlined,
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import { fetchCompanies, type Company } from '../../api/companyApi';

const logoFallback = (name: string) =>
  `https://placehold.co/160x160/f8fafc/1e3a8a.png?text=${encodeURIComponent(name.slice(0, 3).toUpperCase())}`;

const mapFallback = (name: string) =>
  `https://placehold.co/760x260/e2e8f0/475569.png?text=${encodeURIComponent(`${name} Location`)}`;

function MobileCompanyHeader(): React.ReactElement {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: { xs: 'flex', md: 'none' },
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1.5,
        bgcolor: '#fff',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <IconButton onClick={() => navigate('/home')} aria-label="Back to home">
        <ArrowBack />
      </IconButton>
      <BusinessOutlined sx={{ color: '#1d4ed8' }} />
      <Typography fontWeight={800} color="#0f172a">
        Company Management
      </Typography>
    </Box>
  );
}

function CompanyCard({
  company,
  onView,
}: {
  company: Company;
  onView: (company: Company) => void;
}): React.ReactElement {
  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid #e2e8f0',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 14px 30px rgba(15, 23, 42, 0.10)',
        },
      }}
    >
      <Stack direction="row" spacing={2.25} alignItems="center" sx={{ p: 2.25 }}>
        <Avatar
          src={company.logo_url || logoFallback(company.company_name)}
          alt={company.company_name}
          imgProps={{
            onError: (event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = logoFallback(company.company_name);
            },
          }}
          sx={{
            width: 88,
            height: 88,
            bgcolor: '#fff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
            '& img': { objectFit: 'contain', p: 0.75 },
          }}
        />

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            fontWeight={800}
            color="#0f172a"
            sx={{ mb: 0.8, fontSize: '1rem', lineHeight: 1.25 }}
          >
            {company.company_name}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.65 }}>
            <PersonOutline sx={{ fontSize: 19, color: '#0f172a' }} />
            <Typography variant="body2" color="#1e293b" noWrap>
              {company.contact_person}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <PhoneOutlined sx={{ fontSize: 19, color: '#0f172a' }} />
            <Typography variant="body2" color="#1e293b" noWrap>
              {company.phone_number}
            </Typography>
          </Stack>
        </Box>
      </Stack>

      <Box
        component="img"
        src={company.resolved_map_image_url || mapFallback(company.company_name)}
        alt={`${company.company_name} map`}
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = mapFallback(company.company_name);
        }}
        sx={{
          width: 'calc(100% - 24px)',
          height: 135,
          mx: 1.5,
          objectFit: 'cover',
          borderRadius: 1,
          border: '1px solid #e2e8f0',
          bgcolor: '#f8fafc',
        }}
      />

      <Button
        startIcon={<VisibilityOutlined />}
        onClick={() => onView(company)}
        sx={{
          mt: 1.2,
          py: 1.4,
          color: '#1d4ed8',
          fontWeight: 800,
          textTransform: 'none',
          borderRadius: 0,
        }}
      >
        View Details
      </Button>
    </Paper>
  );
}

export default function CompanyPage(): React.ReactElement {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  useEffect(() => {
    let active = true;

    const loadCompanies = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchCompanies();
        if (active) setCompanies(data);
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load companies.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadCompanies();
    return () => {
      active = false;
    };
  }, []);

  const filteredCompanies = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return companies;
    return companies.filter((company) =>
      [
        company.company_name,
        company.contact_person,
        company.phone_number,
        company.city,
        company.state,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [companies, search]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <MobileCompanyHeader />
      <Box sx={{ display: { xs: 'none', md: 'block' }, bgcolor: '#fff' }}>
        <Header />
      </Box>

      <Container maxWidth="xl" sx={{ flex: 1, py: { xs: 3, md: 4 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', md: 'flex-end' }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography
              component="h1"
              sx={{ fontSize: { xs: '1.55rem', md: '1.9rem' }, fontWeight: 900, color: '#0f172a' }}
            >
              Company Management
            </Typography>
          </Box>

          <TextField
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            size="small"
            placeholder="Search company..."
            sx={{ width: { xs: '100%', md: 320 }, bgcolor: '#fff' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ minHeight: 320, display: 'grid', placeItems: 'center' }}>
            <CircularProgress />
          </Box>
        ) : filteredCompanies.length === 0 ? (
          <Paper
            elevation={0}
            sx={{ p: 6, textAlign: 'center', border: '1px dashed #cbd5e1', bgcolor: '#fff' }}
          >
            <BusinessOutlined sx={{ fontSize: 52, color: '#94a3b8', mb: 1 }} />
            <Typography fontWeight={800} color="#334155">
              No companies found
            </Typography>
          </Paper>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                lg: 'repeat(3, minmax(0, 1fr))',
              },
              gap: 2.5,
            }}
          >
            {filteredCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} onView={setSelectedCompany} />
            ))}
          </Box>
        )}
      </Container>

      <Footer />

      <Dialog
        open={Boolean(selectedCompany)}
        onClose={() => setSelectedCompany(null)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
      >
        {selectedCompany && (
          <>
            <Box sx={{ p: 2.5, bgcolor: '#eff6ff', position: 'relative' }}>
              <IconButton
                onClick={() => setSelectedCompany(null)}
                sx={{ position: 'absolute', right: 10, top: 10 }}
              >
                <Close />
              </IconButton>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ pr: 5 }}>
                <Avatar
                  src={selectedCompany.logo_url || logoFallback(selectedCompany.company_name)}
                  sx={{ width: 76, height: 76, bgcolor: '#fff', border: '1px solid #dbeafe' }}
                  imgProps={{ style: { objectFit: 'contain', padding: 6 } }}
                />
                <Box>
                  <Typography variant="h6" fontWeight={900} color="#0f172a">
                    {selectedCompany.company_name}
                  </Typography>
                  <Typography variant="body2" color="#475569">
                    {selectedCompany.designation || 'Company Information'}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <DialogContent sx={{ p: 3 }}>
              <Stack spacing={1.7}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <PersonOutline color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Contact Person</Typography>
                    <Typography fontWeight={700}>{selectedCompany.contact_person}</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <PhoneOutlined color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Phone Number</Typography>
                    <Typography fontWeight={700}>{selectedCompany.phone_number}</Typography>
                    {selectedCompany.alternate_phone && (
                      <Typography variant="body2" color="text.secondary">
                        {selectedCompany.alternate_phone}
                      </Typography>
                    )}
                  </Box>
                </Stack>
                {selectedCompany.email && (
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <EmailOutlined color="primary" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Email</Typography>
                      <Typography fontWeight={700}>{selectedCompany.email}</Typography>
                    </Box>
                  </Stack>
                )}
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <LocationOnOutlined color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Address</Typography>
                    <Typography fontWeight={700}>
                      {[selectedCompany.address, selectedCompany.city, selectedCompany.state, selectedCompany.pincode]
                        .filter(Boolean)
                        .join(', ')}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>

              {selectedCompany.description && (
                <>
                  <Divider sx={{ my: 2.5 }} />
                  <Typography variant="body2" color="#475569">
                    {selectedCompany.description}
                  </Typography>
                </>
              )}

              <Box
                component="img"
                src={selectedCompany.resolved_map_image_url || mapFallback(selectedCompany.company_name)}
                alt={`${selectedCompany.company_name} map`}
                sx={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 2, mt: 2.5 }}
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 2.5 }}>
                {selectedCompany.map_url && (
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<MapOutlined />}
                    href={selectedCompany.map_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Map
                  </Button>
                )}
                {selectedCompany.website && (
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<LanguageOutlined />}
                    href={selectedCompany.website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Website
                  </Button>
                )}
              </Stack>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}
