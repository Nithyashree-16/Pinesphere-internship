import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar/Navbar.jsx'
import Sidebar from '../components/Sidebar/Sidebar.jsx'
import Loader from '../components/Loader/Loader.jsx'
import { ticketAPI } from '../services/api.js'
import { formatDate, priorityColor, statusBadgeClass, capitalize } from '../utils/helpers.js'
import { Users, Ticket, CheckCircle, Clock, AlertTriangle, RefreshCw, Search, X, Edit2, Trash2, LayoutList, LayoutGrid } from 'lucide-react'

const MOCK_TICKETS = [
  { _id:'1', title:'Login page not loading on mobile', description:'Blank white screen on Chrome Android after last update.', category:'Technical Issue', priority:'high', status:'open', createdAt:new Date().toISOString(), user:{ name:'Visrutha K', email:'visrutha@example.com' } },
  { _id:'2', title:'Incorrect billing amount charged', description:'Charged ₹2000 instead of ₹1000 for monthly plan.', category:'Billing', priority:'critical', status:'in-progress', createdAt:new Date(Date.now()-86400000).toISOString(), user:{ name:'Ravi Kumar', email:'ravi@example.com' } },
  { _id:'3', title:'Request to add dark mode', description:'Dark mode for better accessibility.', category:'Feature Request', priority:'low', status:'closed', createdAt:new Date(Date.now()-2*86400000).toISOString(), user:{ name:'Priya S', email:'priya@example.com' } },
  { _id:'4', title:'Cannot reset password', description:'Password reset email not being received.', category:'Account Access', priority:'high', status:'open', createdAt:new Date(Date.now()-3*86400000).toISOString(), user:{ name:'Arjun M', email:'arjun@example.com' } },
  { _id:'5', title:'Service outage on Chennai servers', description:'Complete outage from multiple users in Chennai region.', category:'Service Outage', priority:'critical', status:'in-progress', createdAt:new Date(Date.now()-4*86400000).toISOString(), user:{ name:'Nithya R', email:'nithya@example.com' } },
  { _id:'6', title:'App crashes on file upload', description:'App crashes whenever a file larger than 5MB is uploaded.', category:'Technical Issue', priority:'medium', status:'open', createdAt:new Date(Date.now()-5*86400000).toISOString(), user:{ name:'Mrittika D', email:'mrittika@example.com' } },
]

const STATUS_OPTIONS   = ['All','open','in-progress','closed']
const PRIORITY_OPTIONS = ['All','low','medium','high','critical']

// ── Edit Modal ────────────────────────────────────────────────
const EditModal = ({ ticket, onClose, onUpdate }) => {
  const [status, setStatus]     = useState(ticket.status)
  const [priority, setPriority] = useState(ticket.priority)
  const [saving, setSaving]     = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try { await ticketAPI.update(ticket._id, { status, priority }) } catch {}
    onUpdate(ticket._id, { status, priority })
    setSaving(false)
    onClose()
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, backdropFilter:'blur(4px)' }}>
      <div className="animate-fade-up" style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:20, padding:32, width:'100%', maxWidth:440, position:'relative' }}>
        <button onClick={onClose} style={{ position:'absolute', top:16, right:16, background:'transparent', color:'var(--text-muted)', display:'flex', alignItems:'center', cursor:'pointer' }}>
          <X size={20} />
        </button>
        <h3 style={{ fontSize:'1.1rem', fontWeight:700, marginBottom:6 }}>Update Ticket</h3>
        <p style={{ color:'var(--text-secondary)', fontSize:'0.88rem', marginBottom:24, lineHeight:1.5 }}>{ticket.title}</p>
        <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
          <div className="form-group">
            <label>Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select value={priority} onChange={e => setPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div style={{ display:'flex', gap:10, marginTop:4 }}>
            <button className="btn-secondary" onClick={onClose} style={{ flex:1 }}>Cancel</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ flex:1 }}>
              {saving ? <Loader size="sm" /> : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Delete Modal ──────────────────────────────────────────────
const DeleteModal = ({ ticket, onClose, onDelete }) => {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try { await ticketAPI.delete(ticket._id) } catch {}
    onDelete(ticket._id)
    setDeleting(false)
    onClose()
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, backdropFilter:'blur(4px)' }}>
      <div className="animate-fade-up" style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:20, padding:32, width:'100%', maxWidth:400, textAlign:'center' }}>
        <div style={{ fontSize:'3rem', marginBottom:12 }}>🗑️</div>
        <h3 style={{ fontSize:'1.1rem', fontWeight:700, marginBottom:8 }}>Delete Ticket?</h3>
        <p style={{ color:'var(--text-secondary)', fontSize:'0.88rem', marginBottom:24, lineHeight:1.5 }}>
          This will permanently delete <strong>"{ticket.title}"</strong>. This cannot be undone.
        </p>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn-secondary" onClick={onClose} style={{ flex:1 }}>Cancel</button>
          <button onClick={handleDelete} disabled={deleting} style={{ flex:1, background:'var(--accent-danger)', color:'#fff', border:'none', borderRadius:8, padding:'12px', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6, transition:'var(--transition)' }}>
            {deleting ? <Loader size="sm" /> : <><Trash2 size={15} /> Delete</>}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────
