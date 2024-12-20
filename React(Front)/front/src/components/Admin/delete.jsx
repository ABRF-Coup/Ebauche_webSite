import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../axios'; // Assurez-vous que votre instance axios est correctement configurée
import { Button, Container, Box, Typography, CssBaseline } from '@mui/material';

const DeletePost = () => {
  const navigate = useNavigate(); // Utilisation de useNavigate de React Router v6
  const { id } = useParams();

  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.delete(`products/admin/delete/${id}/`);
      navigate('/admin'); // Naviguer vers la page admin après suppression
    } catch (error) {
      console.error('Error deleting post:', error.response?.data || error.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          mt: 8,
        }}
      >
        <Typography variant="h5" align="center" color="textPrimary" gutterBottom>
          Are you sure you want to delete this post?
        </Typography>

        <Button
          variant="contained"
          color="error" // Utilisation d'une couleur d'erreur plus percutante
          onClick={handleDelete}
          sx={{
            width: '100%',
            padding: '14px',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#d32f2f', // Change color on hover for more interactivity
            },
          }}
        >
          Confirm Delete
        </Button>
      </Box>
    </Container>
  );
};

export default DeletePost;
