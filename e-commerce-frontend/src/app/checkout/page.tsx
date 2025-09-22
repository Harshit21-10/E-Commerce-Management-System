'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Alert,
  Divider,
} from '@mui/material'
import { motion } from 'framer-motion'
import { RootState } from '@/lib/store'
import { clearCart } from '@/features/cart/cartSlice'
import { orderApi } from '@/services/api'

const steps = ['Shipping Address', 'Payment Details', 'Review Order']

interface ShippingForm {
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
}

interface PaymentForm {
  cardName: string
  cardNumber: string
  expiryDate: string
  cvv: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const [activeStep, setActiveStep] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [shippingData, setShippingData] = useState<ShippingForm>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
  })

  const [paymentData, setPaymentData] = useState<PaymentForm>({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  })

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShippingData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNext = () => {
    if (activeStep === 0 && !validateShippingForm()) return
    if (activeStep === 1 && !validatePaymentForm()) return
    if (activeStep === steps.length - 1) {
      handlePlaceOrder()
      return
    }
    setActiveStep((prevStep) => prevStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const validateShippingForm = () => {
    const required = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode', 'country']
    for (const field of required) {
      if (!shippingData[field as keyof ShippingForm]) {
        setError(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`)
        return false
      }
    }
    return true
  }

  const validatePaymentForm = () => {
    const required = ['cardName', 'cardNumber', 'expiryDate', 'cvv']
    for (const field of required) {
      if (!paymentData[field as keyof PaymentForm]) {
        setError(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`)
        return false
      }
    }
    return true
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    setError('')

    try {
      // Create an order for each cart item
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Create orders for each item in the cart
      for (const item of cartItems) {
        const orderData = {
          product: { id: item.id },
          user: { id: parseInt(userId, 10) },
          quantity: item.quantity,
          status: "PENDING",
          orderDate: new Date().toISOString(),
          shippingDetails: {
            ...shippingData,
            paymentMethod: "CARD",
            cardLastFour: paymentData.cardNumber.slice(-4)
          }
        };
        await orderApi.createOrder(orderData);
      }

      dispatch(clearCart())
      router.push('/orders')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order')
      setLoading(false)
    }
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First Name"
                name="firstName"
                value={shippingData.firstName}
                onChange={handleShippingChange}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last Name"
                name="lastName"
                value={shippingData.lastName}
                onChange={handleShippingChange}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Address"
                name="address"
                value={shippingData.address}
                onChange={handleShippingChange}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="City"
                name="city"
                value={shippingData.city}
                onChange={handleShippingChange}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="State/Province"
                name="state"
                value={shippingData.state}
                onChange={handleShippingChange}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="ZIP/Postal Code"
                name="zipCode"
                value={shippingData.zipCode}
                onChange={handleShippingChange}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Country"
                name="country"
                value={shippingData.country}
                onChange={handleShippingChange}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={shippingData.phone}
                onChange={handleShippingChange}
                sx={textFieldStyle}
              />
            </Grid>
          </Grid>
        )
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Name on Card"
                name="cardName"
                value={paymentData.cardName}
                onChange={handlePaymentChange}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Card Number"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handlePaymentChange}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Expiry Date"
                name="expiryDate"
                placeholder="MM/YY"
                value={paymentData.expiryDate}
                onChange={handlePaymentChange}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="CVV"
                name="cvv"
                value={paymentData.cvv}
                onChange={handlePaymentChange}
                sx={textFieldStyle}
              />
            </Grid>
          </Grid>
        )
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            {cartItems.map((item) => (
              <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>
                  {item.name} × {item.quantity}
                </Typography>
                <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">${calculateTotal().toFixed(2)}</Typography>
            </Box>
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Shipping Address
            </Typography>
            <Typography>
              {shippingData.firstName} {shippingData.lastName}
            </Typography>
            <Typography>{shippingData.address}</Typography>
            <Typography>
              {shippingData.city}, {shippingData.state} {shippingData.zipCode}
            </Typography>
            <Typography>{shippingData.country}</Typography>
          </Box>
        )
      default:
        return 'Unknown step'
    }
  }

  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'rgba(255,255,255,0.1)',
      },
      '&:hover fieldset': {
        borderColor: '#00f5ff',
      },
    },
  }

  if (cartItems.length === 0) {
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
          Checkout
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            background: 'rgba(26,26,26,0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {getStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
            {activeStep !== 0 && (
              <Button
                onClick={handleBack}
                variant="outlined"
                sx={{
                  borderColor: '#00f5ff',
                  color: '#00f5ff',
                  '&:hover': {
                    borderColor: '#ff00ff',
                    color: '#ff00ff',
                  },
                }}
              >
                Back
              </Button>
            )}
            <Button
              variant="contained"
              onClick={handleNext}
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
              {activeStep === steps.length - 1
                ? loading
                  ? 'Placing Order...'
                  : 'Place Order'
                : 'Next'}
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  )
} 