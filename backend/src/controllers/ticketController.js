const Ticket = require('../models/Ticket')

// GET /api/tickets  (admin sees all; user sees own)
exports.getAllTickets = async (req, res) => {
  try {
    const { status, priority, category, search, page = 1, limit = 20 } = req.query
    const filter = {}

    if (req.user.role !== 'admin') filter.user = req.user._id

    if (status   && status   !== 'All') filter.status   = status
    if (priority && priority !== 'All') filter.priority = priority
    if (category && category !== 'All') filter.category = category
    if (search) filter.$text = { $search: search }

    const skip    = (Number(page) - 1) * Number(limit)
    const [tickets, total] = await Promise.all([
      Ticket.find(filter)
        .populate('user', 'name email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Ticket.countDocuments(filter),
    ])

    res.json({ tickets, total, page: Number(page), pages: Math.ceil(total / Number(limit)) })
  } catch (err) {
    console.error('Get tickets error:', err)
    res.status(500).json({ message: 'Failed to fetch tickets' })
  }
}

// GET /api/tickets/my
exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id })
      .sort({ createdAt: -1 })
    res.json(tickets)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your tickets' })
  }
}

// GET /api/tickets/:id
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('user', 'name email avatar')
      .populate('comments.author', 'name avatar role')

    if (!ticket) return res.status(404).json({ message: 'Ticket not found' })

    // Users can only see their own tickets
    if (req.user.role !== 'admin' && ticket.user._id.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Access denied' })

    res.json(ticket)
  } catch (err) {
    console.error('Get ticket error:', err)
    res.status(500).json({ message: 'Failed to fetch ticket' })
  }
}

// POST /api/tickets
exports.createTicket = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body
    if (!title || !description || !category)
      return res.status(400).json({ message: 'Title, description and category are required' })

    const ticket = await Ticket.create({
      title, description, category,
      priority: priority || 'medium',
      user: req.user._id,
    })

    await ticket.populate('user', 'name email avatar')
    res.status(201).json(ticket)
  } catch (err) {
    console.error('Create ticket error:', err)
    res.status(500).json({ message: 'Failed to create ticket' })
  }
}

// PUT /api/tickets/:id
exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' })

    const isOwner = ticket.user.toString() === req.user._id.toString()
    const isAdmin = req.user.role === 'admin'

    if (!isOwner && !isAdmin)
      return res.status(403).json({ message: 'Access denied' })

    const allowedFields = isAdmin
      ? ['title', 'description', 'category', 'priority', 'status', 'aiSummary']
      : ['title', 'description', 'category', 'priority']  // users can't change status

    allowedFields.forEach(f => {
      if (req.body[f] !== undefined) ticket[f] = req.body[f]
    })

    await ticket.save()
    await ticket.populate('user', 'name email avatar')
    res.json(ticket)
  } catch (err) {
    console.error('Update ticket error:', err)
    res.status(500).json({ message: 'Failed to update ticket' })
  }
}

// DELETE /api/tickets/:id
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' })

    const isOwner = ticket.user.toString() === req.user._id.toString()
    const isAdmin = req.user.role === 'admin'
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Access denied' })

    await ticket.deleteOne()
    res.json({ message: 'Ticket deleted successfully' })
  } catch (err) {
    console.error('Delete ticket error:', err)
    res.status(500).json({ message: 'Failed to delete ticket' })
  }
}

// POST /api/tickets/:id/comments
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body
    if (!content?.trim()) return res.status(400).json({ message: 'Comment content is required' })

    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' })

    ticket.comments.push({ author: req.user._id, content: content.trim() })
    await ticket.save()
    await ticket.populate('comments.author', 'name avatar role')
    res.status(201).json(ticket.comments[ticket.comments.length - 1])
  } catch (err) {
    console.error('Add comment error:', err)
    res.status(500).json({ message: 'Failed to add comment' })
  }
}

// GET /api/tickets/stats  (admin)
exports.getStats = async (req, res) => {
  try {
    const [total, open, inProgress, closed, byPriority, byCategory] = await Promise.all([
      Ticket.countDocuments(),
      Ticket.countDocuments({ status: 'open' }),
      Ticket.countDocuments({ status: 'in-progress' }),
      Ticket.countDocuments({ status: 'closed' }),
      Ticket.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
      Ticket.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
    ])
    res.json({ total, open, inProgress, closed, byPriority, byCategory })
  } catch (err) {
    console.error('Stats error:', err)
    res.status(500).json({ message: 'Failed to fetch stats' })
  }
}
