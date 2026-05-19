import React from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { getInitials } from '../../utils/helpers.js'
import { Bell, Search } from 'lucide-react'

const Navbar = ({ pageTitle = 'Dashboard' }) => {
  const { user, logout } = useAuth()

  return (
    <header style={{
      position:'fixed', top:0, left:260, right:0, height:70,
      background:'rgba(10,14,26,0.9)', backdropFilter:'blur(12px)',
      borderBottom:'1px solid var(--border-color)',
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0 32px', zIndex:100
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:24 }}>
        <h2 style={{ fontSize:'1.1rem', fontWeight:600 }}>{pageTitle}</h2>
        <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
          <Search size={15} style={{ position:'absolute', left:12, color:'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search tickets..."
            style={{ paddingLeft:36, borderRadius:24, width:260, fontSize:'0.88rem', height:38 }}
          />
        </div>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
        <button style={{
          position:'relative', background:'var(--bg-input)', border:'1px solid var(--border-color)',
          borderRadius:10, padding:'8px 10px', color:'var(--text-secondary)',
          display:'flex', alignItems:'center'
        }}>
          <Bell size={17} />
          <span style={{
            position:'absolute', top:7, right:7, width:7, height:7,
            background:'var(--accent-danger)', borderRadius:'50%', border:'2px solid var(--bg-primary)'
          }} />
        </button>

        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{
            width:38, height:38,
            background:'linear-gradient(135deg,var(--accent-primary),#8b84ff)',
            borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight:700, fontSize:'0.85rem', color:'#fff'
          }}>
            {getInitials(user?.name)}
          </div>
          <div style={{ lineHeight:1.3 }}>
            <p style={{ fontSize:'0.88rem', fontWeight:600 }}>{user?.name || 'User'}</p>
            <p style={{ fontSize:'0.72rem', color:'var(--text-muted)', textTransform:'capitalize' }}>{user?.role}</p>
          </div>
          <button onClick={logout} style={{
            background:'transparent', color:'var(--accent-danger)',
            border:'1px solid rgba(255,77,109,0.3)', borderRadius:8,
            padding:'6px 14px', fontSize:'0.8rem', fontWeight:500
          }}>
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
