import React from 'react'
import { useNavigate } from 'react-router-dom'
import { formatDate, truncate, statusBadgeClass, priorityColor, capitalize } from '../../utils/helpers.js'
import { Clock, Tag, AlertTriangle, ArrowRight } from 'lucide-react'

const TicketCard = ({ ticket }) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/ticket/${ticket._id}`)}
      style={{
        background:'var(--bg-card)', border:'1px solid var(--border-color)',
        borderRadius:20, padding:'22px 24px', cursor:'pointer',
        transition:'var(--transition)', display:'flex', flexDirection:'column', gap:12
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor='rgba(108,99,255,0.5)'
        e.currentTarget.style.transform='translateY(-2px)'
        e.currentTarget.style.boxShadow='0 0 20px rgba(108,99,255,0.3)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor='rgba(108,99,255,0.2)'
        e.currentTarget.style.transform='translateY(0)'
        e.currentTarget.style.boxShadow='none'
      }}
    >
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span className={`badge ${statusBadgeClass[ticket.status] || 'badge-open'}`}>
          {capitalize(ticket.status)}
        </span>
        <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:'0.75rem', fontWeight:600, fontFamily:'var(--font-mono)', color: priorityColor[ticket.priority] || '#fff' }}>
          <AlertTriangle size={12} />{capitalize(ticket.priority)}
        </span>
      </div>

      <h3 style={{ fontSize:'1rem', fontWeight:600, color:'var(--text-primary)' }}>{ticket.title}</h3>
      <p style={{ fontSize:'0.87rem', color:'var(--text-secondary)', lineHeight:1.6 }}>{truncate(ticket.description, 100)}</p>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:4 }}>
        <div style={{ display:'flex', gap:16 }}>
          <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.78rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>
            <Tag size={12} />{ticket.category || 'General'}
          </span>
          <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.78rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>
            <Clock size={12} />{formatDate(ticket.createdAt)}
          </span>
        </div>
        <ArrowRight size={16} style={{ color:'var(--text-muted)' }} />
      </div>
    </div>
  )
}

export default TicketCard
