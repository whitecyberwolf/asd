import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Chain from "./src/models/chain";
import Bracelet from "./src/models/bracelet";
import Ring from "./src/models/ring";
import Pendent from "./src/models/pendent";
import Stripe from "stripe";
import Eyeglasses from "./src/models/eyeglasses";
import Watch from "./src/models/watch";
import nodemailer from 'nodemailer';
import Order from "./src/models/order";
import path from "path";



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("🚀 MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* ============================
   CHAIN ENDPOINTS
============================ */

// Fetch all chains
app.get("/api/chains", async (_req: Request, res: Response): Promise<void> => {
  try {
    const chains = await Chain.find({});
    res.status(200).json(chains);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Fetch a single chain by ID
app.get(
  "/api/chains/:id",
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const chain = await Chain.findById(id);
      if (!chain) {
        res.status(404).json({ message: "Chain not found" });
        return;
      }
      res.status(200).json(chain);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  }
);

// Fetch 4 random recommended chains
app.get(
  "/api/chains/recommended",
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const recommendedChains = await Chain.aggregate([{ $sample: { size: 4 } }]);
      res.status(200).json(recommendedChains);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  }
);

/* ============================
   BRACELET ENDPOINTS
============================ */

// Fetch all bracelets
app.get("/api/bracelets", async (_req: Request, res: Response): Promise<void> => {
  try {
    const bracelets = await Bracelet.find({});
    res.status(200).json(bracelets);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Fetch a single bracelet by ID
app.get(
  "/api/bracelets/:id",
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const bracelet = await Bracelet.findById(id);
      if (!bracelet) {
        res.status(404).json({ message: "Bracelet not found" });
        return;
      }
      res.status(200).json(bracelet);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  }
);

// Fetch 4 random recommended bracelets
app.get(
  "/api/bracelets/recommended",
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const recommendedBracelets = await Bracelet.aggregate([{ $sample: { size: 4 } }]);
      res.status(200).json(recommendedBracelets);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  }
);


/* ============================
   PENDANT ENDPOINTS
============================ */

// Fetch all pendants
app.get("/api/pendants", async (_req: Request, res: Response): Promise<void> => {
  try {
    const pendants = await Pendent.find({});
    res.status(200).json(pendants);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Fetch a single pendant by ID
app.get(
  "/api/pendants/:id",
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const pendant = await Pendent.findById(id);
      if (!pendant) {
        res.status(404).json({ message: "Pendant not found" });
        return;
      }
      res.status(200).json(pendant);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  }
);

// Fetch 4 random recommended pendants
app.get(
  "/api/pendants/recommended",
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const recommendedPendants = await Pendent.aggregate([{ $sample: { size: 4 } }]);
      res.status(200).json(recommendedPendants);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  }
);
/* ============================
   RING ENDPOINTS
============================ */

// Fetch all rings
app.get("/api/rings", async (_req: Request, res: Response): Promise<void> => {
  try {
    const rings = await Ring.find({});
    res.status(200).json(rings);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Fetch a single ring by ID
app.get(
  "/api/rings/:id",
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const ring = await Ring.findById(id);
      if (!ring) {
        res.status(404).json({ message: "Ring not found" });
        return;
      }
      res.status(200).json(ring);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  }
);

// Fetch 4 random recommended rings
app.get(
  "/api/rings/recommended",
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const recommendedRings = await Ring.aggregate([{ $sample: { size: 4 } }]);
      res.status(200).json(recommendedRings);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  }
);

/* ============================
   EYEGLASSES ENDPOINTS
============================ */

// Fetch all eyeglasses
app.get("/api/eyeglasses", async (_req: Request, res: Response): Promise<void> => {
  try {
    const eyeglasses = await Eyeglasses.find({});
    res.status(200).json(eyeglasses);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Fetch a single eyeglasses item by ID
app.get("/api/eyeglasses/:id", async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const eyeglassesItem = await Eyeglasses.findById(id);
    if (!eyeglassesItem) {
      res.status(404).json({ message: "Eyeglasses not found" });
      return;
    }
    res.status(200).json(eyeglassesItem);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Fetch 4 random recommended eyeglasses
app.get("/api/eyeglasses/recommended", async (_req: Request, res: Response): Promise<void> => {
  try {
    const recommendedEyeglasses = await Eyeglasses.aggregate([{ $sample: { size: 4 } }]);
    res.status(200).json(recommendedEyeglasses);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

/* ============================
   WATCH ENDPOINTS
============================ */

// Fetch all watches
app.get("/api/watches", async (_req: Request, res: Response): Promise<void> => {
  try {
    const watches = await Watch.find({});
    res.status(200).json(watches);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Fetch a single watch by ID
app.get(
  "/api/watches/:id",
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const watch = await Watch.findById(id); 
      if (!watch) {
        res.status(404).json({ message: "Watch not found" });
        return;
      }
      res.status(200).json(watch);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  }
);

// Fetch 4 random recommended watches
app.get(
  "/api/watches/recommended",
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const recommendedWatches = await Watch.aggregate([{ $sample: { size: 4 } }]);
      res.status(200).json(recommendedWatches);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  }
);

/* ============================
   STRIPE CHECKOUT SESSION (UPDATED)
============================ */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil" // Use current stable version
});

// app.post("/create-checkout-session", async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { productId, productName, amount, quantity } = req.body;

//     if (!process.env.FRONTEND_URL) {
//       throw new Error("FRONTEND_URL environment variable is not set");
//     }

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: productName,
//             },
//             unit_amount: amount,
//           },
//           quantity: quantity || 1,
//         },
//       ],
//       success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.FRONTEND_URL}/cancel`,
//     });

//     res.json({ url: session.url });
//   } catch (error) {
//     console.error("Error creating checkout session:", error);
//     res.status(500).json({ 
//       error: error instanceof Error ? error.message : "Failed to create checkout session"
//     });
//   }
// });
app.post("/create-checkout-session", async (req, res) => {
  try {
    const {
      productId, productName, price, quantity,
      shipping     // address object from front‑end
    } = req.body;

    const amount = Math.round(price * 100);   // cents

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU", "NZ"],
      },
      customer_email: shipping.email,
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: productName },
          unit_amount: amount,
        },
        quantity,
      }],
      metadata: {
        productId, productName, quantity, price: amount,
        ...shipping,   // keep every field for later
      },
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.FRONTEND_URL}/cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to create session" });
  }
});

/* ────────────────────────────────────────────────────────── */
/* 1)  RAW WEBHOOK ROUTE – must come first                   */
/* ────────────────────────────────────────────────────────── */
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),          // raw body
  async (req: Request, res: Response): Promise<void> => {
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error("⚠️  Signature check failed:", err);
      res.status(400).send("Webhook signature verification failed");
      return;                                         // void
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const md      = session.metadata ?? {};

      try {
        await Order.create({
          productId:   md.productId,
          productName: md.productName,
          price:       Number(md.price),
          quantity:    Number(md.quantity),
          shipping: {
            fullName:   md.fullName,
            email:      session.customer_details?.email,
            phone:      md.phone,
            line1:      md.line1,
            line2:      md.line2,
            city:       md.city,
            state:      md.state,
            postalCode: md.postalCode,
            country:    md.country,
          },
          stripeSessionId: session.id,
          paymentStatus:   "paid",
        });
        console.log("✅ Order stored for session", session.id);
      } catch (dbErr) {
        console.error("❌ Failed to save order:", dbErr);
      }
    }

    res.json({ received: true });
  }
);

/* ────────────────────────────────────────────────────────── */
/* 2)  NORMAL JSON BODY‑PARSER AFTER THE WEBHOOK             */
/* ────────────────────────────────────────────────────────── */
app.use(express.json());

// after app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (_req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);


// Verify payment status
app.get("/verify-payment/:sessionId", async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;

    // 1. Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer_details", "shipping_details"],
    });

    // 2. Safely read the fields you need
    res.status(200).json({
      paymentStatus: session.payment_status,
      customerEmail: session.customer_details?.email,
      // shipping: session.  shipping_details,
      productInfo: session.line_items?.data[0]?.price?.product,
    });
  } catch (error) {
    console.error("Failed to verify payment:", error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
});


