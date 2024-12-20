import { useState, useEffect } from 'react';
import axiosInstance from '../../axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  TextField,
  Typography,
  Grid,
  CssBaseline,
  Button,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const slugify = (string) => {
    const a =
      'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
    const b =
      'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
    const p = new RegExp(a.split('').join('|'), 'g');

    return string
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(p, (c) => b.charAt(a.indexOf(c)))
      .replace(/&/g, '-and-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    qte_stock: '',
    description: '',
    image: null,
    category: '',
    image_url: '',
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`products/admin/edit/productdetail/${id}`);
        setFormData({
          name: res.data.name,
          slug: res.data.slug,
          price: res.data.price,
          qte_stock: res.data.qte_stock,
          description: res.data.description,
          image: null,
          image_url: res.data.image,
          category: res.data.category,
          author: res.data.author,
        });
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const categoriesRes = await axiosInstance.get('products/categories/');
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchProduct();
    fetchCategories();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'name' && { slug: slugify(value) }),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      image: file,
      image_url: file ? URL.createObjectURL(file) : prev.image_url,
    }));
  };

  const handleCategoryChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      category: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    data.append('name', formData.name);
    data.append('slug', formData.slug);
    data.append('price', Number(formData.price));
    data.append('qte_stock', Number(formData.qte_stock));
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('author', formData.author);

    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      await axiosInstance.put(`products/admin/edit/${id}/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/admin/');
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 8 }}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Edit Product
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: '100%', mt: 2 }}
          noValidate
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Product Name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="slug"
                label="Slug"
                value={formData.slug}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="price"
                label="Product Price"
                value={formData.price}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="qte_stock"
                label="Product Quantity"
                value={formData.qte_stock}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Product Description"
                value={formData.description}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="category-label">Product Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={formData.category || ''}
                  onChange={handleCategoryChange}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              {formData.image_url && (
                <img
                  src={formData.image_url}
                  alt="Current Product"
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '10px',
                    marginBottom: '10px',
                  }}
                />
              )}
              <label htmlFor="upload-image">
                <input
                  accept="image/*"
                  id="upload-image"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<PhotoCamera />}
                >
                  Upload Image
                </Button>
              </label>
            </Grid>
            
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Update Product
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default EditProduct;
