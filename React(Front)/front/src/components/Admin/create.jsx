import { useState, useEffect } from 'react';
import axiosInstance from '../../axios';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Typography,
  Container,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

export default function Create() {
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

  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const userProfileResponse = await axiosInstance.get('/user/profile/');
        setUserId(userProfileResponse.data.id);

        const categoriesResponse = await axiosInstance.get('products/categories/');
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCategories();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
    price: '',
    qte_stock: '',
    description: '',
  });
  const [postImage, setPostImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'image') {
      const file = e.target.files[0];
      setPostImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === 'name' && { slug: slugify(value) }),
      }));
    }
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !userId) {
      console.error('Tous les champs obligatoires ne sont pas remplis.');
      return;
    }

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('slug', formData.slug);
      data.append('author', userId);
      data.append('price', formData.price);
      data.append('description', formData.description);
      data.append('qte_stock', formData.qte_stock);
      data.append('category', formData.category);
      if (postImage) {
        data.append('image', postImage);
      }

      await axiosInstance.post(`products/admin/create/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/admin/');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <AddCircleOutlineIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create New Product
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mt: 3,
            width: '100%',
          }}
        >
          <Grid container spacing={2}>
            {/* Product Name */}
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Product Name"
                name="name"
                autoComplete="name"
                onChange={handleChange}
              />
            </Grid>

            {/* Category */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="category-label">Product Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  displayEmpty
                >
                  {categories.length === 0 && (
                    <MenuItem value="" disabled>
                      No categories available
                    </MenuItem>
                  )}
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Price */}
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="price"
                label="Product Price"
                name="price"
                type="number"
                inputProps={{
                  step: '0.01',
                  min: '1',
                }}
                onChange={handleChange}
              />
            </Grid>

            {/* Quantity */}
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="qte_stock"
                label="Product Quantity"
                name="qte_stock"
                type="number"
                inputProps={{
                  step: '1',
                  min: '1',
                }}
                onChange={handleChange}
              />
            </Grid>

            {/* Slug */}
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="slug"
                label="Slug"
                name="slug"
                value={formData.slug}
                disabled
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="description"
                label="Description"
                name="description"
                multiline
                rows={4}
                onChange={handleChange}
              />
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12}>
              <Box display="flex" flexDirection="column" alignItems="center">
                {imagePreview && (
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Preview"
                    sx={{
                      width: '100%',
                      maxWidth: '200px',
                      maxHeight: '200px',
                      objectFit: 'cover',
                      mb: 2,
                      borderRadius: 1,
                    }}
                  />
                )}
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<PhotoCamera />}
                >
                  Upload Image
                  <input
                    accept="image/*"
                    type="file"
                    id="post-image"
                    name="image"
                    hidden
                    onChange={handleChange}
                  />
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Create Product
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
