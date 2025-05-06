const express = require('express');
const router  = express.Router();
const { WomenChain } = require('../models/chain');

// List all
router.get('/', async (req, res) => {
  const items = await WomenChain.find().sort({ createdAt: -1 });
  res.json(items);
});

// Get by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await WomenChain.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create
router.post('/', async (req, res) => {
  const item = new WomenChain(req.body);
  await item.save();
  res.status(201).json(item);
});

// Update
router.put('/:id', async (req, res) => {
  const item = await WomenChain.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

// Delete
router.delete('/:id', async (req, res) => {
  await WomenChain.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;
