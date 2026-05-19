import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { authAPI } from '../services/api.js'
import Loader from '../components/Loader/Loader.jsx'
import { Bot, Eye, EyeOff } from 'lucide-react'

const Register = () => {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm] = useState({ name:'', email:'', password:'', confirmPassword:'', role:'user' })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [apiError, setApiError] = useState('')

  const validate = () => {
    const e = {}
    if (!form.name.trim())   e.name    = 'Full name is required'
    if (!form.email.trim())  e.email   = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password)      e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Minimum 6 characters'
    if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match'
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
      const res = await authAPI.register({ name:form.name, email:form.email, password:form.password, role:form.role })
      login(res.data.user, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-primary)', padding:24, position:'relative' }}>
      <div className="bg-grid" />
      <div style={{ position:'fixed', top:'-15%', right:'-10%', width:500, height:500, background:'radial-gradient(circle,rgba(108,99,255,0.12) 0%,transparent 70%)', pointerEvents:'none' }} />

      <div className="animate-fade-up" style={{
        background:'var(--bg-card)', border:'1px solid var(--border-color)',
        borderRadius:20, padding:'40px 36px', width:'100%', maxWidth:440,
        position:'relative', zIndex:1, boxShadow:'0 4px 24px rgba(0,0,0,0.4)'
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:28 }}>
          <div style={{ width:44, height:44, background:'linear-gradient(135deg,var(--accent-primary),var(--accent-secondary))', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>
            <Bot size={26} />
          </div>
          <span style={{ fontSize:'1.3rem', fontWeight:700 }}>TicketAI</span>
        </div>

        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:'1.7rem', fontWeight:700, marginBottom:6 }}>Create account</h1>
          <p style={{ color:'var(--text-secondary)', fontSize:'0.9rem' }}>Join the AI-powered complaint management platform</p>
        </div>

        {apiError && <div className="api-error">{apiError}</div>}

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
              <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Min. 6 characters" style={{ paddingRight:44 }} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position:'absolute', right:12, background:'transparent', color:'var(--text-muted)', display:'flex', alignItems:'center' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter password" />
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
          </div>

          <div className="form-group">
            <label>Account Type</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="user">User — Submit complaints</option>
              <option value="admin">Admin — Manage tickets</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop:4 }}>
            {loading ? <Loader size="sm" /> : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:22, fontSize:'0.88rem', color:'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color:'var(--accent-primary)', fontWeight:600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
