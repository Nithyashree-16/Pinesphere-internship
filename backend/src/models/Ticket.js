const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
  {
    author:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true }
)

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Technical Issue', 'Billing', 'Account Access', 'Feature Request', 'General Inquiry', 'Service Outage', 'Other'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'closed'],
      default: 'open',
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [commentSchema],
    aiSummary: { type: String, default: '' },
  },
  { timestamps: true }
)

// Text index for search
ticketSchema.index({ title: 'text', description: 'text' })

module.exports = mongoose.model('Ticket', ticketSchema)
