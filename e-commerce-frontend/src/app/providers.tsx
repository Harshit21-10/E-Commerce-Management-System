'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { store } from '@/lib/store'
import ThemeRegistry from '@/components/ThemeRegistry'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </Provider>
    </QueryClientProvider>
  )
} 