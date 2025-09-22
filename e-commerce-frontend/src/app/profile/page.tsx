'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  Avatar,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material'
import { Person, Security, LocationOn } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { RootState } from '@/lib/store'
import { userApi } from '@/services/api'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

interface UserProfile {
  id: string
  name: string
  email: string
  phoneNumber: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

export default function ProfilePage() {
  const router = useRouter()
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const [tabValue, setTabValue] = useState(0)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    fetchProfile()
  }, [isAuthenticated, router])

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile...');
      console.log('Auth state:', { isAuthenticated, userId: localStorage.getItem('userId') });
      const response = await userApi.getProfile();
      console.log('Profile response:', response);
      setProfile(response.data);
    } catch (err: any) {
      console.error('Profile fetch error:', {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data
      });
      setError(err.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      await userApi.updateProfile(profile!)
      setSuccess('Profile updated successfully')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile')
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    try {
      await userApi.changePassword({
        currentPassword,
        newPassword,
      })
      setSuccess('Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password')
    }
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev!,
      [name]: value
    }))
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
              mb: 2,
              background: 'linear-gradient(45deg, #00f5ff, #ff00ff)',
            }}
          >
            <Person sx={{ fontSize: 60 }} />
          </Avatar>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              background: 'linear-gradient(45deg, #00f5ff, #ff00ff)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
            }}
          >
            My Profile
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            background: 'rgba(26,26,26,0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="profile tabs"
            centered
            sx={{
              borderBottom: 1,
              borderColor: 'rgba(255,255,255,0.1)',
              '& .MuiTab-root': {
                color: 'rgba(255,255,255,0.7)',
              },
              '& .Mui-selected': {
                color: '#00f5ff !important',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#00f5ff',
              },
            }}
          >
            <Tab icon={<Person />} label="Personal Info" />
            <Tab icon={<LocationOn />} label="Address" />
            <Tab icon={<Security />} label="Security" />
          </Tabs>

          {error && (
            <Box sx={{ p: 2 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}

          {success && (
            <Box sx={{ p: 2 }}>
              <Alert severity="success">{success}</Alert>
            </Box>
          )}

          <TabPanel value={tabValue} index={0}>
            <form onSubmit={handleProfileUpdate}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={profile?.name || ''}
                    onChange={handleProfileChange}
                    sx={textFieldStyle}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={profile?.email || ''}
                    onChange={handleProfileChange}
                    disabled
                    sx={textFieldStyle}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={profile?.phoneNumber || ''}
                    onChange={handleProfileChange}
                    sx={textFieldStyle}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      background: 'linear-gradient(45deg, #00f5ff, #ff00ff)',
                      color: 'black',
                      fontWeight: 'bold',
                      '&:hover': {
                        opacity: 0.9,
                      },
                    }}
                  >
                    Update Profile
                  </Button>
                </Grid>
              </Grid>
            </form>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <form onSubmit={handleProfileUpdate}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Address"
                    name="address"
                    value={profile?.address || ''}
                    onChange={handleProfileChange}
                    sx={textFieldStyle}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="City"
                    name="city"
                    value={profile?.city || ''}
                    onChange={handleProfileChange}
                    sx={textFieldStyle}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="State/Province"
                    name="state"
                    value={profile?.state || ''}
                    onChange={handleProfileChange}
                    sx={textFieldStyle}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="ZIP/Postal Code"
                    name="zipCode"
                    value={profile?.zipCode || ''}
                    onChange={handleProfileChange}
                    sx={textFieldStyle}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Country"
                    name="country"
                    value={profile?.country || ''}
                    onChange={handleProfileChange}
                    sx={textFieldStyle}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      background: 'linear-gradient(45deg, #00f5ff, #ff00ff)',
                      color: 'black',
                      fontWeight: 'bold',
                      '&:hover': {
                        opacity: 0.9,
                      },
                    }}
                  >
                    Update Address
                  </Button>
                </Grid>
              </Grid>
            </form>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <form onSubmit={handlePasswordChange}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    sx={textFieldStyle}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    sx={textFieldStyle}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    sx={textFieldStyle}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      background: 'linear-gradient(45deg, #00f5ff, #ff00ff)',
                      color: 'black',
                      fontWeight: 'bold',
                      '&:hover': {
                        opacity: 0.9,
                      },
                    }}
                  >
                    Change Password
                  </Button>
                </Grid>
              </Grid>
            </form>
          </TabPanel>
        </Paper>
      </motion.div>
    </Container>
  )
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