app.post("/create-checkout-session", async (req, res) => {
  try {
    const { items } = req.body as {
      items: {
        productId: string;
        name: string;
        unit_price: number; // cents
        quantity: number;
        meta?: Record<string, string>;
      }[];
    };

    const line_items = items.map((it) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: it.name,
          metadata: { productId: it.productId, ...it.meta },
        },
        unit_amount: it.unit_price,
      },
      quantity: it.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to create checkout session" });
  }
});


/* ============================
   SEARCH ENDPOINT
============================ */

app.get("/api/search", async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;
    
    if (!query || typeof query !== 'string') {
      res.status(400).json({ message: "Search query is required" });
      return;
    }

    const searchResults = await Promise.all([
      Chain.find({ $text: { $search: query } }),
      Bracelet.find({ $text: { $search: query } }),
      Ring.find({ $text: { $search: query } }),
      Pendent.find({ $text: { $search: query } }),
      Eyeglasses.find({ $text: { $search: query } }),
      Watch.find({ $text: { $search: query } })
    ]);

    const results = {
      chains: searchResults[0],
      bracelets: searchResults[1],
      rings: searchResults[2],
      pendants: searchResults[3],
      eyeglasses: searchResults[4],
      watches: searchResults[5]
    };

    res.status(200).json(results);
  } catch (error) {
   res.status(500).json({ message: "Server Error", error });
  }
});

/* ============================
   ROOT ROUTE
============================ */

app.get("/", (_req: Request, res: Response): void => {
  res.status(200).json({ message: "Diamond Store API is running!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🌐 Server is running at http://localhost:${PORT}`);
});
