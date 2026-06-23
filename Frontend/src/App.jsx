import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import EcommercePage from './Components/EcommerceHome'
import ProductDetailsPage from './Components/ProductDetails'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<EcommercePage />} />
        <Route path='product/:id' element={<ProductDetailsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App