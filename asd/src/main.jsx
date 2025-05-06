import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './i18n'; 
import { CartProvider } from "./contexts/CartContext";


createRoot(document.getElementById('root')).render(
  <StrictMode>
  <CartProvider>
    <App />
  </CartProvider>
</StrictMode>                                                                                       
)
