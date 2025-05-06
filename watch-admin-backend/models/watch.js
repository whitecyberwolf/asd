// models/watch.js
const mongoose = require('mongoose');

const priceOptionSchema = new mongoose.Schema({
  label: String,
  price: Number
});

const watchSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  images:      { type: [String], default: [], maxlength: 10 },
  videos:      { type: [String], default: [], maxlength: 5 },
  sizes:       { type: [priceOptionSchema], default: [] },
  metalTypes:  { type: [priceOptionSchema], default: [] },
  diamondTypes:{ type: [priceOptionSchema], default: [] },
  metalColors: { type: [priceOptionSchema], default: [] },
  description: { type: String, default: '' }
}, { timestamps: true });

const MenWatch   = mongoose.model('MenWatch',   watchSchema, 'menWatches');
const WomenWatch = mongoose.model('WomenWatch', watchSchema, 'womenWatches');

module.exports = { MenWatch, WomenWatch };
