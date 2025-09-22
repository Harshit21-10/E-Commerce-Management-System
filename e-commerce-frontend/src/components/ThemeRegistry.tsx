'use client';

import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import Navbar from './Navbar';

// This implementation is from the Material-UI with Next.js example
function createEmotionCache() {
  return createCache({ key: 'mui', prepend: true });
}

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const cache = createEmotionCache();

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(' '),
      }}
    />
  ));

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <main style={{ paddingTop: '64px' }}>
          {children}
        </main>
      </ThemeProvider>
    </CacheProvider>
  );
} 