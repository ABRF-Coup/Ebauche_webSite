import { useState, useEffect } from 'react';
import axiosInstance from '../../axios.jsx';
import { Card, CardContent, CardMedia, Grid, Typography, Container, Box, CardActionArea } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

const Search = () => {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams(); // Hook pour accéder aux paramètres d'URL

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = searchParams.get('query'); // Récupère uniquement la valeur de 'query'
        const response = await axiosInstance.get(`/products/search/?search=${query}`); // Corrigez ici
        setProducts(response.data); // Met à jour les produits avec la réponse API
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchProducts();
  }, [searchParams]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        {products.length > 0 ? (
          products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}> {/* Ajusté à 'md={4}' pour un meilleur affichage */}
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 3, maxWidth: '300px', width: '100%' }}>
                {/* CardActionArea pour rendre toute la carte cliquable */}
                <CardActionArea href={`product/${product.slug}`}>
                  {/* CardMedia avec une image du produit */}
                  <CardMedia
                    component="img"
                    height="200" // Ajuster la hauteur de l'image
                    image={product.image} // Sélectionne l'image du produit
                    alt={product.name} // Utilise le nom du produit pour l'alternative textuelle
                    sx={{
                      objectFit: 'cover', // Garantit que l'image couvre bien l'espace
                      borderTopLeftRadius: 3,
                      borderTopRightRadius: 3,
                      width: '100%', // Limite la largeur de l'image à celle de la carte
                      maxWidth: '300px', // Ajoute une largeur maximale à l'image
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, padding: 2 }}>
                    {/* Titre du produit */}
                    <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                      {product.name.length > 50 ? `${product.name.substr(0, 50)}...` : product.name}
                    </Typography>

                    {/* Affichage du prix */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                        Prix : {product.price}$
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))
        ) : (
          <Box sx={{ textAlign: 'center', width: '100%', mt: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Aucun produit trouvé
            </Typography>
          </Box>
        )}
      </Grid>
    </Container>
  );
};

export default Search;
