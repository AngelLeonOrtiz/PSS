import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './auth/AuthProvider'
import { LayoutProvider } from './components/layout/LayoutContext'
import AppRouter from './router/AppRouter'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LayoutProvider>
          <AppRouter />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#fff',
              },
            }}
          />
        </LayoutProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
