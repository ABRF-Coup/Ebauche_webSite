import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Importation de PropTypes

// Vérifie si l'utilisateur est authentifié
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('access_token'); // Vérifie si un token existe

  // Redirige vers la page de login si l'utilisateur n'est pas connecté
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si authentifié, rend le composant enfant
  return children;
};

// Déclaration des PropTypes
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // Vérifie que `children` est une prop valide et obligatoire
};

export default ProtectedRoute;
