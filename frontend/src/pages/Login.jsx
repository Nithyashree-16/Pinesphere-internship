import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { authAPI } from '../services/api.js'
import Loader from '../components/Loader/Loader.jsx'
import { Bot, Eye, EyeOff } from 'lucide-react'

const Login = () => {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]       = useState({ email:'', password:'' })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [apiError, setApiError] = useState('')

  const validate = () => {
    const e = {}
    if (!form.email.trim())           e.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password)               e.password = 'Password is required'
    return e
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
    setApiError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const res = await authAPI.login(form)
      login(res.data.user, res.data.token)
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      setApiError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-primary)', padding:24, position:'relative' }}>
      <div className="bg-grid" />

      {/* Glow blobs */}
      <div style={{ position:'fixed', top:'-15%', right:'-10%', width:500, height:500, background:'radial-gradient(circle,rgba(108,99,255,0.12) 0%,transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'fixed', bottom:'-15%', left:'-10%', width:450, height:450, background:'radial-gradient(circle,rgba(0,212,255,0.07) 0%,transparent 70%)', pointerEvents:'none' }} />

      <div className="animate-fade-up" style={{
        background:'var(--bg-card)', border:'1px solid var(--border-color)',
        borderRadius:20, padding:'40px 36px', width:'100%', maxWidth:440,
        position:'relative', zIndex:1, boxShadow:'0 4px 24px rgba(0,0,0,0.4)'
      }}>
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:28 }}>
          <div style={{ width:44, height:44, background:'linear-gradient(135deg,var(--accent-primary),var(--accent-secondary))', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', boxShadow:'0 4px 16px rgba(108,99,255,0.4)' }}>
            <Bot size={26} />
          </div>
          <span style={{ fontSize:'1.3rem', fontWeight:700 }}>TicketAI</span>
        </div>

        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:'1.7rem', fontWeight:700, marginBottom:6, letterSpacing:'-0.5px' }}>Welcome back</h1>
          <p style={{ color:'var(--text-secondary)', fontSize:'0.9rem' }}>Sign in to manage your complaints & tickets</p>
        </div>

        {apiError && <div className="api-error">{apiError}</div>}

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
          <div className="form-group">
            <label>Email Address</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
              <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Enter your password" style={{ paddingRight:44 }} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position:'absolute', right:12, background:'transparent', color:'var(--text-muted)', display:'flex', alignItems:'center' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <Loader size="sm" /> : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:22, fontSize:'0.88rem', color:'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color:'var(--accent-primary)', fontWeight:600 }}>Create one</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
