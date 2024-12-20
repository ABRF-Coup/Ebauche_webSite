import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Container } from '@mui/system';
import { Card, CardContent, CardMedia, Typography,  CardActionArea } from '@mui/material';

const Products = (props) => {
  const { products } = props;

  if (!Array.isArray(products) || products.length === 0) {
    return <p>Can not find any products, sorry</p>;
  }

  return (
    <React.Fragment>
      <Container maxWidth="md" component="main">
        <Grid container spacing={8} >
          {products.map((product) => (
            <Grid item="true" key={product.id} >
              <Card>
                {/* CardActionArea pour rendre toute la carte cliquable */}
                <CardActionArea href={`product/${product.slug}`}>
                  {/* CardMedia avec une image du produit */}
                  <CardMedia
                    component="img"
                    height="300" // Ajuster la hauteur de l'image
                    image={product.image} // Sélectionne l'image du produit
                    alt={product.name} // Utilise le nom du produit pour l'alternative textuelle
                    sx={{
                      objectFit: 'cover', // Garantit que l'image couvre bien l'espace
                      
                      width: '100%', // Limite la largeur de l'image à celle de la carte
                       // Ajoute une largeur maximale à l'image
                    }} 
                  />
                  <CardContent >
                    {/* Titre du produit */}
                    <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                      {product.name.substr(0, 50)}...
                    </Typography>

                    {/* Affichage du prix et de la quantité */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                        Prix : {product.price}$
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </React.Fragment>
  );
};

// Ajout des validations des props
Products.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.oneOfType([
        PropTypes.number, // ID de catégorie
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
        }), // Objet catégorie
      ]).isRequired,
      price: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Products;
