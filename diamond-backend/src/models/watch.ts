// models/watch.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IWatch extends Document {
  name: string;
  brand?: string;
  imageUrls: string[];
  price: {
    regularPrice: number;
    salePrice?: number;
    salePercentage?: number;
  };
  description?: string;
  // Add additional fields as needed
}

const WatchSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, default: "DEFAULT BRAND" },
    imageUrls: { type: [String], default: [] },
    price: {
      regularPrice: { type: Number, required: true },
      salePrice: { type: Number },
      salePercentage: { type: Number },
    },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IWatch>("Watch", WatchSchema);
