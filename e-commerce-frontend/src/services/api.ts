import axios, { InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = 'http://localhost:9090';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      token,
      userId
    });
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (userId) {
      config.headers['X-User-ID'] = userId;
    }

    console.log('Request headers:', config.headers);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });

    // If the response contains product data, ensure image URLs are properly formatted
    if (Array.isArray(response.data)) {
      console.log('Processing array response');
      response.data = response.data.map((item: any) => {
        console.log('Processing item:', item);
        if (item.productImageBase64) {
          console.log('Found image data:', item.productImageBase64.substring(0, 100) + '...');
          // If it's already a URL, add optimization parameters if needed
          if (item.productImageBase64.startsWith('http')) {
            console.log('URL detected');
            if (item.productImageBase64.includes('images.unsplash.com') && !item.productImageBase64.includes('?')) {
              item.productImageBase64 += '?w=800&q=80&auto=format&fit=crop';
              console.log('Added optimization parameters:', item.productImageBase64);
            }
          }
          // If it's a base64 string without data URL prefix, add it
          else if (!item.productImageBase64.startsWith('data:')) {
            try {
              console.log('Attempting to decode base64');
              atob(item.productImageBase64);
              item.productImageBase64 = `data:image/jpeg;base64,${item.productImageBase64}`;
              console.log('Successfully added data URL prefix');
            } catch (e) {
              console.error('Invalid base64 string:', e);
              item.productImageBase64 = null;
            }
          }
        } else {
          console.log('No image data found for item');
          item.productImageBase64 = null;
        }
        return item;
      });
    }

    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    // If the error response is an object with an error message, format it properly
    if (error.response?.data && typeof error.response.data === 'object') {
      const errorData = error.response.data;
      error.response.data = errorData.message || JSON.stringify(errorData);
    }

    return Promise.reject(error);
  }
);

// Product APIs
export const productApi = {
  getAll: () => api.get('/api/products'),
  getById: (id: number) => api.get(`/api/products/${id}`),
  search: (query: string) => api.get(`/api/products/search?query=${query}`),
  getByCategory: (category: string) => api.get(`/api/products/category/${category}`),
  add: (formData: FormData) => api.post('/api/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id: number, formData: FormData) => api.put(`/api/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id: number) => api.delete(`/api/products/${id}`),
  approve: (id: number) => api.put(`/api/products/${id}/approve`),
  getApproved: () => api.get('/api/products/approved'),
  getByOwner: (ownerId: number) => api.get(`/api/products/owner/${ownerId}`),
};

// Auth APIs
export const authApi = {
  login: (email: string, password: string) => 
    api.post('/api/auth/login', { email, password }),
  register: (userData: { name: string; email: string; password: string }) =>
    api.post('/api/users/register', userData),
  logout: () => api.post('/api/auth/logout'),
};

// Cart APIs
export const cartApi = {
  getCart: () => api.get('/api/cart/user'),
  addToCart: (productId: number, quantity: number = 1) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User ID is required. Please log in.');
    }
    return api.post('/api/cart', {
      product: { id: productId },
      user: { id: parseInt(userId, 10) },
      quantity: parseInt(String(quantity), 10),
      status: "In Cart",
      orderDate: new Date().toISOString()
    });
  },
  updateQuantity: (productId: number, quantity: number) =>
    api.put(`/api/cart/${productId}`, { quantity }),
  removeFromCart: (productId: number) =>
    api.delete(`/api/cart/${productId}`),
  clearCart: () => api.delete('/api/cart/clear'),
};

// Order APIs
export const orderApi = {
  createOrder: (orderData: any) => api.post('/api/orders', orderData),
  getOrders: () => api.get('/api/orders'),
  getOrderById: (id: number) => api.get(`/api/orders/${id}`),
  getOrdersByUser: (userId: string) => api.get(`/api/orders/user/${userId}`),
};

// User APIs
export const userApi = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (userData: any) => api.put('/api/users/profile', userData),
  changePassword: (passwordData: { currentPassword: string; newPassword: string }) =>
    api.put('/api/users/password', passwordData),
};

export default api; 