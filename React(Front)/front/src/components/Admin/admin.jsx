import { useEffect, useState } from 'react';
import axiosInstance from '../../axios.jsx';
import Products from './products.jsx';
import ProductLoadingComponent from '../products/productLoadingComponent.jsx';
import { Button} from '@mui/material';
import { Link } from 'react-router-dom';

function Admin() {
  const ProductLoading = ProductLoadingComponent(Products);
  const [appState, setAppState] = useState({
    loading: true,
    products: [],
    userId: null,
  });

  useEffect(() => {
    // Récupération des informations de l'utilisateur
    axiosInstance.get('user/profile/')
      .then((res) => {
        setAppState((prevState) => ({
          ...prevState,
          userId: res.data.id,
        }));

        // Récupérer les produits de l'utilisateur
        axiosInstance.get(`products/user/?author=${res.data.id}`)
          .then((res) => {
            setAppState({
              loading: false,
              products: res.data,
            });
          })
          .catch((err) => console.error('Erreur lors de la récupération des produits :', err));
      })
      .catch((err) => console.error('Erreur lors de la récupération de l\'utilisateur :', err));
  }, [setAppState]);

  return (
    <div className="App">
      <h1 className="main_title">Mes produits</h1>
      
      {/* Affichage conditionnel du bouton "New Product" */}
      {appState.products.length === 0 && (
        <Button
          component={Link}
          to="/admin/create"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Nouveau Produit
        </Button>
      )}

      <ProductLoading isLoading={appState.loading} products={appState.products} />
    </div>
  );
}

export default Admin;
