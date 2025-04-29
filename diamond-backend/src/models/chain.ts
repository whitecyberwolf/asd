import mongoose from "mongoose";

const ChainSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: mongoose.Schema.Types.Mixed, required: true },
  imageUrls: [String],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Chain", ChainSchema);
