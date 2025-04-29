import mongoose, { Document, Schema } from "mongoose";

interface IPriceVariant {
  metal: string; // make this singular and consistent
  diamond: string;
  ringSize: number;
  price: number;
}

interface IRingOptions {
  metals: string[];
  diamondTypes: string[];
  ringSizes: number[];
}

export interface IRing extends Document {
  productId: string;
  name: string;
  regularPrice?: number;
  options: IRingOptions;
  priceVariants: IPriceVariant[];
  description: string;
  details: Record<string, any>;
  media?: {
    images: string[];
    video?: string;
  };
  diamondType?: string;
  style?: string;
  tags?: string[]; // optional new field
  stockStatus?: "in-stock" | "out-of-stock" | "made-to-order"; // optional
}

const PriceVariantSchema: Schema = new Schema({
  metal: { type: String, required: true },
  diamond: { type: String, required: true },
  ringSize: { type: Number, required: true },
  price: { type: Number, required: true },
});

const RingOptionsSchema: Schema = new Schema({
  metals: { type: [String], required: true },
  diamondTypes: { type: [String], required: true },
  ringSizes: { type: [Number], required: true },
});

const RingSchema: Schema = new Schema({
  productId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  regularPrice: { type: Number },
  options: { type: RingOptionsSchema, required: true },
  priceVariants: { type: [PriceVariantSchema], required: true },
  description: { type: String, required: true },
  details: { type: Schema.Types.Mixed, required: true },
  media: {
    images: { type: [String], default: [] },
    video: { type: String },
  },
  diamondType: { type: String },
  style: { type: String },
  tags: { type: [String] }, // optional tags
  stockStatus: {
    type: String,
    enum: ["in-stock", "out-of-stock", "made-to-order"],
    default: "made-to-order"
  }
});

export default mongoose.model<IRing>("Ring", RingSchema);
