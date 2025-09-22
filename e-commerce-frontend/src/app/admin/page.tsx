'use client'

import { useState, useEffect } from 'react'
import {
  Container,
  Grid,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { productApi } from '@/services/api'

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  category: string
  available: boolean
  approved: boolean
  productImageBase64?: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    available: true,
    approved: false,
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    // Check if user is admin
    const userType = localStorage.getItem('userType')
    if (userType !== 'ADMIN') {
      router.push('/login')
      return
    }
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await productApi.getAll()
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      available: true,
      approved: false,
    })
    setOpenDialog(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setNewProduct(product)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedProduct(null)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleSubmit = async () => {
    try {
      const formData = new FormData()
      Object.entries(newProduct).forEach(([key, value]) => {
        formData.append(key, value.toString())
      })
      
      if (selectedFile) {
        formData.append('images', selectedFile)
      }

      if (selectedProduct) {
        // Update existing product
        await productApi.update(selectedProduct.id, formData)
      } else {
        // Add new product
        await productApi.add(formData)
      }

      handleCloseDialog()
      fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  const handleApproveProduct = async (productId: number) => {
    try {
      await productApi.approve(productId)
      fetchProducts()
    } catch (error) {
      console.error('Error approving product:', error)
    }
  }

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productApi.delete(productId)
        fetchProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddProduct}>
          Add New Product
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>Approved</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.available ? 'Yes' : 'No'}</TableCell>
                <TableCell>{product.approved ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => handleEditProduct(product)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  {!product.approved && (
                    <Button
                      size="small"
                      color="success"
                      onClick={() => handleApproveProduct(product.id)}
                      sx={{ mr: 1 }}
                    >
                      Approve
                    </Button>
                  )}
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {/* Image Preview */}
            {(imagePreview || selectedProduct?.productImageBase64) && (
              <Box sx={{ 
                width: '100%', 
                height: 200, 
                position: 'relative',
                borderRadius: 1,
                overflow: 'hidden',
                mb: 2 
              }}>
                <img
                  src={imagePreview || `data:image/jpeg;base64,${selectedProduct?.productImageBase64}`}
                  alt="Product preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            )}
            
            {/* File Upload Button */}
            <Button
              variant="outlined"
              component="label"
              sx={{
                borderColor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  borderColor: '#00f5ff',
                },
              }}
            >
              Upload Product Image
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                hidden
              />
            </Button>

            <TextField
              label="Name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Description"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
              multiline
              rows={4}
              fullWidth
            />
            <TextField
              label="Price"
              type="number"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: Number(e.target.value) })
              }
              fullWidth
            />
            <TextField
              label="Stock"
              type="number"
              value={newProduct.stock}
              onChange={(e) =>
                setNewProduct({ ...newProduct, stock: Number(e.target.value) })
              }
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
              >
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Clothing">Clothing</MenuItem>
                <MenuItem value="Books">Books</MenuItem>
                <MenuItem value="Home">Home</MenuItem>
                <MenuItem value="Sports">Sports</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={newProduct.available}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, available: e.target.checked })
                  }
                />
              }
              label="Available"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={newProduct.approved}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, approved: e.target.checked })
                  }
                />
              }
              label="Approved"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedProduct ? 'Update' : 'Add'} Product
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
} 