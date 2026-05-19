import React, { useState } from 'react'
import Navbar from '../components/Navbar/Navbar.jsx'
import Sidebar from '../components/Sidebar/Sidebar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getInitials } from '../utils/helpers.js'
import { User, Mail, Shield, Save } from 'lucide-react'
import Loader from '../components/Loader/Loader.jsx'

const Profile = () => {
  const { user } = useAuth()
  const [form, setForm]     = useState({ name: user?.name || '', email: user?.email || '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000)) // mock save
    setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="page-wrapper">
      <div className="bg-grid" />
      <Sidebar />
      <div className="main-content">
        <Navbar pageTitle="My Profile" />

        <div className="animate-fade-up" style={{ maxWidth:700 }}>
          <div style={{ marginBottom:28 }}>
            <h2 style={{ fontSize:'1.6rem', fontWeight:700, marginBottom:4 }}>My Profile</h2>
            <p style={{ color:'var(--text-secondary)' }}>Manage your account information</p>
          </div>

          {/* Avatar card */}
          <div className="card" style={{ padding:28, marginBottom:20, display:'flex', alignItems:'center', gap:24 }}>
            <div style={{ width:72, height:72, background:'linear-gradient(135deg,var(--accent-primary),#8b84ff)', borderRadius:18, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', fontWeight:700, color:'#fff', flexShrink:0 }}>
              {getInitials(user?.name)}
            </div>
            <div>
              <h3 style={{ fontSize:'1.2rem', fontWeight:700, marginBottom:4 }}>{user?.name}</h3>
              <p style={{ color:'var(--text-secondary)', fontSize:'0.9rem', marginBottom:8 }}>{user?.email}</p>
              <span style={{ background:'rgba(108,99,255,0.15)', color:'var(--accent-primary)', border:'1px solid rgba(108,99,255,0.3)', borderRadius:20, padding:'3px 12px', fontSize:'0.78rem', fontWeight:600, fontFamily:'var(--font-mono)', textTransform:'capitalize' }}>
                <Shield size={11} style={{ display:'inline', marginRight:4 }} />{user?.role || 'user'}
              </span>
            </div>
          </div>

          {/* Edit form */}
          <div className="card" style={{ padding:28 }}>
            <h3 style={{ fontSize:'1rem', fontWeight:700, marginBottom:20, paddingBottom:16, borderBottom:'1px solid var(--border-color)' }}>Account Details</h3>

            {saved && (
              <div style={{ background:'rgba(0,229,160,0.1)', border:'1px solid rgba(0,229,160,0.3)', color:'var(--accent-success)', borderRadius:8, padding:'10px 14px', fontSize:'0.87rem', marginBottom:20 }}>
                ✅ Profile updated successfully!
              </div>
            )}

            <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div className="form-group">
                <label><User size={12} style={{ display:'inline', marginRight:6 }} />Full Name</label>
                <input value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} placeholder="Your full name" />
              </div>

              <div className="form-group">
                <label><Mail size={12} style={{ display:'inline', marginRight:6 }} />Email Address</label>
                <input type="email" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} placeholder="your@email.com" />
              </div>

              <div className="form-group">
                <label><Shield size={12} style={{ display:'inline', marginRight:6 }} />Account Role</label>
                <input value={capitalize(user?.role || 'user')} disabled style={{ opacity:0.6, cursor:'not-allowed' }} />
                <p style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginTop:4 }}>Role cannot be changed here. Contact admin.</p>
              </div>

              <button type="submit" className="btn-primary" disabled={saving} style={{ marginTop:4 }}>
                {saving ? <Loader size="sm" /> : <><Save size={15} /> Save Changes</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// helper needed locally
const capitalize = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : ''

export default Profile
