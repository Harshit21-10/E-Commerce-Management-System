'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  Tooltip,
  MenuItem,
  Badge,
} from '@mui/material'
import {
  Menu as MenuIcon,
  ShoppingCart,
  Person,
} from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/lib/store'
import { logout } from '@/features/auth/authSlice'
import { clearCart } from '@/features/cart/cartSlice'

const pages = [
  { title: 'Products', path: '/products' },
  { title: 'Categories', path: '/categories' },
  { title: 'About', path: '/about' }
]

export default function Navbar() {
  const router = useRouter()
  const dispatch = useDispatch()
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState<string | null>(null)

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleNavigation = (path: string) => {
    handleCloseNavMenu()
    router.push(path)
  }

  const handleUserAction = (action: string) => {
    handleCloseUserMenu()
    switch (action) {
      case 'Profile':
        router.push('/profile')
        break
      case 'Orders':
        router.push('/orders')
        break
      case 'Login':
        router.push('/login')
        break
      case 'Logout':
        dispatch(logout())
        dispatch(clearCart())
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('userType')
        router.push('/')
        break
      default:
        break
    }
  }

  const settings = isAuthenticated 
    ? ['Profile', 'Orders', 'Logout']
    : ['Login']

  useEffect(() => {
    const token = localStorage.getItem('token')
    const type = localStorage.getItem('userType')
    setIsLoggedIn(!!token)
    setUserType(type)
  }, [])

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: 'rgba(18,18,18,0.8)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              background: 'linear-gradient(45deg, #00f5ff, #ff00ff)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
            onClick={() => router.push('/')}
          >
            E-COMMERCE
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="navigation menu"
              aria-controls={Boolean(anchorElNav) ? 'menu-appbar' : undefined}
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              transitionDuration={200}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    backgroundColor: 'rgba(18,18,18,0.8)',
                    backdropFilter: 'blur(10px)',
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                  },
                },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.title} onClick={() => handleNavigation(page.path)}>
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              background: 'linear-gradient(45deg, #00f5ff, #ff00ff)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
            onClick={() => router.push('/')}
          >
            E-COMMERCE
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                onClick={() => handleNavigation(page.path)}
                sx={{ 
                  my: 2, 
                  color: 'white', 
                  display: 'block',
                  '&:hover': {
                    background: 'linear-gradient(45deg, rgba(0,245,255,0.1), rgba(255,0,255,0.1))',
                  },
                }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0, display: 'flex', gap: 2 }}>
            <IconButton 
              color="inherit" 
              onClick={() => router.push('/cart')}
              sx={{
                '&:hover': {
                  background: 'linear-gradient(45deg, rgba(0,245,255,0.1), rgba(255,0,255,0.1))',
                },
              }}
            >
              <Badge badgeContent={cartItems.length} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            <Tooltip title={isAuthenticated ? "Open settings" : "Login"}>
              <IconButton 
                onClick={handleOpenUserMenu} 
                sx={{ 
                  p: 0,
                  '&:hover': {
                    background: 'linear-gradient(45deg, rgba(0,245,255,0.1), rgba(255,0,255,0.1))',
                  },
                }}
              >
                <Person sx={{ color: 'white' }} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar-user"
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              transitionDuration={200}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    backgroundColor: 'rgba(18,18,18,0.8)',
                    backdropFilter: 'blur(10px)',
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                  },
                },
              }}
            >
              {settings.map((setting) => (
                <MenuItem 
                  key={setting} 
                  onClick={() => handleUserAction(setting)}
                  sx={{
                    '&:hover': {
                      background: 'linear-gradient(45deg, rgba(0,245,255,0.1), rgba(255,0,255,0.1))',
                    },
                  }}
                >
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
} 