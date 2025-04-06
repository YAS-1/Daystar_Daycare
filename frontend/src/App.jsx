import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminLogin from './pages/AdminLogin'
import BabySitterLogin from './pages/BabySitterLogin'

function App() {
  return (
    <Routes>
      <Route path='/' element={<AdminLogin />} />
      <Route path='/babysitter-login' element={<BabySitterLogin />} />
    </Routes>
  )
}

export default App