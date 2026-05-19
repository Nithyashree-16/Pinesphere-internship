const fetch  = require('node-fetch')
const Ticket = require('../models/Ticket')

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`

const CATEGORIES = ['Technical Issue', 'Billing', 'Account Access', 'Feature Request', 'General Inquiry', 'Service Outage', 'Other']
const PRIORITIES  = ['low', 'medium', 'high', 'critical']

// Helper — call Gemini Flash (free tier)
const gemini = async (prompt) => {
  const res = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 512 },
    }),
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ''
}

// Parse JSON safely (handles markdown fences)
const parseJSON = (raw) => {
  try { return JSON.parse(raw) } catch {}
  const match = raw.match(/\{[\s\S]*\}/)
  if (match) { try { return JSON.parse(match[0]) } catch {} }
  return {}
}

// POST /api/ai/classify
exports.classify = async (req, res) => {
  try {
    const { description } = req.body
    if (!description?.trim())
      return res.status(400).json({ message: 'Description is required' })

    const prompt = `You are a support ticket classifier. Given the ticket description below, respond ONLY with a valid JSON object (no markdown, no explanation) with exactly two keys:
- "category": one of ${JSON.stringify(CATEGORIES)}
- "priority": one of ${JSON.stringify(PRIORITIES)}

Ticket description:
"""
${description.trim()}
"""

JSON response:`

    const raw    = await gemini(prompt)
    const result = parseJSON(raw)

    if (!CATEGORIES.includes(result.category)) result.category = 'General Inquiry'
    if (!PRIORITIES.includes(result.priority))  result.priority  = 'medium'

    res.json(result)
  } catch (err) {
    console.error('AI classify error:', err.message)
    res.status(500).json({ message: 'AI classification failed', category: 'General Inquiry', priority: 'medium' })
  }
}

// GET /api/ai/summarize/:id
exports.summarize = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('user', 'name')
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' })

    if (req.user.role !== 'admin' && ticket.user._id.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Access denied' })

    const commentsText = ticket.comments.length
      ? ticket.comments.map((c, i) => `Comment ${i + 1}: ${c.content}`).join('\n')
      : 'No comments yet.'

    const prompt = `Summarize this support ticket in 2-3 concise sentences for a support agent. Include the core problem, current status, and any key notes from comments.

Title: ${ticket.title}
Category: ${ticket.category}
Priority: ${ticket.priority}
Status: ${ticket.status}
Description: ${ticket.description}
${commentsText}

Summary:`

    const summary = await gemini(prompt)

    ticket.aiSummary = summary
    await ticket.save()

    res.json({ summary })
  } catch (err) {
    console.error('AI summarize error:', err.message)
    res.status(500).json({ message: 'AI summarization failed' })
  }
}
