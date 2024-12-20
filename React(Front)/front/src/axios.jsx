import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000/api/';

// Créez une instance d'axios avec des paramètres de base
const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

let refreshInProgress = false; // Variable pour éviter plusieurs rafraîchissements concurrents

// Fonction pour vérifier si le token est sur le point d'expirer
const isTokenExpiring = (token) => {
  const tokenParts = JSON.parse(atob(token.split('.')[1]));
  const now = Math.ceil(Date.now() / 1000); // Obtenez l'heure actuelle en secondes
  const timeRemaining = tokenParts.exp - now;
  return timeRemaining < 2 * 60; // Si le token expire dans moins de 2 minutes
};

// Fonction pour rafraîchir le token
const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    window.location.href = '/login/'; // Rediriger si aucun token de rafraîchissement
    return Promise.reject(new Error('No refresh token available'));
  }

  try {
    const response = await axios.post(`${baseURL}token/refresh/`, { refresh: refreshToken });
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);

    axiosInstance.defaults.headers['Authorization'] = 'JWT ' + response.data.access;
    return response.data.access;
  } catch (err) {
    console.error('Error refreshing token:', err);
    window.location.href = '/login/';
    return Promise.reject(err);
  }
};

// Intercepteur de requête : Ajoutez le token si disponible
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('access_token');

    if (accessToken && isTokenExpiring(accessToken) && !refreshInProgress) {
      console.log('Token is about to expire, refreshing...');
      refreshInProgress = true;

      try {
        const newAccessToken = await refreshToken();
        config.headers['Authorization'] = 'JWT ' + newAccessToken;
      } catch (err) {
        console.error('Failed to refresh token', err);
      } finally {
        refreshInProgress = false;
      }
    } else if (accessToken) {
      config.headers['Authorization'] = 'JWT ' + accessToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse : Gestion des erreurs de token expiré
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      error.response.data.code === 'token_not_valid' &&
      !originalRequest._retry &&
      originalRequest.url !== `${baseURL}token/refresh/`
    ) {
      originalRequest._retry = true;
      try {
        await refreshToken();
        return axiosInstance(originalRequest); // Reessayer la requête originale
      } catch (err) {
        window.location.href = '/login/';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// Rafraîchissement automatique à intervalles réguliers
setInterval(() => {
  const accessToken = localStorage.getItem('access_token');
  if (accessToken && isTokenExpiring(accessToken)) {
    console.log('Token is about to expire, refreshing...');
    refreshToken();
  }
}, 30 * 1000); // Vérifier toutes les 30 secondes

export default axiosInstance;
