'use client'

import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material'
import {
  Email,
  Phone,
  LocationOn,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
} from '@mui/icons-material'
import { motion } from 'framer-motion'

export default function AboutPage() {
  const socialLinks = [
    { icon: <Facebook />, name: 'Facebook', url: 'https://facebook.com' },
    { icon: <Twitter />, name: 'Twitter', url: 'https://twitter.com' },
    { icon: <Instagram />, name: 'Instagram', url: 'https://instagram.com' },
    { icon: <LinkedIn />, name: 'LinkedIn', url: 'https://linkedin.com/in/harshit-raj-492869258/' },
  ]

  const contactInfo = [
    {
      icon: <Email />,
      primary: 'Email',
      secondary: 'harshit@ecommerce.com',
    },
    {
      icon: <Phone />,
      primary: 'Phone',
      secondary: '+91 9905426006',
    },
    {
      icon: <LocationOn />,
      primary: 'Address',
      secondary: '123 E-Commerce Street, Digital City, Delhi 110096',
    },
  ]

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
          About Us
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                height: '100%',
                background: 'rgba(26,26,26,0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Typography variant="h5" gutterBottom>
                Our Story
              </Typography>
              <Typography paragraph>
                Welcome to our E-commerce platform! We are passionate about providing
                high-quality products and exceptional shopping experiences to our
                customers.
              </Typography>
              <Typography paragraph>
                Founded in 2024, we have grown from a small startup to a trusted
                online marketplace. Our mission is to make online shopping
                accessible, enjoyable, and secure for everyone.
              </Typography>
              <Typography paragraph>
                We carefully curate our product selection to ensure that we offer
                only the best items across various categories. Our team works
                tirelessly to verify product quality, authenticity, and seller
                reliability.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                height: '100%',
                background: 'rgba(26,26,26,0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Typography variant="h5" gutterBottom>
                Contact Us
              </Typography>
              <List>
                {contactInfo.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon sx={{ color: '#00f5ff' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.primary}
                      secondary={item.secondary}
                      primaryTypographyProps={{
                        variant: 'subtitle1',
                        fontWeight: 'bold',
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                background: 'rgba(26,26,26,0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Typography variant="h5" gutterBottom>
                Our Values
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h6" gutterBottom>
                      Quality
                    </Typography>
                    <Typography>
                      We ensure all products meet high-quality standards
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h6" gutterBottom>
                      Trust
                    </Typography>
                    <Typography>
                      Building long-lasting relationships with our customers
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h6" gutterBottom>
                      Innovation
                    </Typography>
                    <Typography>
                      Constantly improving our platform and services
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h6" gutterBottom>
                      Customer Focus
                    </Typography>
                    <Typography>
                      Putting our customers' needs first in everything we do
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                background: 'rgba(26,26,26,0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Typography variant="h5" gutterBottom>
                Connect With Us
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                  flexWrap: 'wrap',
                }}
              >
                {socialLinks.map((social, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    startIcon={social.icon}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      borderColor: '#00f5ff',
                      color: '#00f5ff',
                      '&:hover': {
                        borderColor: '#ff00ff',
                        color: '#ff00ff',
                      },
                    }}
                  >
                    {social.name}
                  </Button>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  )
} 
 