import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './utils/Authcontext.jsx'
import { WishlistProvider } from './utils/WishlistContext.jsx'
import { ToastProvider } from './utils/ToastContext.jsx'
import { SearchProvider } from './utils/SearchContext.jsx'
import { MsalProvider } from '@azure/msal-react'
import { msalInstance } from './utils/msalConfig.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MsalProvider instance={msalInstance}>
      <BrowserRouter>
        <AuthProvider>
          <WishlistProvider>
            <ToastProvider>
              <SearchProvider>
                <App />
              </SearchProvider>
            </ToastProvider>
          </WishlistProvider>
        </AuthProvider>
      </BrowserRouter>
    </MsalProvider>
  </StrictMode>
)