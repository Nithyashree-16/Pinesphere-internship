import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar.jsx'
import Sidebar from '../components/Sidebar/Sidebar.jsx'
import Loader from '../components/Loader/Loader.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { ticketAPI } from '../services/api.js'
import { formatDate, priorityColor, statusBadgeClass, capitalize } from '../utils/helpers.js'
import { PlusCircle, Ticket, Clock, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react'

const MOCK = [
  { _id:'1', title:'Login page not loading on mobile', description:'Blank white screen on Chrome Android.', category:'Technical Issue', priority:'high', status:'open', createdAt:new Date().toISOString() },
  { _id:'2', title:'Incorrect billing amount charged', description:'Charged ₹2000 instead of ₹1000.', category:'Billing', priority:'critical', status:'in-progress', createdAt:new Date(Date.now()-86400000).toISOString() },
  { _id:'3', title:'Request to add dark mode', description:'Dark mode for accessibility.', category:'Feature Request', priority:'low', status:'closed', createdAt:new Date(Date.now()-2*86400000).toISOString() },
]

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ticketAPI.myTickets()
      .then(r => setTickets(r.data))
      .catch(() => setTickets(MOCK))
      .finally(() => setLoading(false))
  }, [])

  const stats = [
    { label:'Total Tickets',  value:tickets.length,                                    color:'var(--accent-primary)',   icon:<Ticket size={20}/>,        path:'/my-tickets' },
    { label:'Open',           value:tickets.filter(t=>t.status==='open').length,        color:'var(--accent-secondary)', icon:<Clock size={20}/>,         path:'/my-tickets' },
    { label:'In Progress',    value:tickets.filter(t=>t.status==='in-progress').length, color:'var(--accent-warning)',   icon:<AlertTriangle size={20}/>, path:'/my-tickets' },
    { label:'Resolved',       value:tickets.filter(t=>t.status==='closed').length,      color:'var(--accent-success)',   icon:<CheckCircle size={20}/>,   path:'/my-tickets' },
  ]

  // Category breakdown
  const categories = tickets.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1
    return acc
  }, {})

  const topCategories = Object.entries(categories)
    .sort((a,b) => b[1]-a[1])
    .slice(0,4)

  return (
    <div className="page-wrapper">
      <div className="bg-grid" />
      <Sidebar />
      <div className="main-content">
        <Navbar pageTitle="Dashboard" />

        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:80 }}>
            <Loader size="lg" text="Loading dashboard…" />
          </div>
        ) : (
          <div className="animate-fade-up">

            {/* Welcome banner */}
            <div style={{ background:'linear-gradient(135deg,rgba(108,99,255,0.2),rgba(0,212,255,0.1))', border:'1px solid rgba(108,99,255,0.3)', borderRadius:20, padding:'28px 32px', marginBottom:28, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
              <div>
                <h2 style={{ fontSize:'1.7rem', fontWeight:700, marginBottom:6 }}>Welcome back, {user?.name}! 👋</h2>
                <p style={{ color:'var(--text-secondary)', fontSize:'0.95rem' }}>Here's your complaint & ticket overview for today.</p>
              </div>
              <button className="btn-primary" style={{ width:'auto', padding:'12px 24px' }} onClick={() => navigate('/create-ticket')}>
                <PlusCircle size={16} /> New Ticket
              </button>
            </div>

            {/* Stats cards */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, marginBottom:28 }}>
              {stats.map(s => (
                <div key={s.label} className="card" onClick={() => navigate(s.path)}
                  style={{ padding:'20px 24px', cursor:'pointer', display:'flex', flexDirection:'column', gap:12 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.8px', fontWeight:600 }}>{s.label}</p>
                    <span style={{ color:s.color, opacity:0.8 }}>{s.icon}</span>
                  </div>
                  <p style={{ fontSize:'2.4rem', fontWeight:700, color:s.color, fontFamily:'var(--font-mono)', lineHeight:1 }}>{s.value}</p>
                  <p style={{ fontSize:'0.78rem', color:'var(--text-muted)', display:'flex', alignItems:'center', gap:4 }}>
                    View all <ArrowRight size={12}/>
                  </p>
                </div>
              ))}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:24, alignItems:'start', flexWrap:'wrap' }}>

              {/* Recent tickets */}
              <div className="card" style={{ padding:28 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                  <h3 style={{ fontSize:'1rem', fontWeight:700 }}>Recent Tickets</h3>
                  <button onClick={() => navigate('/my-tickets')} style={{ background:'transparent', color:'var(--accent-primary)', fontSize:'0.85rem', fontWeight:500, display:'flex', alignItems:'center', gap:4, cursor:'pointer' }}>
                    View all <ArrowRight size={14}/>
                  </button>
                </div>

                {tickets.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'32px 0', color:'var(--text-muted)' }}>
                    <Ticket size={40} style={{ marginBottom:12, opacity:0.4 }}/>
                    <p>No tickets yet.</p>
                    <button className="btn-primary" style={{ width:'auto', marginTop:16, padding:'10px 20px', fontSize:'0.88rem' }} onClick={() => navigate('/create-ticket')}>
                      Create your first ticket
                    </button>
                  </div>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    {tickets.slice(0,5).map(t => (
                      <div key={t._id}
                        onClick={() => navigate(`/ticket/${t._id}`)}
                        style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 16px', background:'var(--bg-input)', borderRadius:10, cursor:'pointer', border:'1px solid var(--border-color)', transition:'var(--transition)' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(108,99,255,0.4)'; e.currentTarget.style.background='var(--bg-card-hover)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-color)'; e.currentTarget.style.background='var(--bg-input)' }}
                      >
                        <div style={{ flex:1, minWidth:0 }}>
                          <p style={{ fontWeight:500, fontSize:'0.9rem', marginBottom:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.title}</p>
                          <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>{t.category} · {formatDate(t.createdAt)}</p>
                        </div>
                        <div style={{ display:'flex', gap:8, alignItems:'center', marginLeft:12, flexShrink:0 }}>
                          <span style={{ fontSize:'0.72rem', fontWeight:600, color:priorityColor[t.priority], fontFamily:'var(--font-mono)', textTransform:'uppercase' }}>{t.priority}</span>
                          <span className={`badge ${statusBadgeClass[t.status]||'badge-open'}`}>{capitalize(t.status)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right column */}
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

                {/* Quick actions */}
                <div className="card" style={{ padding:22 }}>
                  <h3 style={{ fontSize:'0.9rem', fontWeight:700, marginBottom:16, textTransform:'uppercase', letterSpacing:'0.8px', color:'var(--text-muted)' }}>Quick Actions</h3>
                  <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    {[
                      { label:'Submit New Complaint', path:'/create-ticket', color:'var(--accent-primary)', bg:'rgba(108,99,255,0.1)' },
                      { label:'View All My Tickets',  path:'/my-tickets',    color:'var(--accent-secondary)', bg:'rgba(0,212,255,0.08)' },
                    ].map(a => (
                      <button key={a.label} onClick={() => navigate(a.path)}
                        style={{ background:a.bg, border:`1px solid ${a.color}30`, color:a.color, borderRadius:10, padding:'12px 16px', fontWeight:600, fontSize:'0.88rem', cursor:'pointer', transition:'var(--transition)', display:'flex', alignItems:'center', justifyContent:'space-between' }}
                        onMouseEnter={e => e.currentTarget.style.background=a.bg.replace('0.1','0.2').replace('0.08','0.15')}
                        onMouseLeave={e => e.currentTarget.style.background=a.bg}
                      >
                        {a.label} <ArrowRight size={15}/>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category breakdown */}
                {topCategories.length > 0 && (
                  <div className="card" style={{ padding:22 }}>
                    <h3 style={{ fontSize:'0.9rem', fontWeight:700, marginBottom:16, textTransform:'uppercase', letterSpacing:'0.8px', color:'var(--text-muted)' }}>By Category</h3>
                    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                      {topCategories.map(([cat, count]) => (
                        <div key={cat}>
                          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                            <span style={{ fontSize:'0.82rem', color:'var(--text-secondary)' }}>{cat}</span>
                            <span style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--accent-primary)', fontFamily:'var(--font-mono)' }}>{count}</span>
                          </div>
                          <div style={{ height:6, background:'var(--bg-input)', borderRadius:3, overflow:'hidden' }}>
                            <div style={{ height:'100%', width:`${(count/tickets.length)*100}%`, background:'linear-gradient(90deg,var(--accent-primary),var(--accent-secondary))', borderRadius:3, transition:'width 0.8s ease' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status tip */}
                <div style={{ background:'rgba(0,229,160,0.08)', border:'1px solid rgba(0,229,160,0.2)', borderRadius:12, padding:'16px 18px' }}>
                  <p style={{ fontSize:'0.82rem', color:'var(--accent-success)', fontWeight:600, marginBottom:4 }}>💡 Pro Tip</p>
                  <p style={{ fontSize:'0.8rem', color:'var(--text-secondary)', lineHeight:1.5 }}>
                    Describe your issue in detail when creating a ticket — our AI will automatically classify the category and priority for faster resolution!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
