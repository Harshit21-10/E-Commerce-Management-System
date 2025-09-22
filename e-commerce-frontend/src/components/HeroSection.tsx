'use client'

import { motion } from 'framer-motion'
import { Box, Container, Typography, Button } from '@mui/material'
import { ShoppingCart } from '@mui/icons-material'

export default function HeroSection() {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, rgba(0,245,255,0.1) 0%, rgba(255,0,255,0.1) 100%)',
        backdropFilter: 'blur(10px)',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: '20vw',
              height: '20vw',
              borderRadius: '50%',
              background: i % 2 === 0 ? 'rgba(0,245,255,0.1)' : 'rgba(255,0,255,0.1)',
              filter: 'blur(50px)',
            }}
            animate={{
              x: [Math.random() * 100, Math.random() * 100],
              y: [Math.random() * 100, Math.random() * 100],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ maxWidth: 600, mx: 'auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h1"
              sx={{
                mb: 2,
                background: 'linear-gradient(45deg, #00f5ff, #ff00ff)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Next-Gen Shopping Experience
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Typography
              variant="h5"
              sx={{ mb: 4, color: 'rgba(255,255,255,0.8)' }}
            >
              Discover the future of online shopping with our cutting-edge platform
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              sx={{
                background: 'linear-gradient(45deg, #00f5ff, #ff00ff)',
                color: 'black',
                fontWeight: 'bold',
                px: 4,
                py: 2,
              }}
            >
              Start Shopping
            </Button>
          </motion.div>
        </Box>
      </Container>
    </Box>
  )
} 