require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const menChainsRoute   = require('./routes/menChains');
const womenChainsRoute = require('./routes/womenChains');
// … your existing watch routes …
const menWatchesRoute   = require('./routes/menWatches');
const womenWatchesRoute = require('./routes/womenWatches');
const checkoutRoute     = require('./routes/checkout');

const app = express();
app.use(cors(), express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(console.error);

// Mount your new chain routes
app.use('/api/men-chains',   menChainsRoute);
app.use('/api/women-chains', womenChainsRoute);

// Mount your existing watch routes
app.use('/api/men-watches',   menWatchesRoute);
app.use('/api/women-watches', womenWatchesRoute);

// Stripe checkout route
app.use('/api/checkout', checkoutRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
