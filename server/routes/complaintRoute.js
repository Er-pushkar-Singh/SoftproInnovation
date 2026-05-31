const express   = require('express')
const router    = express.Router()
const Complaint = require('../models/Complaint')

// User complaint submit 
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, category, message } = req.body
    const data = new Complaint({ name, email, subject, category, message })
    await data.save()
    res.json({ msg: 'Message sent successfully' })
  } catch (err) {
    res.json({ msg: 'Failed to send message' })
  }
})

// Admin — complaints list 
router.get('/', async (req, res) => {
  try {
    const data = await Complaint.find().sort({ createdAt: -1 }).lean()
    res.json({ msg: 'Fetched', data })
  } catch (err) {
    res.json({ msg: 'Failed to fetch' })
  }
})

// Admin — reply to complaint
router.patch('/reply/:id', async (req, res) => {
  try {
    const data = await Complaint.findByIdAndUpdate(
      req.params.id,
      { reply: req.body.reply, status: 'replied' },
      { new: true }
    )
    res.json({ msg: 'Reply sent', data })
  } catch (err) {
    res.json({ msg: 'Failed to reply' })
  }
})

// Admin — delete complaint
router.delete('/:id', async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id)
    res.json({ msg: 'Deleted successfully' })
  } catch (err) {
    res.json({ msg: 'Failed to delete' })
  }
})

module.exports = router