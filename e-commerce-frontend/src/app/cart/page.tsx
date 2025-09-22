'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Alert,
} from '@mui/material'
import { Add, Remove, Delete, ShoppingBag } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { RootState } from '@/lib/store'
import { removeFromCart, updateQuantity } from '@/features/cart/cartSlice'
import { cartApi } from '@/services/api'

export default function CartPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const getImageSrc = (image: string) => {
    if (image.startsWith('data:') || image.startsWith('http') || image.startsWith('/')) {
      return image;
    }
    return `data:image/jpeg;base64,${image}`;
  };

  const handleQuantityChange = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      await cartApi.updateQuantity(id, newQuantity)
      dispatch(updateQuantity({ id, quantity: newQuantity }))
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update quantity')
    }
  }

  const handleRemoveItem = async (id: number) => {
    try {
      await cartApi.removeFromCart(id)
      dispatch(removeFromCart(id))
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove item')
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    router.push('/checkout')
  }

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            background: 'rgba(26,26,26,0.8)',
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            Please log in to view your cart
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/login')}
            sx={{
              background: 'linear-gradient(45deg, #00f5ff, #ff00ff)',
              color: 'black',
              fontWeight: 'bold',
            }}
          >
            Log In
          </Button>
        </Box>
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
          Shopping Cart
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {cartItems.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              background: 'rgba(26,26,26,0.8)',
              borderRadius: 2,
            }}
          >
            <ShoppingBag sx={{ fontSize: 60, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2 }}>
              Your cart is empty
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push('/products')}
              sx={{
                background: 'linear-gradient(45deg, #00f5ff, #ff00ff)',
                color: 'black',
                fontWeight: 'bold',
              }}
            >
              Continue Shopping
            </Button>
          </Box>
        ) : (
          <>
            <TableContainer
              component={Paper}
              sx={{
                background: 'rgba(26,26,26,0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell component="th" scope="row">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            component="img"
                            src={getImageSrc(item.image)}
                            alt={item.name}
                            sx={{
                              width: 50,
                              height: 50,
                              objectFit: 'cover',
                              borderRadius: 1,
                            }}
                          />
                          <Typography>{item.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Remove />
                          </IconButton>
                          <TextField
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value)
                              if (!isNaN(value) && value > 0) {
                                handleQuantityChange(item.id, value)
                              }
                            }}
                            sx={{
                              width: '60px',
                              '& input': { textAlign: 'center' },
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: 'rgba(255,255,255,0.1)',
                                },
                              },
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Add />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <Typography variant="h6">Total:</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6">${calculateTotal().toFixed(2)}</Typography>
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => router.push('/products')}
                sx={{
                  borderColor: '#00f5ff',
                  color: '#00f5ff',
                  '&:hover': {
                    borderColor: '#ff00ff',
                    color: '#ff00ff',
                  },
                }}
              >
                Continue Shopping
              </Button>
              <Button
                variant="contained"
                onClick={handleCheckout}
                disabled={loading}
                sx={{
                  background: 'linear-gradient(45deg, #00f5ff, #ff00ff)',
                  color: 'black',
                  fontWeight: 'bold',
                  '&:hover': {
                    opacity: 0.9,
                  },
                }}
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </Button>
            </Box>
          </>
        )}
      </motion.div>
    </Container>
  )
} 