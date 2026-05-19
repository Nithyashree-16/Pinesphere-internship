import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar.jsx'
import Sidebar from '../components/Sidebar/Sidebar.jsx'
import Loader from '../components/Loader/Loader.jsx'
import { ticketAPI, aiAPI } from '../services/api.js'
import { Bot, Sparkles, Send, AlertTriangle } from 'lucide-react'

const CATEGORIES = ['Technical Issue','Billing','Account Access','Feature Request','General Inquiry','Service Outage','Other']
const PRIORITIES  = ['low','medium','high','critical']
const PCOLORS     = { low:'#00e5a0', medium:'#ffb347', high:'#ff4d6d', critical:'#ff0055' }

const CreateTicket = () => {
  const navigate = useNavigate()
  const [form, setForm]         = useState({ title:'', description:'', category:'', priority:'medium' })
  const [errors, setErrors]     = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')
  const [success, setSuccess]   = useState(false)
  const [aiLoading, setAiLoading]   = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState(null)
  const [aiApplied, setAiApplied]   = useState(false)
  const aiTimer = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    setErrors(p => ({ ...p, [name]: '' }))
    setApiError('')
    if (name === 'description') {
      setAiSuggestion(null); setAiApplied(false)
      clearTimeout(aiTimer.current)
      if (value.trim().length > 30) aiTimer.current = setTimeout(() => classifyAI(value), 800)
    }
  }

  const classifyAI = async (description) => {
    setAiLoading(true)
    try {
      const res = await aiAPI.classify({ description })
      setAiSuggestion(res.data)
    } catch { setAiSuggestion(null) }
    finally { setAiLoading(false) }
  }

  const applyAI = () => {
    if (!aiSuggestion) return
    setForm(p => ({ ...p, category: aiSuggestion.category||p.category, priority: aiSuggestion.priority||p.priority }))
    setAiApplied(true)
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim())             e.title       = 'Title is required'
    if (!form.description.trim())       e.description = 'Description is required'
    else if (form.description.trim().length < 20) e.description = 'Please describe in at least 20 characters'
    if (!form.category)                 e.category    = 'Please select a category'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitting(true)
    try {
      await ticketAPI.create(form)
      setSuccess(true)
      setTimeout(() => navigate('/my-tickets'), 1800)
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to create ticket.')
    } finally { setSubmitting(false) }
  }

  if (success) return (
    <div className="page-wrapper">
      <div className="bg-grid" /><Sidebar />
      <div className="main-content">
        <Navbar pageTitle="New Ticket" />
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', gap:16, textAlign:'center' }} className="animate-fade-up">
          <div style={{ fontSize:'3.5rem' }}>✅</div>
          <h2 style={{ fontSize:'1.8rem', fontWeight:700, color:'var(--accent-success)' }}>Ticket Created!</h2>
          <p style={{ color:'var(--text-secondary)' }}>Redirecting to your tickets…</p>
          <Loader size="sm" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="page-wrapper">
      <div className="bg-grid" /><Sidebar />
      <div className="main-content">
        <Navbar pageTitle="New Ticket" />
        <div className="animate-fade-up" style={{ maxWidth:1100 }}>
          <div style={{ marginBottom:28 }}>
            <h2 style={{ fontSize:'1.6rem', fontWeight:700, marginBottom:4 }}>Submit a Complaint</h2>
            <p style={{ color:'var(--text-secondary)', fontSize:'0.92rem' }}>Describe your issue — our AI will help categorize it.</p>
          </div>

          {apiError && <div className="api-error">{apiError}</div>}

          <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:24, alignItems:'start' }}>
            {/* Form */}
            <form className="card" onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:22 }}>
              <div className="form-group">
                <label>Ticket Title *</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="Brief summary of your issue" maxLength={120} />
                {errors.title && <p className="error-text">{errors.title}</p>}
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Explain your issue in detail (min. 20 characters)…" rows={6} style={{ resize:'vertical', minHeight:140, lineHeight:1.6 }} />
                {errors.description && <p className="error-text">{errors.description}</p>}
                {aiLoading && <p style={{ display:'flex', alignItems:'center', gap:6, fontSize:'0.8rem', color:'var(--accent-secondary)', fontFamily:'var(--font-mono)', marginTop:6 }}><Bot size={13} /> AI is analyzing…</p>}
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="">Select a category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <p className="error-text">{errors.category}</p>}
              </div>

              <div className="form-group">
                <label>Priority</label>
                <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                  {PRIORITIES.map(p => (
                    <button key={p} type="button" onClick={() => setForm(f=>({...f,priority:p}))}
                      style={{
                        padding:'8px 20px', borderRadius:24, fontSize:'0.85rem', fontWeight:500, cursor:'pointer',
                        border: form.priority===p ? `1px solid ${PCOLORS[p]}` : '1px solid var(--border-color)',
                        background: form.priority===p ? `${PCOLORS[p]}18` : 'transparent',
                        color: form.priority===p ? PCOLORS[p] : 'var(--text-secondary)',
                        transition:'var(--transition)'
                      }}>
                      {p.charAt(0).toUpperCase()+p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={submitting} style={{ marginTop:4 }}>
                {submitting ? <Loader size="sm" /> : <><Send size={16} /> Submit Ticket</>}
              </button>
            </form>

            {/* AI Panel */}
            <div style={{ display:'flex', flexDirection:'column', gap:16, position:'sticky', top:90 }}>
              <div className="card" style={{ padding:22 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20, paddingBottom:16, borderBottom:'1px solid var(--border-color)' }}>
                  <div style={{ width:40, height:40, background:'linear-gradient(135deg,var(--accent-primary),var(--accent-secondary))', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', flexShrink:0 }}>
                    <Bot size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize:'0.95rem', fontWeight:600, marginBottom:2 }}>AI Assistant</h4>
                    <p style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>Auto-classifies your ticket</p>
                  </div>
                </div>

                {!form.description || form.description.trim().length <= 30 ? (
                  <div style={{ textAlign:'center', color:'var(--text-muted)', display:'flex', flexDirection:'column', alignItems:'center', gap:10, padding:'10px 0' }}>
                    <Sparkles size={28} />
                    <p style={{ fontSize:'0.85rem', lineHeight:1.5 }}>Start typing your description and AI will suggest a category and priority.</p>
                  </div>
                ) : aiLoading ? (
                  <div style={{ display:'flex', justifyContent:'center', padding:'20px 0' }}><Loader size="sm" text="Analyzing…" /></div>
                ) : aiSuggestion ? (
                  <div>
                    <p style={{ fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'var(--text-muted)', marginBottom:6 }}>Suggested Category</p>
                    <div style={{ background:'var(--bg-input)', border:'1px solid var(--border-color)', borderRadius:8, padding:'10px 14px', fontSize:'0.95rem', fontWeight:600, marginBottom:16 }}>{aiSuggestion.category}</div>
                    <p style={{ fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'var(--text-muted)', marginBottom:6 }}>Suggested Priority</p>
                    <div style={{ background:'var(--bg-input)', border:'1px solid var(--border-color)', borderRadius:8, padding:'10px 14px', fontSize:'0.95rem', fontWeight:600, color:PCOLORS[aiSuggestion.priority], display:'flex', alignItems:'center', gap:6 }}>
                      <AlertTriangle size={14} />{aiSuggestion.priority?.charAt(0).toUpperCase()+aiSuggestion.priority?.slice(1)}
                    </div>
                    {!aiApplied ? (
                      <button className="btn-primary" style={{ marginTop:16, fontSize:'0.87rem', padding:'10px 20px' }} onClick={applyAI}>
                        <Sparkles size={14} /> Apply Suggestion
                      </button>
                    ) : (
                      <p style={{ marginTop:16, color:'var(--accent-success)', fontSize:'0.88rem', fontWeight:600, textAlign:'center' }}>✅ Applied to form!</p>
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign:'center', color:'var(--text-muted)' }}>
                    <p style={{ fontSize:'0.85rem' }}>Could not classify. Please select manually.</p>
                  </div>
                )}
              </div>

              <div className="card" style={{ padding:'20px 22px' }}>
                <h4 style={{ fontSize:'0.9rem', fontWeight:600, marginBottom:12 }}>💡 Tips for a good ticket</h4>
                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:8 }}>
                  {['Be specific about the problem','Mention when it started','Include any error messages','Describe steps you already tried'].map(tip => (
                    <li key={tip} style={{ fontSize:'0.84rem', color:'var(--text-secondary)', paddingLeft:16, position:'relative' }}>
                      <span style={{ position:'absolute', left:0, color:'var(--accent-primary)' }}>→</span>{tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateTicket
