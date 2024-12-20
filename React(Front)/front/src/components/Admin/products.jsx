import PropTypes from 'prop-types';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';

const Products = ({ products }) => {
  if (!products || products.length === 0)
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <p>No products found.</p>
      </Container>
    );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            {/* Table Header */}
            <TableHead>
              <TableRow>
                <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                  Category
                </TableCell>
                <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                  Name
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell align="left">
                    {product.category?.name || 'N/A'}
                  </TableCell>
                  <TableCell align="left">
                    <Link
                      to={`/product/${product.slug}`}
                      style={{
                        textDecoration: 'none',
                        color: '#1976d2',
                        fontWeight: 'bold',
                      }}
                    >
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell align="center">
                    {/* Action Buttons */}
                    <IconButton
                      component={Link}
                      to={`/admin/edit/${product.id}`}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      component={Link}
                      to={`/admin/delete/${product.id}`}
                      color="error"
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} align="right">
                  {/* New Product Button */}
                  <Button
                    component={Link}
                    to="/admin/create"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                  >
                    New Product
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

// Ajouter les propTypes pour valider les props attendues
Products.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired, // Chaque post doit avoir un `id` de type number
      category: PropTypes.oneOfType([
        PropTypes.number, // ID de catégorie
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
        }), // Objet catégorie
      ]).isRequired,
      slug: PropTypes.string.isRequired, // Chaque post doit avoir un champ `slug` de type string
      name: PropTypes.string.isRequired, // Chaque post doit avoir un champ `name` de type string
    })
  ).isRequired, // La prop `products` est un tableau obligatoire
};

export default Products;