const AdminDashboard = () => {
  const [tickets, setTickets]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [statusFilter, setStatus]   = useState('All')
  const [priorityFilter, setPriority] = useState('All')
  const [editTicket, setEditTicket] = useState(null)
  const [deleteTicket, setDeleteTicket] = useState(null)
  const [view, setView]             = useState('table')

  const fetchTickets = async () => {
    setLoading(true)
    try {
      const res = await ticketAPI.getAll()
      setTickets(res.data)
    } catch { setTickets(MOCK_TICKETS) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchTickets() }, [])

  const handleUpdate = (id, changes) =>
    setTickets(prev => prev.map(t => t._id === id ? { ...t, ...changes } : t))

  const handleDelete = (id) =>
    setTickets(prev => prev.filter(t => t._id !== id))

  const filtered = tickets.filter(t => {
    const ms = statusFilter   === 'All' || t.status   === statusFilter
    const mp = priorityFilter === 'All' || t.priority === priorityFilter
    const mq = !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.category?.toLowerCase().includes(search.toLowerCase())
    return ms && mp && mq
  })

  const stats = [
    { label:'Total',       value:tickets.length,                                    color:'var(--accent-primary)',   icon:<Ticket size={18}/> },
    { label:'Open',        value:tickets.filter(t=>t.status==='open').length,        color:'var(--accent-secondary)', icon:<Clock size={18}/> },
    { label:'In Progress', value:tickets.filter(t=>t.status==='in-progress').length, color:'var(--accent-warning)',   icon:<RefreshCw size={18}/> },
    { label:'Closed',      value:tickets.filter(t=>t.status==='closed').length,      color:'var(--accent-success)',   icon:<CheckCircle size={18}/> },
    { label:'Critical',    value:tickets.filter(t=>t.priority==='critical').length,  color:'var(--accent-danger)',    icon:<AlertTriangle size={18}/> },
    { label:'Users',       value:[...new Set(tickets.map(t=>t.user?.email).filter(Boolean))].length, color:'#a78bfa', icon:<Users size={18}/> },
  ]

  const pillStyle = (active) => ({
    padding:'4px 12px', borderRadius:20, fontSize:'0.8rem', fontWeight:active?600:400,
    border:active?'1px solid var(--accent-primary)':'1px solid var(--border-color)',
    background:active?'rgba(108,99,255,0.15)':'transparent',
    color:active?'var(--accent-primary)':'var(--text-secondary)',
    cursor:'pointer', transition:'var(--transition)'
  })

  return (
    <div className="page-wrapper">
      <div className="bg-grid" />
      <Sidebar />
      <div className="main-content">
        <Navbar pageTitle="Admin Dashboard" />

        {editTicket   && <EditModal   ticket={editTicket}   onClose={()=>setEditTicket(null)}   onUpdate={handleUpdate} />}
        {deleteTicket && <DeleteModal ticket={deleteTicket} onClose={()=>setDeleteTicket(null)} onDelete={handleDelete} />}

        <div className="animate-fade-up">
          {/* Header */}
          <div style={{ marginBottom:28 }}>
            <h2 style={{ fontSize:'1.6rem', fontWeight:700, marginBottom:4 }}>Admin Panel</h2>
            <p style={{ color:'var(--text-secondary)' }}>Manage all complaints, update status, and monitor the system</p>
          </div>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:14, marginBottom:28 }}>
            {stats.map(s => (
              <div key={s.label} className="card" style={{ padding:'16px 20px', display:'flex', flexDirection:'column', gap:10 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <p style={{ fontSize:'0.72rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.8px', fontWeight:600 }}>{s.label}</p>
                  <span style={{ color:s.color, opacity:0.8 }}>{s.icon}</span>
                </div>
                <p style={{ fontSize:'2rem', fontWeight:700, color:s.color, fontFamily:'var(--font-mono)', lineHeight:1 }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="card" style={{ padding:'18px 20px', marginBottom:24, display:'flex', flexDirection:'column', gap:14 }}>
            {/* Search row */}
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <div style={{ position:'relative', flex:1 }}>
                <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
                <input type="text" placeholder="Search by title, user or category…" value={search} onChange={e=>setSearch(e.target.value)} style={{ paddingLeft:36, height:40, fontSize:'0.88rem' }} />
              </div>
              <button className="btn-icon" onClick={fetchTickets} title="Refresh"><RefreshCw size={15} /></button>
              <button className="btn-icon" onClick={()=>setView(v=>v==='table'?'cards':'table')} title="Toggle view">
                {view==='table' ? <LayoutGrid size={15}/> : <LayoutList size={15}/>}
              </button>
            </div>

            {/* Status pills */}
            <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
              <p style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.8px', width:56, flexShrink:0 }}>Status</p>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {STATUS_OPTIONS.map(s => <button key={s} style={pillStyle(statusFilter===s)} onClick={()=>setStatus(s)}>{s==='All'?'All':capitalize(s)}</button>)}
              </div>
            </div>

            {/* Priority pills */}
            <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
              <p style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.8px', width:56, flexShrink:0 }}>Priority</p>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {PRIORITY_OPTIONS.map(p => <button key={p} style={pillStyle(priorityFilter===p)} onClick={()=>setPriority(p)}>{p==='All'?'All':capitalize(p)}</button>)}
              </div>
            </div>
          </div>

          {/* Count */}
          <p style={{ fontSize:'0.85rem', color:'var(--text-muted)', marginBottom:16 }}>
            Showing <strong style={{ color:'var(--text-secondary)' }}>{filtered.length}</strong> of <strong style={{ color:'var(--text-secondary)' }}>{tickets.length}</strong> tickets
          </p>

          {/* List */}
          {loading ? (
            <div style={{ display:'flex', justifyContent:'center', padding:60 }}>
              <Loader size="lg" text="Loading tickets…" />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12, minHeight:240, justifyContent:'center', color:'var(--text-muted)', textAlign:'center' }}>
              <Ticket size={48} />
              <p style={{ fontSize:'1rem', fontWeight:600, color:'var(--text-secondary)' }}>No tickets match your filters</p>
            </div>

          ) : view === 'cards' ? (
            /* Cards view */
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {filtered.map(ticket => (
                <div key={ticket._id} style={{ position:'relative' }}>
                  <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:20, padding:'22px 24px', display:'flex', flexDirection:'column', gap:10 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <span className={`badge ${statusBadgeClass[ticket.status]||'badge-open'}`}>{capitalize(ticket.status)}</span>
                      <div style={{ display:'flex', gap:8 }}>
                        <button className="btn-icon" style={{ width:32, height:32 }} onClick={()=>setEditTicket(ticket)} title="Edit"><Edit2 size={13}/></button>
                        <button className="btn-icon" style={{ width:32, height:32, color:'var(--accent-danger)', borderColor:'rgba(255,77,109,0.3)' }} onClick={()=>setDeleteTicket(ticket)} title="Delete"><Trash2 size={13}/></button>
                      </div>
                    </div>
                    <h3 style={{ fontSize:'1rem', fontWeight:600 }}>{ticket.title}</h3>
                    <p style={{ fontSize:'0.85rem', color:'var(--text-secondary)' }}>{ticket.description?.slice(0,100)}…</p>
                    <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
                      <span style={{ fontSize:'0.78rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>👤 {ticket.user?.name||'Unknown'}</span>
                      <span style={{ fontSize:'0.78rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>📁 {ticket.category}</span>
                      <span style={{ fontSize:'0.78rem', fontWeight:600, color:priorityColor[ticket.priority], fontFamily:'var(--font-mono)', textTransform:'uppercase' }}>⚡ {ticket.priority}</span>
                      <span style={{ fontSize:'0.78rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>📅 {formatDate(ticket.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          ) : (
            /* Table view */
            <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:16, overflow:'hidden' }}>
              {/* Header */}
              <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr 100px', padding:'12px 20px', background:'var(--bg-secondary)', borderBottom:'1px solid var(--border-color)' }}>
                {['Title','User','Category','Priority','Status','Actions'].map(h => (
                  <p key={h} style={{ fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', color:'var(--text-muted)' }}>{h}</p>
                ))}
              </div>

              {/* Rows */}
              {filtered.map((ticket, i) => (
                <div key={ticket._id}
                  style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr 100px', padding:'14px 20px', borderBottom:i<filtered.length-1?'1px solid var(--border-color)':'none', alignItems:'center', transition:'var(--transition)', cursor:'default' }}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--bg-card-hover)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                >
                  <div>
                    <p style={{ fontSize:'0.88rem', fontWeight:500, marginBottom:3 }}>{ticket.title}</p>
                    <p style={{ fontSize:'0.72rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>{formatDate(ticket.createdAt)}</p>
                  </div>
                  <p style={{ fontSize:'0.82rem', color:'var(--text-secondary)' }}>{ticket.user?.name||'—'}</p>
                  <p style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{ticket.category}</p>
                  <span style={{ fontSize:'0.75rem', fontWeight:600, color:priorityColor[ticket.priority], fontFamily:'var(--font-mono)', textTransform:'uppercase', display:'flex', alignItems:'center', gap:3 }}>
                    <AlertTriangle size={11}/>{ticket.priority}
                  </span>
                  <span className={`badge ${statusBadgeClass[ticket.status]||'badge-open'}`}>{capitalize(ticket.status)}</span>
                  <div style={{ display:'flex', gap:8 }}>
                    <button className="btn-icon" style={{ width:30, height:30 }} onClick={()=>setEditTicket(ticket)} title="Edit"><Edit2 size={13}/></button>
                    <button className="btn-icon" style={{ width:30, height:30, color:'var(--accent-danger)', borderColor:'rgba(255,77,109,0.3)' }} onClick={()=>setDeleteTicket(ticket)} title="Delete"><Trash2 size={13}/></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
