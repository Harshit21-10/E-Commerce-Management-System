'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardMedia, Typography, Button, Box, Snackbar, Alert } from '@mui/material'
import { ShoppingCart } from '@mui/icons-material'
import { useDispatch } from 'react-redux'
import { addToCart } from '@/features/cart/cartSlice'
import { cartApi } from '@/services/api'

interface ProductCardProps {
  id: number
  name: string
  price: number
  image: string
  description: string
  stock?: number
  category?: string
  available?: boolean
}

export default function ProductCard({ id, name, price, image, description }: ProductCardProps) {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)

  // Map of product IDs to Unsplash image URLs
  const productImages: {[key: number]: string} = {
    1: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    2: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    3: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
    4: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    5: 'https://images.unsplash.com/photo-1572635196234-14b3f281503f?auto=format&fit=crop&w=600&q=80',
  };

  const getImageSrc = (image: string) => {
    console.log('Processing image for product:', id, name);

    // Check if we have a predefined image for this product ID
    const productImage = productImages[id];
    if (productImage) {
      console.log('Using predefined product image:', productImage);
      return productImage;
    }

    // If no image provided or previous error, return a fallback image
    if (!image || imageError) {
      console.log('No valid image available, using fallback');
      return 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80';
    }

    // For Unsplash URLs, ensure we're using the correct format
    if (image.includes('unsplash.com')) {
      const baseUrl = image.split('?')[0];
      return `${baseUrl}?auto=format&fit=crop&w=600&q=80`;
    }

    // If it's already a complete URL, return as is
    if (image.startsWith('http')) {
      return image;
    }

    // If it's a base64 string with data URL prefix
    if (image.startsWith('data:')) {
      return image;
    }

    // If it's a base64 string without prefix
    try {
      atob(image);
      return `data:image/jpeg;base64,${image}`;
    } catch (e) {
      console.error('Invalid image data, using fallback');
      setImageError(true);
      return 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80';
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    console.error('Image failed to load, using fallback:', target.src);
    setImageError(true);
    
    // Set a fallback image from Unsplash
    target.src = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80';
    target.onerror = null; // Prevent infinite loop
  };

  const handleAddToCart = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const userId = localStorage.getItem('userId')
      if (!userId) {
        setError('Please log in to add items to cart')
        return
      }

      await cartApi.addToCart(id, 1)
      dispatch(addToCart({ id, name, price, image, quantity: 1 }))
    } catch (error: any) {
      console.error('Failed to add item to cart:', error)
      setError(error.response?.data || 'Failed to add item to cart')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          background: 'rgba(26,26,26,0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 24px rgba(0,245,255,0.2)',
          },
        }}
      >
        <Box sx={{ position: 'relative', paddingTop: '100%' }}>
          <CardMedia
            component="img"
            image={getImageSrc(image)}
            alt={name}
            onError={handleImageError}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
            }}
          />
        </Box>

        <CardContent>
          <Typography
            variant="h6"
            sx={{
              mb: 1,
              background: 'linear-gradient(45deg, #00f5ff, #ff00ff)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {name}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
            {description}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: '#00f5ff',
              }}
            >
              ${price.toFixed(2)}
            </Typography>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={loading}
                sx={{
                  background: 'linear-gradient(45deg, #00f5ff, #ff00ff)',
                  color: 'black',
                  fontWeight: 'bold',
                }}
              >
                Add to Cart
              </Button>
            </motion.div>
          </Box>
        </CardContent>
      </Card>
      <Snackbar 
        open={error !== null} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  )
} 