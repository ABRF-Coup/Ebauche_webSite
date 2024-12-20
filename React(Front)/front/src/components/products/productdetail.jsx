import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../axios.jsx';
import {
  CssBaseline,
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  Divider,
} from '@mui/material';

function ProductDetail() {
  const { slug } = useParams();
  const [data, setData] = useState({
    product: {
      name: '',
      price: 0,
      qte_stock: 0,
      category: null, // Peut être null ou un objet
      description: '',
      image: '',
      author: null, // Peut être null ou un objet
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`products/product/${slug}`)
      .then((res) => {
        setData({ product: res.data });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur lors du chargement du produit:', err.response?.data || err.message);
        setError('Impossible de charger les détails du produit.');
        setLoading(false);
      });
  }, [slug]);


  const handleAddToCart = async () => {
    try {
      const response = await axiosInstance.post('cart/add/', {
        product_id: product.id, // ID du produit
        quantity: 1, // Quantité à ajouter, ici 1
      });

      // Succesful response, rediriger vers la page du panier
      if (response.status === 200) {
        console.log('Produit ajouté au panier avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error.response?.data || error.message);
      alert('Impossible d\'ajouter le produit au panier.');
    }
  };

  const product = data.product;
  

  if (loading) {
    return (
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Typography variant="h5" align="center" sx={{ marginTop: 4 }}>
          Chargement des détails du produit...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Typography variant="h5" align="center" color="error" sx={{ marginTop: 4 }}>
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <Box sx={{ marginTop: 4 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Box
                component="img"
                src={product.image || '/placeholder-image.png'}
                alt={product.name || 'Image du produit'}
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 2,
                  objectFit: 'contain',
                }}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                {product.name || 'Nom du produit indisponible'}
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                {product.category?.name || 'Catégorie inconnue'}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                ${product.price ? product.price.toFixed(2) : 'Prix indisponible'}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Sold by <strong>{product.author?.user_name || 'Utilisateur inconnu'}</strong>
              </Typography>
              <Typography
                variant="body2"
                color={product.qte_stock > 0 ? 'success.main' : 'error.main'}
              >
                {product.qte_stock > 0
                  ? `En stock (${product.qte_stock} disponibles)`
                  : 'Rupture de stock'}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" paragraph>
                {product.description || 'Aucune description disponible pour ce produit.'}
              </Typography>
              <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={product.qte_stock === 0}
                  onClick={handleAddToCart}
                >
                  Ajouter au panier
                </Button>
                
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
}

export default ProductDetail;
