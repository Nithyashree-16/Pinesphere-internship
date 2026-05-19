import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar.jsx'
import Sidebar from '../components/Sidebar/Sidebar.jsx'
import Loader from '../components/Loader/Loader.jsx'
import TicketCard from '../components/TicketCard/TicketCard.jsx'
import { ticketAPI } from '../services/api.js'
import { PlusCircle, Inbox, RefreshCw } from 'lucide-react'

const MOCK = [
  { _id:'1', title:'Login page not loading on mobile', description:'When I try to access the login page on my mobile browser, it shows a blank white screen. This started after the last update.', category:'Technical Issue', priority:'high', status:'open', createdAt: new Date().toISOString() },
  { _id:'2', title:'Incorrect billing amount charged', description:'I was charged ₹2000 instead of ₹1000 for my monthly plan. Please check and refund the extra amount.', category:'Billing', priority:'critical', status:'in-progress', createdAt: new Date(Date.now()-86400000).toISOString() },
  { _id:'3', title:'Request to add dark mode', description:'It would be great if the platform supported dark mode for better accessibility and reduced eye strain.', category:'Feature Request', priority:'low', status:'closed', createdAt: new Date(Date.now()-2*86400000).toISOString() },
]

const STATUS_FILTERS   = ['All','open','in-progress','closed']
const PRIORITY_FILTERS = ['All','low','medium','high','critical']

const MyTickets = () => {
  const navigate = useNavigate()
  const [tickets, setTickets]         = useState([])
  const [loading, setLoading]         = useState(true)
  const [statusFilter, setStatusFilter]     = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [search, setSearch]           = useState('')

  const fetchTickets = async () => {
    setLoading(true)
    try {
      const res = await ticketAPI.myTickets()
      setTickets(res.data)
    } catch { setTickets(MOCK) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchTickets() }, [])

  const filtered = tickets.filter(t => {
    const ms = statusFilter   === 'All' || t.status   === statusFilter
    const mp = priorityFilter === 'All' || t.priority === priorityFilter
    const mq = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase())
    return ms && mp && mq
  })

  const stats = {
    total:      tickets.length,
    open:       tickets.filter(t=>t.status==='open').length,
    inProgress: tickets.filter(t=>t.status==='in-progress').length,
    closed:     tickets.filter(t=>t.status==='closed').length,
  }

  const pillStyle = (active) => ({
    padding:'5px 14px', borderRadius:20, fontSize:'0.82rem', fontWeight: active?600:500,
    border: active ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
    background: active ? 'rgba(108,99,255,0.15)' : 'transparent',
    color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
    cursor:'pointer', transition:'var(--transition)'
  })

  return (
    <div className="page-wrapper">
      <div className="bg-grid" />
      <Sidebar />
      <div className="main-content">
        <Navbar pageTitle="My Tickets" />

        <div className="animate-fade-up" style={{ maxWidth:1000 }}>
          {/* Header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24, flexWrap:'wrap', gap:16 }}>
            <div>
              <h2 style={{ fontSize:'1.6rem', fontWeight:700, marginBottom:4 }}>My Tickets</h2>
              <p style={{ color:'var(--text-secondary)', fontSize:'0.9rem' }}>Track and manage all your submitted complaints</p>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button className="btn-icon" onClick={fetchTickets}><RefreshCw size={16} /></button>
              <button className="btn-primary" style={{ width:'auto', padding:'10px 20px', fontSize:'0.88rem' }} onClick={() => navigate('/create-ticket')}>
                <PlusCircle size={16} /> New Ticket
              </button>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap' }}>
            {[
              { label:'Total', value:stats.total, color:'var(--text-primary)' },
              { label:'Open', value:stats.open, color:'var(--accent-secondary)' },
              { label:'In Progress', value:stats.inProgress, color:'var(--accent-warning)' },
              { label:'Closed', value:stats.closed, color:'var(--accent-success)' },
            ].map(s => (
              <div key={s.label} className="card" style={{ padding:'12px 20px', display:'flex', flexDirection:'column', alignItems:'center', gap:2, minWidth:90 }}>
                <span style={{ fontSize:'1.6rem', fontWeight:700, fontFamily:'var(--font-mono)', color:s.color }}>{s.value}</span>
                <span style={{ fontSize:'0.72rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.8px', fontWeight:600 }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="card" style={{ padding:'18px 20px', marginBottom:28, display:'flex', flexDirection:'column', gap:14 }}>
            <input type="text" placeholder="Search your tickets…" value={search} onChange={e=>setSearch(e.target.value)} style={{ fontSize:'0.9rem', height:40 }} />
            <div style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
              <p style={{ fontSize:'0.78rem', fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.8px', width:56, flexShrink:0 }}>Status</p>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {STATUS_FILTERS.map(s => (
                  <button key={s} style={pillStyle(statusFilter===s)} onClick={()=>setStatusFilter(s)}>
                    {s==='All'?'All':s.charAt(0).toUpperCase()+s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
              <p style={{ fontSize:'0.78rem', fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.8px', width:56, flexShrink:0 }}>Priority</p>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {PRIORITY_FILTERS.map(p => (
                  <button key={p} style={pillStyle(priorityFilter===p)} onClick={()=>setPriorityFilter(p)}>
                    {p==='All'?'All':p.charAt(0).toUpperCase()+p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List */}
          {loading ? (
            <div style={{ display:'flex', justifyContent:'center', padding:60 }}><Loader size="lg" text="Loading tickets…" /></div>
          ) : filtered.length === 0 ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12, minHeight:300, color:'var(--text-muted)', textAlign:'center' }}>
              <Inbox size={48} />
              <h3 style={{ fontSize:'1.1rem', fontWeight:600, color:'var(--text-secondary)' }}>No tickets found</h3>
              <p style={{ fontSize:'0.9rem', maxWidth:300, lineHeight:1.5 }}>
                {tickets.length === 0 ? "You haven't submitted any tickets yet." : 'No tickets match your filters.'}
              </p>
              {tickets.length === 0 && (
                <button className="btn-primary" style={{ width:'auto', marginTop:8 }} onClick={() => navigate('/create-ticket')}>
                  <PlusCircle size={15} /> Create your first ticket
                </button>
              )}
            </div>
          ) : (
            <>
              <p style={{ fontSize:'0.85rem', color:'var(--text-muted)', marginBottom:16 }}>
                Showing <strong style={{ color:'var(--text-secondary)' }}>{filtered.length}</strong> of <strong style={{ color:'var(--text-secondary)' }}>{tickets.length}</strong> tickets
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {filtered.map((ticket, i) => (
                  <div key={ticket._id} className="animate-fade-up" style={{ animationDelay:`${i*0.06}s` }}>
                    <TicketCard ticket={ticket} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyTickets
