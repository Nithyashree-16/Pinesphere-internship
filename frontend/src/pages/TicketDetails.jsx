import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar.jsx'
import Sidebar from '../components/Sidebar/Sidebar.jsx'
import Loader from '../components/Loader/Loader.jsx'
import { ticketAPI, aiAPI } from '../services/api.js'
import { formatDate, priorityColor, statusBadgeClass, capitalize } from '../utils/helpers.js'
import { ArrowLeft, Tag, AlertTriangle, Clock, Bot, Sparkles, RefreshCw } from 'lucide-react'

const MOCK = { _id:'1', title:'Login page not loading on mobile', description:'When I try to access the login page on my mobile browser (Chrome, Android 13), it shows a blank white screen. This started after the last update on 12th May. I have tried clearing cache and reinstalling the browser but the issue persists.', category:'Technical Issue', priority:'high', status:'in-progress', createdAt:new Date().toISOString(), updatedAt:new Date().toISOString(), assignedTo:'Support Team' }

const STATUS_STEPS = ['open','in-progress','closed']

const TicketDetails = () => {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket]       = useState(null)
  const [loading, setLoading]     = useState(true)
  const [aiSummary, setAiSummary] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError]     = useState('')

  useEffect(() => {
    ticketAPI.getById(id)
      .then(r => setTicket(r.data))
      .catch(() => setTicket(MOCK))
      .finally(() => setLoading(false))
  }, [id])

  const fetchSummary = async () => {
    setAiLoading(true); setAiError('')
    try {
      const res = await aiAPI.summarize(id)
      setAiSummary(res.data.summary)
    } catch { setAiError('Could not generate summary. Please try again.') }
    finally { setAiLoading(false) }
  }

  if (loading) return (
    <div className="page-wrapper"><Sidebar />
      <div className="main-content" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Loader size="lg" text="Loading ticket…" />
      </div>
    </div>
  )

  if (!ticket) return (
    <div className="page-wrapper"><Sidebar />
      <div className="main-content">
        <div className="api-error">Ticket not found.</div>
        <button className="btn-secondary" style={{ marginTop:16, width:'auto' }} onClick={() => navigate('/my-tickets')}>← Back</button>
      </div>
    </div>
  )

  const currentIdx = STATUS_STEPS.indexOf(ticket.status)

  return (
    <div className="page-wrapper">
      <div className="bg-grid" /><Sidebar />
      <div className="main-content">
        <Navbar pageTitle="Ticket Details" />
        <div className="animate-fade-up" style={{ maxWidth:1100 }}>

          <button onClick={() => navigate('/my-tickets')} style={{ display:'inline-flex', alignItems:'center', gap:6, background:'transparent', color:'var(--text-secondary)', fontSize:'0.88rem', fontWeight:500, marginBottom:24, padding:'6px 0', cursor:'pointer', transition:'var(--transition)' }}>
            <ArrowLeft size={16} /> Back to My Tickets
          </button>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:24, alignItems:'start' }}>
            {/* Left */}
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              {/* Header card */}
              <div className="card" style={{ padding:28 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                  <span className={`badge ${statusBadgeClass[ticket.status] || 'badge-open'}`}>{capitalize(ticket.status)}</span>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.78rem', color:'var(--text-muted)', background:'var(--bg-input)', border:'1px solid var(--border-color)', borderRadius:6, padding:'3px 10px' }}>#{ticket._id?.slice(-6)?.toUpperCase()}</span>
                </div>
                <h1 style={{ fontSize:'1.4rem', fontWeight:700, marginBottom:16, lineHeight:1.4 }}>{ticket.title}</h1>
                <div style={{ display:'flex', flexWrap:'wrap', gap:16 }}>
                  {[
                    { icon:<Tag size={13}/>,           text:ticket.category },
                    { icon:<AlertTriangle size={13}/>,  text:`${capitalize(ticket.priority)} Priority`, color:priorityColor[ticket.priority] },
                    { icon:<Clock size={13}/>,          text:`Submitted ${formatDate(ticket.createdAt)}` },
                  ].map((m,i) => (
                    <span key={i} style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.82rem', color:m.color||'var(--text-muted)', fontFamily:'var(--font-mono)' }}>
                      {m.icon}{m.text}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="card" style={{ padding:28 }}>
                <p style={{ fontSize:'0.88rem', fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'var(--text-muted)', marginBottom:16 }}>Description</p>
                <p style={{ fontSize:'0.95rem', color:'var(--text-secondary)', lineHeight:1.75, whiteSpace:'pre-wrap' }}>{ticket.description}</p>
              </div>

              {/* AI Summary */}
              <div className="card" style={{ padding:24 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18, paddingBottom:16, borderBottom:'1px solid var(--border-color)' }}>
                  <div style={{ width:36, height:36, background:'linear-gradient(135deg,var(--accent-primary),var(--accent-secondary))', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', flexShrink:0 }}>
                    <Bot size={18} />
                  </div>
                  <div style={{ flex:1 }}>
                    <h3 style={{ fontSize:'0.95rem', fontWeight:600, marginBottom:2 }}>AI Summary</h3>
                    <p style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>Auto-generated summary</p>
                  </div>
                  <button className="btn-icon" onClick={fetchSummary} disabled={aiLoading} title="Refresh">
                    <RefreshCw size={15} style={{ animation: aiLoading?'spin 0.8s linear infinite':'' }} />
                  </button>
                </div>

                {!aiSummary && !aiLoading && !aiError && (
                  <button onClick={fetchSummary} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:6, background:'rgba(108,99,255,0.1)', border:'1px dashed var(--accent-primary)', color:'var(--accent-primary)', borderRadius:8, padding:'10px 20px', fontSize:'0.88rem', fontWeight:500, cursor:'pointer', transition:'var(--transition)' }}>
                    <Sparkles size={15} /> Generate AI Summary
                  </button>
                )}
                {aiLoading && <div style={{ display:'flex', justifyContent:'center', padding:'16px 0' }}><Loader size="sm" text="Generating…" /></div>}
                {aiError  && <p className="error-text" style={{ marginTop:12 }}>{aiError}</p>}
                {aiSummary && !aiLoading && (
                  <div style={{ background:'var(--bg-input)', border:'1px solid var(--border-color)', borderRadius:8, padding:16 }} className="animate-fade-up">
                    <p style={{ fontSize:'0.9rem', color:'var(--text-secondary)', lineHeight:1.7 }}>{aiSummary}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right sidebar */}
            <div style={{ display:'flex', flexDirection:'column', gap:16, position:'sticky', top:90 }}>
              {/* Timeline */}
              <div className="card" style={{ padding:22 }}>
                <p style={{ fontSize:'0.88rem', fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'var(--text-muted)', marginBottom:16 }}>Status Timeline</p>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  {STATUS_STEPS.map((step, i) => (
                    <React.Fragment key={step}>
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, flex:1 }}>
                        <div style={{
                          width: i===currentIdx?18:14, height: i===currentIdx?18:14, borderRadius:'50%',
                          background: i<=currentIdx?'var(--accent-primary)':'var(--bg-input)',
                          border: `2px solid ${i<=currentIdx?'var(--accent-primary)':'var(--border-color)'}`,
                          boxShadow: i===currentIdx?'0 0 8px rgba(108,99,255,0.5)':'none',
                          zIndex:1, transition:'var(--transition)'
                        }} />
                        <span style={{ fontSize:'0.68rem', fontFamily:'var(--font-mono)', color: i<=currentIdx?'var(--accent-primary)':'var(--text-muted)', fontWeight: i<=currentIdx?600:400, textAlign:'center', whiteSpace:'nowrap' }}>
                          {capitalize(step)}
                        </span>
                      </div>
                      {i < STATUS_STEPS.length-1 && (
                        <div style={{ flex:1, height:2, background: i<currentIdx?'var(--accent-primary)':'var(--border-color)', marginBottom:20, transition:'var(--transition)' }} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="card" style={{ padding:22 }}>
                <p style={{ fontSize:'0.88rem', fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'var(--text-muted)', marginBottom:16 }}>Ticket Info</p>
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {[
                    { label:'Created',  value: formatDate(ticket.createdAt) },
                    { label:'Updated',  value: formatDate(ticket.updatedAt) },
                    { label:'Category', value: ticket.category },
                    { label:'Priority', value: capitalize(ticket.priority), color: priorityColor[ticket.priority] },
                    ticket.assignedTo && { label:'Assigned', value: ticket.assignedTo },
                  ].filter(Boolean).map(row => (
                    <div key={row.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:8 }}>
                      <span style={{ fontSize:'0.78rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:600 }}>{row.label}</span>
                      <span style={{ fontSize:'0.85rem', color:row.color||'var(--text-secondary)', fontWeight:row.color?600:400, textAlign:'right' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="card" style={{ padding:22, display:'flex', flexDirection:'column', gap:10 }}>
                <p style={{ fontSize:'0.88rem', fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'var(--text-muted)', marginBottom:4 }}>Actions</p>
                <button className="btn-secondary" onClick={() => navigate('/create-ticket')}>+ New Ticket</button>
                <button className="btn-secondary" style={{ color:'var(--accent-danger)', borderColor:'rgba(255,77,109,0.3)' }} onClick={() => navigate('/my-tickets')}>← Back to List</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketDetails
