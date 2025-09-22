'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Button, Container, Typography, Box, CircularProgress } from '@mui/material'
import { TrendingUp } from '@mui/icons-material'
import { productApi } from '@/services/api'

// Dynamically import components with ssr: false to avoid hydration issues
const ProductCard = dynamic(() => import('@/components/ProductCard'), { ssr: false })
const HeroSection = dynamic(() => import('@/components/HeroSection'), { ssr: false })

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  available: boolean;
  productSizes: string[];
  productColors: string[];
  productImageBase64: string;
  approved: boolean;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23666666'%3ENo Image Available%3C/text%3E%3C/svg%3E";

  const getImageSrc = (image: string | null) => {
    if (!image) return placeholderImage;
    if (image.startsWith('data:') || image.startsWith('http') || image.startsWith('/')) {
      return image;
    }
    return `data:image/jpeg;base64,${image}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products...');
        const response = await productApi.getAll();
        console.log('Products response:', response);
        setProducts(response.data);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching products:', err);
        console.error('Error details:', {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data
        });
        setError(err.message || 'Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    )
  }

  return (
    <main>
      <HeroSection />
      
      <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h2"
            component="h2"
            align="center"
            sx={{
              mb: 6,
              background: 'linear-gradient(45deg, #00f5ff, #ff00ff)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Featured Products
          </Typography>
        </motion.div>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 4 }}>
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: product.id * 0.1 }}
            >
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                image={getImageSrc(product.productImageBase64)}
                description={product.description}
                stock={product.stock}
                category={product.category}
                available={product.available}
              />
            </motion.div>
          ))}
        </Box>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<TrendingUp />}
              sx={{
                background: 'linear-gradient(45deg, #00f5ff, #ff00ff)',
                color: 'black',
                fontWeight: 'bold',
              }}
            >
              View All Products
            </Button>
          </motion.div>
        </Box>
      </Container>
    </main>
  )
}
