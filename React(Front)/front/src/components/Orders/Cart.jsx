import { useEffect, useState } from 'react';
import axiosInstance from '../../axios.jsx';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Divider,
  TextField,
  Grid,
  Alert,
} from '@mui/material';

function Cart() {
  const [cart, setCart] = useState({
    items: [],
    total_price: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger le panier
  useEffect(() => {
    axiosInstance
      .get('cart/')
      .then((response) => {
        setCart(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError('Impossible de charger le panier.');
        setLoading(false);
      });
  }, []);

  // Supprimer un produit
  const handleRemoveItem = (cartItemId) => {
    axiosInstance
      .delete(`cart/remove/?cart_item_id=${cartItemId}`)
      .then(() => {
        setCart((prevCart) => {
          const updatedItems = prevCart.items.filter((item) => item.id !== cartItemId);
          const newTotalPrice = updatedItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
          return { ...prevCart, items: updatedItems, total_price: newTotalPrice };
        });
      })
      .catch(() => {
        setError('Erreur lors de la suppression du produit du panier.');
      });
  };
  

  // Mettre à jour la quantité d'un produit
  const handleUpdateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) {
      setError('La quantité doit être au moins égale à 1.');
      return;
    }
  
    const item = cart.items.find((item) => item.id === cartItemId);
    if (item && newQuantity > item.product.qte_stock) {
      setError(`Stock insuffisant pour ${item.product.name}. Stock disponible : ${item.product.qte_stock}.`);
      return;
    }
  
    axiosInstance
      .put('cart/update/', { cart_item_id: cartItemId, quantity: newQuantity })
      .then(() => {
        setCart((prevCart) => {
          const updatedItems = prevCart.items.map((item) =>
            item.id === cartItemId ? { ...item, quantity: newQuantity } : item
          );
          const newTotalPrice = updatedItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
          return { ...prevCart, items: updatedItems, total_price: newTotalPrice };
        });
      })
      .catch(() => {
        setError('Erreur lors de la mise à jour de la quantité.');
      });
  };
  

  // Passer la commande
  const handleCheckout = () => {
    axiosInstance
      .post('cart/orders/', {
        items: cart.items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      })
      .then((response) => {
        console.log(response.data);
        setCart({ items: [], total_price: 0 }); // Réinitialiser le panier après commande réussie
        alert('Commande réussie !');
      })
      .catch((error) => {
        if (error.response && error.response.data.error) {
          setError(error.response.data.error); // Affiche une erreur spécifique
        } else {
          setError('Erreur lors du passage de la commande.');
        }
      });
  };

  if (loading) {
    return (
      <Container component="main" maxWidth="md">
        <Typography variant="h5" align="center" sx={{ marginTop: 4 }}>
          Chargement du panier...
        </Typography>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="lg">
      <Typography variant="h4" sx={{ marginTop: 3}}>
        Mon Panier
      </Typography>
      <Divider sx={{ my: 2 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {cart.items.length === 0 ? (
        <Typography variant="h6" align="center" color="textSecondary">
          Votre panier est vide
        </Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {cart.items.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.product.image || '/placeholder-image.png'}
                    alt={item.product.name}
                  />
                  <CardContent>
                    <Typography variant="h6">{item.product.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {item.product.description}
                    </Typography>
                    <Typography variant="body1">
                      Prix unitaire: ${item.product.price.toFixed(2)}
                    </Typography>
                    <Typography variant="body1">Quantité: {item.quantity}</Typography>
                  </CardContent>
                  <CardActions>
                    <TextField
                      type="number"
                      size="small"
                      defaultValue={item.quantity}
                      onChange={(e) =>
                        handleUpdateQuantity(item.id, parseInt(e.target.value, 10))
                      }
                    />
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Supprimer
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 4 }} />
          <Typography variant="h5" align="right">
            Total: ${cart.total_price.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            color="success"
            fullWidth
            size="large"
            onClick={handleCheckout}
            sx={{ mt: 3 }}
          >
            Commander
          </Button>
        </>
      )}
    </Container>
  );
}

export default Cart;
