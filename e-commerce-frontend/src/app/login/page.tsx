'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Link as MuiLink,
} from '@mui/material'
import { motion } from 'framer-motion'
import { login } from '@/features/auth/authSlice'
import { authApi } from '@/services/api'

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('Attempting login...');
      if (!email || !password) {
        setError('Please enter both email and password');
        return;
      }
      
      const response = await authApi.login(email, password)
      console.log('Login response:', response.data);
      const { token, userId, type } = response.data

      if (!token || !userId) {
        setError('Invalid response from server. Please try again.');
        return;
      }

      // Store token and user data
      localStorage.setItem('token', token)
      localStorage.setItem('userId', userId)
      localStorage.setItem('userType', type)
      console.log('Stored credentials:', { token, userId, type });

      // Update Redux state
      dispatch(login({ token, userId }))
      console.log('Updated Redux state');

      // Redirect based on user type
      if (type === 'ADMIN') {
        router.push('/admin')
      } else if (type === 'PRODUCT_OWNER') {
        router.push('/retailer/products')
      } else {
        router.push('/')
      }
    } catch (err: any) {
      console.error('Login error:', {
        message: err.message,
        response: err.response,
        data: err.response?.data
      });
      
      let errorMessage = 'Failed to login. Please try again.';
      
      if (err.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (err.response?.status === 404) {
        errorMessage = 'Login service not available';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message === 'Network Error') {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%' }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'rgba(26,26,26,0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              sx={{
                mb: 3,
                background: 'linear-gradient(45deg, #00f5ff, #ff00ff)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
              }}
            >
              Sign In
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
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
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  background: 'linear-gradient(45deg, #00f5ff, #ff00ff)',
                  color: 'black',
                  fontWeight: 'bold',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #00f5ff, #ff00ff)',
                    opacity: 0.9,
                  },
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <MuiLink
                  href="/register"
                  variant="body2"
                  sx={{
                    color: '#00f5ff',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {"Don't have an account? Sign Up"}
                </MuiLink>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  )
} 