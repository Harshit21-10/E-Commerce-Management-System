'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  Laptop,
  Style,
  MenuBook,
  Home,
  SportsBasketball,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { productApi } from '@/services/api'

interface Category {
  id: string
  name: string
  description: string
  icon: React.ReactElement
  color: string
}

const categories: Category[] = [
  {
    id: 'Electronics',
    name: 'Electronics',
    description: 'Latest gadgets and electronic devices',
    icon: <Laptop sx={{ fontSize: 60 }} />,
    color: '#00f5ff',
  },
  {
    id: 'Fashion',
    name: 'Fashion',
    description: 'Fashion and apparel for all',
    icon: <Style sx={{ fontSize: 60 }} />,
    color: '#ff00ff',
  },
  {
    id: 'Home & Living',
    name: 'Home & Living',
    description: 'Everything for your home',
    icon: <Home sx={{ fontSize: 60 }} />,
    color: '#00ff00',
  },
  {
    id: 'Sports & Fitness',
    name: 'Sports & Fitness',
    description: 'Sports equipment and fitness gear',
    icon: <SportsBasketball sx={{ fontSize: 60 }} />,
    color: '#ff0000',
  },
  {
    id: 'Books',
    name: 'Books',
    description: 'Books for every reader',
    icon: <MenuBook sx={{ fontSize: 60 }} />,
    color: '#ffff00',
  },
]

export default function CategoriesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    fetchCategoryCounts()
  }, [])

  const fetchCategoryCounts = async () => {
    try {
      const response = await productApi.getAll()
      const counts: Record<string, number> = {}
      response.data.forEach((product: any) => {
        counts[product.category] = (counts[product.category] || 0) + 1
      })
      setCategoryCounts(counts)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            mb: 4,
            textAlign: 'center',
            background: 'linear-gradient(45deg, #00f5ff, #ff00ff)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
          }}
        >
          Product Categories
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Paper
                  onClick={() => router.push(`/products?category=${category.id}`)}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: 'rgba(26,26,26,0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: category.color,
                      '& .category-icon': {
                        color: category.color,
                      },
                    },
                  }}
                >
                  <Box
                    className="category-icon"
                    sx={{
                      mb: 2,
                      color: 'rgba(255,255,255,0.7)',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {category.icon}
                  </Box>
                  <Typography variant="h5" gutterBottom>
                    {category.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {category.description}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: category.color,
                      fontWeight: 'bold',
                    }}
                  >
                    {categoryCounts[category.id] || 0} Products
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Container>
  )
} 