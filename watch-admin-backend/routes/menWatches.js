const express = require('express');
const router = express.Router();
const { MenWatch } = require('../models/watch');

// List all
router.get('/', async (req, res) => {
  const items = await MenWatch.find().sort({ createdAt: -1 });
  res.json(items);
});

// Create
router.post('/', async (req, res) => {
  const item = new MenWatch(req.body);
  await item.save();
  res.status(201).json(item);
});

// Update
router.put('/:id', async (req, res) => {
  const item = await MenWatch.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

// Delete
router.delete('/:id', async (req, res) => {
  await MenWatch.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});


// get one
router.get('/:id', async (req, res) => {
    try {
      const item = await MenWatch.findById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Not found' });
      res.json(item);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
module.exports = router;
