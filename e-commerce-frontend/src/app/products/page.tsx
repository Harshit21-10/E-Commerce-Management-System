'use client'

import { useState, useEffect } from 'react'
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Skeleton,
  Alert,
  SelectChangeEvent,
} from '@mui/material'
import { motion } from 'framer-motion'
import ProductCard from '@/components/ProductCard'
import { productApi } from '@/services/api'

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  category: string
  available: boolean
  productImageBase64: string
  approved?: boolean
  productSizes?: string[]
  productColors?: string[]
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterAndSortProducts()
  }, [searchQuery, selectedCategory, sortBy, products])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await productApi.getAll()
      console.log('Products response:', response.data)
      setProducts(response.data)
    } catch (err: any) {
      console.error('Error fetching products:', err)
      setError(err.response?.data?.message || 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortProducts = () => {
    let filtered = [...products]
    console.log('Filtering products:', filtered)

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'price_low':
          return a.price - b.price
        case 'price_high':
          return b.price - a.price
        default:
          return 0
      }
    })

    console.log('Filtered products:', filtered)
    setFilteredProducts(filtered)
  }

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value)
  }

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value)
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
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
          Our Products
        </Typography>

        <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Search Products"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              flexGrow: 1,
              minWidth: '200px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.1)',
                },
                '&:hover fieldset': {
                  borderColor: '#00f5ff',
                },
              },
            }}
          />
          <FormControl sx={{ minWidth: '150px' }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={handleCategoryChange}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.1)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00f5ff',
                },
              }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Fashion">Fashion</MenuItem>
              <MenuItem value="Home & Living">Home & Living</MenuItem>
              <MenuItem value="Sports & Fitness">Sports & Fitness</MenuItem>
              <MenuItem value="Books">Books</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: '150px' }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={handleSortChange}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.1)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00f5ff',
                },
              }}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="price_low">Price: Low to High</MenuItem>
              <MenuItem value="price_high">Price: High to Low</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={3}>
          {loading
            ? Array.from(new Array(6)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Skeleton
                    variant="rectangular"
                    height={400}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: 2,
                    }}
                  />
                </Grid>
              ))
            : filteredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ProductCard
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      description={product.description}
                      image={product.productImageBase64}
                      stock={product.stock}
                      category={product.category}
                      available={product.available}
                    />
                  </motion.div>
                </Grid>
              ))}
        </Grid>

        {!loading && filteredProducts.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              background: 'rgba(26,26,26,0.8)',
              borderRadius: 2,
              mt: 4,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No products found matching your criteria
            </Typography>
          </Box>
        )}
      </motion.div>
    </Container>
  )
} 