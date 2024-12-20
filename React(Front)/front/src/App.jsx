import './App.css';
import Products from './components/products/products.jsx';
import ProductLoadingComponent from './components/products/productLoadingComponent.jsx';
import { useEffect, useState } from 'react';
import axiosInstance from './axios.jsx';

const baseURL = 'http://127.0.0.1:8000/api/products/';

function App() {
  const ProductLoading = ProductLoadingComponent(Products);
  const [appState, setAppState] = useState({
    loading: true,
    products: null,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(`${baseURL}`); 
        setAppState({ loading: false, products: response.data });
      
       
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        setAppState({ loading: false, products: [] });
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="App">
      <h1 className="main_title">Produits Récents</h1>
      <ProductLoading isLoading={appState.loading} products={appState.products} />
    </div>
  );
}

export default App;
