const mongoose = require('mongoose');

/** Reuse the same schema shape you used for watches */
const priceOptionSchema = new mongoose.Schema({
  label: String,   // e.g. size “18 inch”, metalType “Gold”, etc.
  price: Number
});

const chainSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  images:      { type: [String], default: [], maxlength: 10 },
  videos:      { type: [String], default: [], maxlength: 5 },
  sizes:       { type: [priceOptionSchema], default: [] },
  metalTypes:  { type: [priceOptionSchema], default: [] },
  diamondTypes:{ type: [priceOptionSchema], default: [] },
  metalColors: { type: [priceOptionSchema], default: [] },
  description: { type: String, default: '' }
}, { timestamps: true });

module.exports = {
  MenChain:   mongoose.model('MenChain',   chainSchema, 'menChains'),
  WomenChain: mongoose.model('WomenChain', chainSchema, 'womenChains'),
};
