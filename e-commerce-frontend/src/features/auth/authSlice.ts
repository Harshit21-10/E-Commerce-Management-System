import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  isAuthenticated: boolean
  token: string | null
  userId: string | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  userId: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string; userId: string }>) => {
      state.isAuthenticated = true
      state.token = action.payload.token
      state.userId = action.payload.userId
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.token = null
      state.userId = null
    }
  }
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer 