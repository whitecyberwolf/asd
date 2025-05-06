// routes/checkout.js

const express = require('express');
const router  = express.Router();
const Stripe  = require('stripe');
const stripe  = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * POST /api/checkout/create-checkout-session
 * body: {
 *   items: Array<{ price_data, quantity }>,
 *   successUrl: string,
 *   cancelUrl: string
 * }
 */
router.post('/create-checkout-session', async (req, res) => {
  const { items, successUrl, cancelUrl } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],

      // Ask Stripe to collect the customer's billing address
      billing_address_collection: 'required',

      // Ask Stripe to collect a shipping address from the customer
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU'] // add your allowed shipping countries
      },

      line_items: items,
      mode: 'payment',

      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe session error', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
