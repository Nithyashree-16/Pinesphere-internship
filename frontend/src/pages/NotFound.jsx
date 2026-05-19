import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-primary)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, textAlign:'center', padding:24 }}>
      <div className="bg-grid" />
      <p style={{ fontSize:'6rem', fontFamily:'var(--font-mono)', fontWeight:700, color:'var(--accent-primary)', lineHeight:1 }}>404</p>
      <h2 style={{ fontSize:'1.5rem', fontWeight:700 }}>Page Not Found</h2>
      <p style={{ color:'var(--text-secondary)', maxWidth:300, lineHeight:1.6 }}>The page you're looking for doesn't exist or has been moved.</p>
      <button className="btn-primary" style={{ width:'auto', padding:'12px 28px', marginTop:8 }} onClick={() => navigate('/dashboard')}>
        Go to Dashboard
      </button>
    </div>
  )
}

export default NotFound
