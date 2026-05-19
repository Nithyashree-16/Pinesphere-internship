import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const t = localStorage.getItem('token')
      const u = localStorage.getItem('user')
      if (t && u) { setToken(t); setUser(JSON.parse(u)) }
    } catch { localStorage.clear() }
    setLoading(false)
  }, [])

  const login = (userData, authToken) => {
    setUser(userData); setToken(authToken)
    localStorage.setItem('token', authToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null); setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const isAdmin = () => user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
