import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { LayoutDashboard, Ticket, PlusCircle, ShieldCheck, Bot, LogOut, User } from 'lucide-react'

const navItems = [
  { label:'Dashboard',  icon:LayoutDashboard, path:'/dashboard' },
  { label:'My Tickets', icon:Ticket,          path:'/my-tickets' },
  { label:'New Ticket', icon:PlusCircle,      path:'/create-ticket' },
  { label:'Profile',    icon:User,            path:'/profile' },
]

const linkStyle = (isActive) => ({
  display:'flex', alignItems:'center', gap:12,
  padding:'11px 14px', borderRadius:8,
  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
  background: isActive ? 'rgba(108,99,255,0.15)' : 'transparent',
  border: isActive ? '1px solid rgba(108,99,255,0.25)' : '1px solid transparent',
  fontSize:'0.9rem', fontWeight:500, textDecoration:'none',
  transition:'var(--transition)', cursor:'pointer', width:'100%'
})

const Sidebar = () => {
  const { user, logout } = useAuth()

  return (
    <aside style={{ position:'fixed', left:0, top:0, bottom:0, width:260, background:'var(--bg-secondary)', borderRight:'1px solid var(--border-color)', display:'flex', flexDirection:'column', padding:'24px 16px', zIndex:200, overflowY:'auto' }}>
      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'0 8px 4px' }}>
        <div style={{ width:42, height:42, background:'linear-gradient(135deg,var(--accent-primary),var(--accent-secondary))', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', boxShadow:'0 4px 14px rgba(108,99,255,0.35)', flexShrink:0 }}>
          <Bot size={22} />
        </div>
        <div>
          <p style={{ fontSize:'1.1rem', fontWeight:700, lineHeight:1.2 }}>TicketAI</p>
          <p style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>Complaint System</p>
        </div>
      </div>

      <div style={{ height:1, background:'var(--border-color)', margin:'16px 0' }} />

      {/* Nav */}
      <nav style={{ display:'flex', flexDirection:'column', gap:4, flex:1 }}>
        <p style={{ fontSize:'0.68rem', fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', color:'var(--text-muted)', padding:'0 12px', marginBottom:6 }}>Main Menu</p>

        {navItems.map(item => (
          <NavLink key={item.path} to={item.path} style={({ isActive }) => linkStyle(isActive)}>
            <item.icon size={18} /><span>{item.label}</span>
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <>
            <p style={{ fontSize:'0.68rem', fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', color:'var(--text-muted)', padding:'0 12px', marginTop:20, marginBottom:6 }}>Admin</p>
            <NavLink to="/admin" style={({ isActive }) => linkStyle(isActive)}>
              <ShieldCheck size={18} /><span>Admin Panel</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* User info + logout */}
      <div>
        <div style={{ height:1, background:'var(--border-color)', margin:'16px 0' }} />
        <div style={{ padding:'10px 14px', background:'var(--bg-card)', borderRadius:10, marginBottom:10, border:'1px solid var(--border-color)' }}>
          <p style={{ fontSize:'0.88rem', fontWeight:600, marginBottom:2 }}>{user?.name}</p>
          <p style={{ fontSize:'0.72rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)', textTransform:'capitalize' }}>{user?.role}</p>
        </div>
        <button onClick={logout} style={{ ...linkStyle(false), color:'var(--accent-danger)', border:'1px solid transparent' }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(255,77,109,0.08)'}
          onMouseLeave={e=>e.currentTarget.style.background='transparent'}
        >
          <LogOut size={18} /><span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
