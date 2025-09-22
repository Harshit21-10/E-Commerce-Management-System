'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Alert } from '@mui/material';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Divider,
  FormHelperText,
  InputAdornment
} from '@mui/material';
import { ArrowBack, CloudUpload, Delete } from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    product_image: null as string | null,  // Will store URL string or null
    product_image_file: null as File | null, // Store the actual File object
    productSizes: [] as string[],
    productColors: [] as string[],
    available: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Living',
    'Sports & Fitness',
    'Books',
  ];

  const availableSizes = [
    'XS',
    'S',
    'M',
    'L',
    'XL',
    'XXL',
    'One Size'
  ];

  const availableColors = [
    'Black',
    'White',
    'Red',
    'Blue',
    'Green',
    'Yellow',
    'Pink',
    'Purple',
    'Orange',
    'Gray',
    'Brown',
    'Beige',
    'Multi-color'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Product name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Valid stock quantity is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.product_image) newErrors.product_image = 'Product image is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string | string[]>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          product_image: 'Please upload a valid image file'
        }));
        return;
      }
      
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Store both the preview URL and the file object
      setFormData(prev => ({
        ...prev,
        product_image: previewUrl,  // URL for preview
        product_image_file: file    // File for upload
      }));
      
      // Clear any previous errors
      setErrors(prev => ({
        ...prev,
        product_image: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      // Add productOwnerId from localStorage
      const productOwnerId = localStorage.getItem('userId');
      if (productOwnerId) {
        formDataToSend.append('productOwnerId', productOwnerId);
      }
      
      // First, upload the image file if it exists
      if (formData.product_image_file) {
        const imageFile = formData.product_image_file;
        // Create a new FormData for the image upload
        const imageFormData = new FormData();
        imageFormData.append('file', imageFile);
        
        try {
          console.log('Sending image upload request...');
          let uploadResult;
          
          try {
            // Upload the image file
            const uploadResponse = await fetch('http://localhost:9090/api/products/upload', {
              method: 'POST',
              body: imageFormData,
              // Don't set Content-Type header, let the browser set it with the correct boundary
            });
            
            console.log('Upload response status:', uploadResponse.status);
            const responseText = await uploadResponse.text();
            console.log('Upload response text:', responseText);
            
            if (!uploadResponse.ok) {
              console.error('Upload error response:', responseText);
              throw new Error(`Failed to upload image: ${uploadResponse.status} ${uploadResponse.statusText}`);
            }
            
            try {
              uploadResult = JSON.parse(responseText);
              console.log('Parsed upload result:', uploadResult);
            } catch (e) {
              console.error('Error parsing upload response:', e);
              throw new Error('Invalid JSON response from server');
            }
            
            if (!uploadResult || !uploadResult.fileUrl) {
              console.error('Invalid upload result format:', uploadResult);
              throw new Error('Invalid response from server: Missing fileUrl');
            }
            
            console.log('Image uploaded successfully. URL:', uploadResult.fileUrl);
            
            // Add the image URL to the form data as 'images' parameter
            formDataToSend.append('images', uploadResult.fileUrl);
            
            // Clean up the preview URL
            if (formData.product_image && formData.product_image.startsWith('blob:')) {
              URL.revokeObjectURL(formData.product_image);
            }
          } catch (uploadError) {
            console.error('Error during image upload:', uploadError);
            throw uploadError; // Re-throw to be caught by the outer catch block
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          setErrors(prev => ({
            ...prev,
            form: 'Failed to upload image. Please try again.'
          }));
          setLoading(false);
          return;
        }
      } else if (typeof formData.product_image === 'string') {
        // If it's already a URL (for edit case)
        formDataToSend.append('imageUrl', formData.product_image);
      }
      
      // Add other form data
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'product_image') return; // Skip the image file as we already handled it
        if (Array.isArray(value)) {
          formDataToSend.append(key, value.join(','));
        } else if (value !== null && value !== undefined) {
          const valueToAppend = typeof value === 'boolean' ? String(value) : value;
          formDataToSend.append(key, valueToAppend);
        }
      });

      const response = await fetch('http://localhost:9090/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add product');
      }

      router.push('/retailer/products');
    } catch (error: any) {
      console.error('Error adding product:', error);
      setErrors(prev => ({
        ...prev,
        form: error.message || 'Failed to add product. Please try again.'
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton onClick={() => router.back()} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #00f5ff, #ff00ff)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Add New Product
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            background: 'rgba(26,26,26,0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 2,
          }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    sx: { borderRadius: 2, bgcolor: 'background.paper' },
                  }}
                />

                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  error={!!errors.description}
                  helperText={errors.description}
                  margin="normal"
                  multiline
                  rows={4}
                  variant="outlined"
                  InputProps={{
                    sx: { borderRadius: 2, bgcolor: 'background.paper' },
                  }}
                />

                <FormControl fullWidth margin="normal" error={!!errors.category}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleSelectChange}
                    label="Category"
                    sx={{ borderRadius: 2, bgcolor: 'background.paper' }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category && (
                    <FormHelperText>{errors.category}</FormHelperText>
                  )}
                </FormControl>

                <FormControl fullWidth margin="normal" error={!!errors.productSizes}>
                  <InputLabel>Available Sizes</InputLabel>
                  <Select
                    name="productSizes"
                    multiple
                    value={formData.productSizes}
                    onChange={handleSelectChange}
                    label="Available Sizes"
                    sx={{ borderRadius: 2, bgcolor: 'background.paper' }}
                    renderValue={(selected) => Array.isArray(selected) ? selected.join(', ') : selected}
                  >
                    {availableSizes.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.productSizes && (
                    <FormHelperText>{errors.productSizes}</FormHelperText>
                  )}
                </FormControl>

                <FormControl fullWidth margin="normal" error={!!errors.productColors}>
                  <InputLabel>Available Colors</InputLabel>
                  <Select
                    name="productColors"
                    multiple
                    value={formData.productColors}
                    onChange={handleSelectChange}
                    label="Available Colors"
                    sx={{ borderRadius: 2, bgcolor: 'background.paper' }}
                    renderValue={(selected) => Array.isArray(selected) ? selected.join(', ') : selected}
                  >
                    {availableColors.map((color) => (
                      <MenuItem key={color} value={color}>
                        {color}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.productColors && (
                    <FormHelperText>{errors.productColors}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Price ($)"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      error={!!errors.price}
                      helperText={errors.price}
                      margin="normal"
                      variant="outlined"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        sx: { borderRadius: 2, bgcolor: 'background.paper' },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Stock"
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleInputChange}
                      error={!!errors.stock}
                      helperText={errors.stock}
                      margin="normal"
                      variant="outlined"
                      InputProps={{
                        sx: { borderRadius: 2, bgcolor: 'background.paper' },
                      }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2, mb: 2 }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="product-image-upload"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="product-image-upload">
                    <Button
                      component="span"
                      variant="outlined"
                      color="primary"
                      startIcon={<CloudUpload />}
                      fullWidth
                      sx={{
                        py: 2,
                        borderRadius: 2,
                        borderStyle: 'dashed',
                        borderWidth: 2,
                        borderColor: 'primary.main',
                        '&:hover': {
                          borderColor: 'primary.dark',
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      Upload Product Image
                    </Button>
                  </label>
                  {errors.product_image && (
                    <FormHelperText error sx={{ ml: 2 }}>
                      {errors.product_image}
                    </FormHelperText>
                  )}
                  {formData.product_image && (
                    <Box sx={{ mt: 2, position: 'relative' }}>
                      <Card>
                        <CardMedia
                          component="img"
                          src={formData.product_image || ''}
                          alt="Product preview"
                          sx={{
                            maxHeight: 300,
                            objectFit: 'contain',
                            p: 1,
                            bgcolor: 'background.paper',
                            width: '100%',
                            height: 'auto'
                          }}
                        />
                        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                          <IconButton
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImagePreview(null);
                              setFormData(prev => ({ ...prev, product_image: '' }));
                            }}
                            sx={{ bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Card>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>

            {errors.form && (
              <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                {errors.form}
              </Alert>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => router.back()}
                disabled={loading}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #00f5ff, #ff00ff)',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  '&:hover': {
                    opacity: 0.9,
                  },
                }}
              >
                {loading ? 'Adding Product...' : 'Add Product'}
              </Button>
            </Box>
          </form>
        </Paper>
      </motion.div>
    </Container>
  );
}