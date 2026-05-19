import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login          from './pages/Login.jsx'
import Register       from './pages/Register.jsx'
import Dashboard      from './pages/Dashboard.jsx'
import MyTickets      from './pages/MyTickets.jsx'
import CreateTicket   from './pages/CreateTicket.jsx'
import TicketDetails  from './pages/TicketDetails.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Profile        from './pages/Profile.jsx'
import NotFound       from './pages/NotFound.jsx'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx'

const AppRoutes = () => (
  <Routes>
    <Route path="/login"         element={<Login />} />
    <Route path="/register"      element={<Register />} />
    <Route path="/dashboard"     element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/my-tickets"    element={<ProtectedRoute><MyTickets /></ProtectedRoute>} />
    <Route path="/create-ticket" element={<ProtectedRoute><CreateTicket /></ProtectedRoute>} />
    <Route path="/ticket/:id"    element={<ProtectedRoute><TicketDetails /></ProtectedRoute>} />
    <Route path="/profile"       element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="/admin"         element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
    <Route path="/"              element={<Navigate to="/dashboard" replace />} />
    <Route path="*"              element={<NotFound />} />
  </Routes>
)

export default AppRoutes
