const express = require('express')
const router  = express.Router()
const {
  getAllTickets, getMyTickets, getTicketById,
  createTicket, updateTicket, deleteTicket,
  addComment, getStats,
} = require('../controllers/ticketController')
const { protect, adminOnly } = require('../middleware/auth')

// All ticket routes require auth
router.use(protect)

router.get('/stats', adminOnly, getStats)
router.get('/my',    getMyTickets)

router.get('/',      getAllTickets)
router.post('/',     createTicket)

router.get('/:id',    getTicketById)
router.put('/:id',    updateTicket)
router.delete('/:id', deleteTicket)

router.post('/:id/comments', addComment)

module.exports = router
