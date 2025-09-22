'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Paper,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  productImageBase64: string;
  category: string;
  approved: boolean;
  available: boolean;
  productSizes: string[];
  productColors: string[];
}

export default function RetailerProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = [
    'all',
    'Electronics',
    'Fashion',
    'Home & Living',
    'Sports & Fitness',
    'Books',
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        console.log('Fetching products for user ID:', userId);
        const response = await fetch(`http://localhost:9090/api/products/owner/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server response:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText
          });
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Log the complete response for debugging
        console.log('=== API Response ===');
        console.log(JSON.stringify(data, null, 2));
        
        // Log detailed info about each product's image
        if (data && Array.isArray(data)) {
          console.log('=== Product Images Debug ===');
          data.forEach((product: any, index: number) => {
            console.log(`Product ${index + 1} (ID: ${product.id}):`);
            console.log('Name:', product.name);
            
            // Check all possible image fields
            const imageFields = ['productImage', 'productImageBase64', 'image', 'img'];
            let foundImage = false;
            
            for (const field of imageFields) {
              if (product[field]) {
                console.log(`Found image in field: ${field}`);
                console.log('Image type:', typeof product[field]);
                console.log('Value starts with:', product[field].substring(0, 30) + '...');
                console.log('Full length:', product[field].length);
                foundImage = true;
              }
            }
            
            if (!foundImage) {
              console.log('No image data found in any known field');
              console.log('Available fields:', Object.keys(product));
            }
            
            console.log('---');
          });
        }

        // Map the response data to match our Product interface
        const mappedProducts = data.map((product: any) => {
          // Format the image URL properly
          let imageUrl = '';
          
          // Check all possible image fields in order of priority
          const imageData = 
            product.imageUrl || 
            product.productImage || 
            product.productImageBase64 ||
            product.image ||
            product.img;
          
          console.log(`Processing product: ${product.name || product.id}`);
          console.log('Raw image data:', imageData ? `${imageData.substring(0, 50)}...` : 'No image data');
          
          if (imageData) {
            try {
              // If it's already a data URL, use it as is
              if (typeof imageData === 'string' && imageData.startsWith('data:')) {
                imageUrl = imageData;
                console.log('Using existing data URL');
              } 
              // If it's a base64 string without data URL prefix
              else if (typeof imageData === 'string' && !imageData.startsWith('http')) {
                // Check if it's a valid base64 string
                if (/^[A-Za-z0-9+/=]+$/.test(imageData)) {
                  // Try to determine image type from common signatures
                  let imageType = 'jpeg'; // default
                  if (imageData.startsWith('/9j/')) {
                    imageType = 'jpeg';
                  } else if (imageData.startsWith('iVBOR')) {
                    imageType = 'png';
                  } else if (imageData.startsWith('R0lGOD')) {
                    imageType = 'gif';
                  } else if (imageData.startsWith('UklGR')) {
                    imageType = 'webp';
                  }
                  imageUrl = `data:image/${imageType};base64,${imageData}`;
                  console.log(`Converted to data URL with type: ${imageType}`);
                } else {
                  console.log('Image data is not a valid base64 string');
                }
              } 
              // It's a regular URL
              else if (typeof imageData === 'string' && imageData.startsWith('http')) {
                imageUrl = imageData;
                console.log('Using HTTP URL');
              }
            } catch (error) {
              console.error('Error processing image data:', error);
            }
          }
          
          if (!imageUrl) {
            // Use a placeholder if no valid image is available
            imageUrl = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWpkc3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLWRhc2hhcnJheTo1LDU7c3Ryb2tlLXdpZHRoOjI7IgogICAgICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgICAgIHN0eWxlPSJ3aGl0ZS1zcGFjZTpwcmU7d29yZC13cmFwOmJyZWFrLXdvcmQ7IiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICAgPHQgc3R5bGU9ImZvbnQtc2l6ZTo0MnB4O2ZvbnQtZmFtaWx5OkFyaWFsO2ZpbGw6IzY2NjY2NjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTsiIHRleExlbmd0aD0iMjE2Ij5ObyBJbWFnZTwvdD4KICAgPC90ZXh0Pjwvc3ZnPg==';
            console.log('Using placeholder image');
          }
          
          console.log('Final image URL:', imageUrl.substring(0, 50) + '...');

          return {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            productImageBase64: imageUrl,
            category: product.category,
            approved: product.approved,
            available: product.available,
            productSizes: product.productSizes || [],
            productColors: product.productColors || [],
          };
        });
        
        console.log('Mapped products:', mappedProducts);
        setProducts(mappedProducts);
      } catch (err: any) {
        console.error('Error details:', err);
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(products.filter(p => p.id !== productId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'approved' && product.approved) ||
      (statusFilter === 'pending' && !product.approved);
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesStatus && matchesCategory;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
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
            My Products
          </Typography>
          <Button
            component={Link}
            href="/retailer/products/add"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              background: 'linear-gradient(45deg, #00f5ff, #ff00ff)',
              color: 'black',
              fontWeight: 'bold',
              '&:hover': {
                opacity: 0.9,
              },
            }}
          >
            Add New Product
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            background: 'rgba(26,26,26,0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status Filter"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Category Filter</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="Category Filter"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : filteredProducts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No products found
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'rgba(26,26,26,0.8)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        pt: '100%', // Makes it square (1:1 aspect ratio)
                        position: 'relative',
                        backgroundColor: '#f5f5f5',
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%', 
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {(() => {
                          // Get the image source
                          let imageSrc = product.productImageBase64 || '';
                          
                          // If we have image data
                          if (imageSrc) {
                            // If it's already a data URL or http URL, use it as is
                            if (imageSrc.startsWith('data:image/') || imageSrc.startsWith('http')) {
                              // No transformation needed
                            } 
                            // If it's a base64 string without data URL prefix
                            else if (typeof imageSrc === 'string' && imageSrc.length > 0) {
                              // Check for common image signatures
                              if (imageSrc.match(/^[A-Za-z0-9+/=]+$/)) {
                                // It's likely a base64 string
                                let imageType = 'jpeg'; // default
                                if (imageSrc.startsWith('/9j/') || imageSrc.startsWith('/9j/')) {
                                  imageType = 'jpeg';
                                } else if (imageSrc.startsWith('iVBOR')) {
                                  imageType = 'png';
                                } else if (imageSrc.startsWith('R0lGOD')) {
                                  imageType = 'gif';
                                } else if (imageSrc.startsWith('UklGR')) {
                                  imageType = 'webp';
                                }
                                imageSrc = `data:image/${imageType};base64,${imageSrc}`;
                              }
                            }
                          }
                          
                          // Debug logging (commented out for production)
                          // console.log(`Rendering image for product ${product.id}:`, {
                          //   hasImage: !!imageSrc,
                          //   type: typeof imageSrc,
                          //   startsWithData: imageSrc?.startsWith?.('data:'),
                          //   startsWithHttp: imageSrc?.startsWith?.('http'),
                          //   length: imageSrc?.length,
                          //   preview: imageSrc?.substring(0, 50) + '...'
                          // });
                          
                          if (!imageSrc) {
                            return (
                              <div style={{ 
                                width: '100%', 
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f5f5f5',
                                color: '#666',
                                padding: '1rem',
                                textAlign: 'center'
                              }}>
                                <div>No Image Available</div>
                                <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                                  Product ID: {product.id}
                                </div>
                              </div>
                            );
                          }
                          
                          try {
                            return (
                              <>
                                <div style={{ 
                                  width: '100%', 
                                  height: '200px', 
                                  position: 'relative',
                                  backgroundColor: '#f5f5f5',
                                  borderRadius: '8px',
                                  overflow: 'hidden'
                                }}>
                                  <Image
                                    src={product.productImageBase64 || '/placeholder-product.png'}
                                    alt={product.name || 'Product image'}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    style={{ 
                                      objectFit: 'contain',
                                      padding: '10px',
                                    }}
                                    onError={(e) => {
                                      console.error('Image load error for product:', product.id, product.name);
                                      console.error('Image source:', product.productImageBase64 ? 'Base64 data' : 'No image data');
                                      const target = e.target as HTMLImageElement;
                                      target.onerror = null; // Prevent infinite loop
                                      target.src = '/placeholder-product.png';
                                    }}
                                    onLoad={() => console.log('Image loaded successfully for product:', product.id)}
                                  />
                                  {!product.productImageBase64 && (
                                    <div style={{
                                      position: 'absolute',
                                      top: '50%',
                                      left: '50%',
                                      transform: 'translate(-50%, -50%)',
                                      color: '#999',
                                      textAlign: 'center',
                                      width: '100%',
                                      padding: '0 10px'
                                    }}>
                                      No Image Available
                                    </div>
                                  )}
                                </div>
                                <div style={{
                                  display: 'none',
                                  width: '100%',
                                  height: '200px',
                                  backgroundColor: '#f5f5f5',
                                  color: '#666',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  textAlign: 'center',
                                  padding: '1rem'
                                }}>
                                  Failed to load image
                                </div>
                              </>
                            );
                          } catch (error) {
                            console.error('Error rendering image:', error);
                            return (
                              <div style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#f5f5f5',
                                color: '#666',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                padding: '1rem'
                              }}>
                                Error loading image
                              </div>
                            );
                          }
                        })()}
                      </div>
                    </CardMedia>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="h2">
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {product.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" component="span">
                          ${product.price}
                        </Typography>
                        <Chip
                          label={product.approved ? 'Approved' : 'Pending'}
                          color={product.approved ? 'success' : 'warning'}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Stock: {product.stock}
                      </Typography>
                      <Chip
                        label={product.category}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        component={Link}
                        href={`/retailer/products/edit/${product.id}`}
                        startIcon={<EditIcon />}
                        variant="outlined"
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(product.id)}
                        startIcon={<DeleteIcon />}
                        variant="outlined"
                        color="error"
                        size="small"
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </motion.div>
    </Container>
  );
} 