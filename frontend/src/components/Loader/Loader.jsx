import React from 'react'

const Loader = ({ fullScreen = false, size = 'md', text = '' }) => {
  const px = { sm: 20, md: 36, lg: 56 }[size] || 36

  const spinner = (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
      <div style={{
        width: px, height: px,
        border: '3px solid rgba(108,99,255,0.2)',
        borderTop: '3px solid #6c63ff',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      {text && <p style={{ color:'var(--text-secondary)', fontSize:'0.85rem', fontFamily:'var(--font-mono)' }}>{text}</p>}
    </div>
  )

  if (fullScreen) return (
    <div style={{ position:'fixed', inset:0, background:'var(--bg-primary)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999 }}>
      {spinner}
    </div>
  )

  return spinner
}

export default Loader
