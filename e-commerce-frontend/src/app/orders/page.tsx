'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Collapse,
  Alert,
  CircularProgress,
} from '@mui/material'
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { RootState } from '@/lib/store'
import { orderApi } from '@/services/api'

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: number
  product: {
    id: number
    name: string
    price: number
    image: string
  }
  quantity: number
  status: string
  orderDate: string
  shippingFirstName: string
  shippingLastName: string
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingZipCode: string
  shippingCountry: string
}

function Row({ order }: { order: Order }) {
  const [open, setOpen] = useState(false)

  const getImageSrc = (image?: string | null) => {
    if (!image) return '/placeholder-product.jpg'; // Return a placeholder image if no image is provided
    if (image.startsWith('data:') || image.startsWith('http') || image.startsWith('/')) {
      return image;
    }
    return `data:image/jpeg;base64,${image}`;
  };

  return (
    <>
      <TableRow
        sx={{
          '& > *': { borderBottom: 'unset' },
          '&:hover': {
            background: 'rgba(255,255,255,0.05)',
          },
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          #{order.id}
        </TableCell>
        <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
        <TableCell align="right">${(order.product.price * order.quantity).toFixed(2)}</TableCell>
        <TableCell align="right">
          <Chip
            label={order.status}
            color={
              order.status === 'COMPLETED'
                ? 'success'
                : order.status === 'PENDING'
                ? 'warning'
                : order.status === 'CANCELLED'
                ? 'error'
                : 'default'
            }
            sx={{ fontWeight: 'bold' }}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" gutterBottom>
                Order Details
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          component="img"
                          src={getImageSrc(order.product.image)}
                          alt={order.product.name}
                          sx={{
                            width: 40,
                            height: 40,
                            objectFit: 'cover',
                            borderRadius: 1,
                          }}
                        />
                        {order.product.name}
                      </Box>
                    </TableCell>
                    <TableCell>${order.product.price.toFixed(2)}</TableCell>
                    <TableCell align="right">{order.quantity}</TableCell>
                    <TableCell align="right">
                      ${(order.product.price * order.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Shipping Address
                </Typography>
                <Typography>
                  {order.shippingFirstName} {order.shippingLastName}
                </Typography>
                <Typography>{order.shippingAddress}</Typography>
                <Typography>
                  {order.shippingCity}, {order.shippingState} {order.shippingZipCode}
                </Typography>
                <Typography>{order.shippingCountry}</Typography>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default function OrdersPage() {
  const router = useRouter()
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    fetchOrders()
  }, [isAuthenticated, router])

  const getErrorMessage = (err: any): string => {
    if (typeof err.response?.data === 'string') {
      return err.response.data;
    }
    if (err.response?.data?.message) {
      return err.response.data.message;
    }
    if (err.message) {
      return err.message;
    }
    return 'Failed to fetch orders';
  };

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders...');
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('Please log in to view your orders');
        setLoading(false);
        return;
      }
      console.log('User ID:', userId);
      const response = await orderApi.getOrdersByUser(userId);
      console.log('Orders response:', response.data);
      
      // Ensure we have an array of orders
      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
        setError('Received invalid data format from server');
      }
    } catch (err: any) {
      console.error('Error fetching orders:', {
        message: err.message,
        response: err.response,
        data: err.response?.data
      });
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated) {
    return null
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
          Order History
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {orders.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              background: 'rgba(26,26,26,0.8)',
              borderRadius: 2,
            }}
          >
            <Typography variant="h5" sx={{ mb: 2 }}>
              No orders found
            </Typography>
          </Box>
        ) : (
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
                  <TableCell />
                  <TableCell>Order ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <Row key={order.id} order={order} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </motion.div>
    </Container>
  )
} 