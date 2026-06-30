import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingBagOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import {
  allCategories,
  getCategoryById,
  type Product,
} from '../../data/categories';
import Header from './Header';
import Footer from './Footer';

const PRIMARY_BLUE = '#0B4DE8';
const ORANGE = '#FF4B08';
const CARD_BORDER = '#E8EBF2';


interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps): React.ReactElement {
  const [quantityType, setQuantityType] = useState('Packet');
  const [quantity, setQuantity] = useState(3);
  const [imageFailed, setImageFailed] = useState(false);

  const imageSource = imageFailed
    ? `https://placehold.co/640x360/F7F8FC/475569?text=${encodeURIComponent(product.name)}`
    : product.imageUrl;

  return (
    <Box
      sx={{
        minWidth: 0,
        overflow: 'hidden',
        bgcolor: '#fff',
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: '10px',
        boxShadow: '0 3px 12px rgba(15, 23, 42, 0.08)',
        transition: 'transform 180ms ease, box-shadow 180ms ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 10px 26px rgba(15, 23, 42, 0.13)',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          height: { xs: 150, sm: 175, lg: 170, xl: 185 },
          overflow: 'hidden',
          bgcolor: '#FBF8F3',
          backgroundImage: `linear-gradient(rgba(255,255,255,.78), rgba(255,255,255,.78)), url("${imageSource}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box
          component="img"
          src={imageSource}
          alt={product.name}
          onError={() => setImageFailed(true)}
          sx={{
            position: 'relative',
            zIndex: 1,
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            p: { xs: 1, sm: 1.5 },
          }}
        />
      </Box>

      <Box sx={{ p: { xs: 1.35, sm: 1.55 } }}>
        <Typography
          component="h3"
          sx={{
            color: '#0F172A',
            fontSize: { xs: '0.88rem', sm: '0.94rem' },
            fontWeight: 800,
            lineHeight: 1.25,
            mb: 0.7,
            minHeight: { sm: 38 },
          }}
        >
          {product.name}
        </Typography>

        <Typography
          sx={{
            color: '#202939',
            fontSize: { xs: '0.75rem', sm: '0.79rem' },
            lineHeight: 1.45,
            minHeight: { sm: 46 },
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 1.05,
          }}
        >
          {product.description}
        </Typography>

        <Stack direction="row" spacing={1.5} sx={{ mb: 1.15 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.63rem', fontWeight: 800, color: '#111827', mb: 0.2 }}>
              Price Amount
            </Typography>
            <Typography sx={{ color: PRIMARY_BLUE, fontWeight: 900, fontSize: { xs: '1.15rem', sm: '1.28rem' }, lineHeight: 1 }}>
              ₹{product.price.toFixed(2)}
            </Typography>
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.63rem', fontWeight: 800, color: '#111827', mb: 0.2 }}>
              MRP Amount
            </Typography>
            <Typography sx={{ color: '#E11919', fontWeight: 900, fontSize: { xs: '1.15rem', sm: '1.28rem' }, lineHeight: 1 }}>
              ₹{product.mrp.toFixed(2)}
            </Typography>
          </Box>
        </Stack>

        <Select
          fullWidth
          size="small"
          value={quantityType}
          onChange={(event) => setQuantityType(event.target.value)}
          sx={{
            height: 38,
            mb: 0.75,
            bgcolor: '#fff',
            borderRadius: '7px',
            fontSize: '0.78rem',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#D9DEE8' },
          }}
        >
          <MenuItem value="Piece">Piece</MenuItem>
          <MenuItem value="Packet">Packet</MenuItem>
          <MenuItem value="Box">Box</MenuItem>
        </Select>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            height: 38,
            mb: 0.75,
            border: '1px solid #D9DEE8',
            borderRadius: '7px',
            overflow: 'hidden',
            bgcolor: '#fff',
          }}
        >
          <IconButton
            aria-label={`Decrease ${product.name} quantity`}
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            sx={{ width: 44, height: '100%', borderRadius: 0, color: '#0B0F19', fontSize: '1.05rem' }}
          >
            −
          </IconButton>
          <Typography sx={{ color: '#0B0F19', fontSize: '0.92rem', fontWeight: 900 }}>
            {quantity}
          </Typography>
          <IconButton
            aria-label={`Increase ${product.name} quantity`}
            onClick={() => setQuantity((current) => current + 1)}
            sx={{ width: 44, height: '100%', borderRadius: 0, color: '#0B0F19', fontSize: '1.05rem' }}
          >
            +
          </IconButton>
        </Stack>

        <Button
          fullWidth
          variant="contained"
          startIcon={<ShoppingBagOutlined sx={{ fontSize: '1rem !important' }} />}
          sx={{
            height: 38,
            borderRadius: '6px',
            bgcolor: ORANGE,
            color: '#fff',
            boxShadow: 'none',
            fontWeight: 800,
            fontSize: '0.79rem',
            textTransform: 'none',
            '&:hover': { bgcolor: '#E94100', boxShadow: 'none' },
          }}
        >
          Order Now
        </Button>
      </Box>
    </Box>
  );
}

export default function CategoryPage(): React.ReactElement {
  const { categoryId } = useParams<{ categoryId?: string }>();
  const selectedCategoryId = categoryId && getCategoryById(categoryId)
    ? categoryId
    : 'all';

  const products = useMemo(() => (
    selectedCategoryId === 'all'
      ? allCategories.flatMap((category) => category.products)
      : getCategoryById(selectedCategoryId)?.products ?? []
  ), [selectedCategoryId]);

  const pageTitle = selectedCategoryId === 'all'
    ? 'All Products'
    : getCategoryById(selectedCategoryId)?.categoryName ?? 'All Products';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#fff',
      }}
    >
      {/* Shared header component only — no category-page top row */}
      <Header />

      <Container
        component="main"
        maxWidth="xl"
        sx={{
          flex: 1,
          px: { xs: 1.5, sm: 2.5, lg: 3 },
          pt: { xs: 0.5, md: 1 },
          pb: { xs: 4, md: 5 },
        }}
      >
        <Typography
          component="h1"
          sx={{
            color: '#101828',
            fontSize: { xs: '1.25rem', md: '1.45rem' },
            fontWeight: 900,
            lineHeight: 1.2,
            mb: 1.6,
          }}
        >
          {pageTitle}
        </Typography>

        {products.length > 0 ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                md: 'repeat(3, minmax(0, 1fr))',
                lg: 'repeat(4, minmax(0, 1fr))',
              },
              gap: { xs: 1.4, sm: 1.6, lg: 1.8 },
            }}
          >
            {products.map((product) => (
              <ProductCard key={`${selectedCategoryId}-${product.id}`} product={product} />
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              py: 10,
              px: 2,
              textAlign: 'center',
              border: `1px dashed ${CARD_BORDER}`,
              borderRadius: 2,
              bgcolor: '#FAFBFD',
            }}
          >
            <Typography sx={{ color: '#111827', fontSize: '1rem', fontWeight: 800 }}>
              No products found
            </Typography>
            <Typography sx={{ mt: 0.5, color: '#667085', fontSize: '0.83rem' }}>
              Select another category to view its products.
            </Typography>
          </Box>
        )}
      </Container>

      {/* Shared footer component only — no category-page bottom instruction row */}
      <Footer />
    </Box>
  );
}
