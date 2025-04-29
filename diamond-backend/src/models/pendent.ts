import mongoose, { Schema, Document } from "mongoose";

export interface IPendant extends Document {
  name: string;
  price: number | Record<string, any>;
  metalColour?: string[];
  description?: string;
  details?: {
    diamond?: string;
    clarity?: string;
    color?: string;
    cut?: string;
    caratWeight?: string;
    material?: string;
    weight?: string;
    length?: string;
    [key: string]: any; // For additional fields
  };
  images?: string[];
  video?: string;
}

const PendantSchema = new Schema<IPendant>(
  {
    name: { type: String, required: true },
    // Price can be a single number or an object (for multiple price tiers)
    price: { type: Schema.Types.Mixed, required: true },
    metalColour: [{ type: String }],

    description: { type: String },
    details: {
      diamond: { type: String },
      clarity: { type: String },
      color: { type: String },
      cut: { type: String },
      caratWeight: { type: String },
      material: { type: String },
      weight: { type: String },
      length: { type: String },
      // Additional fields will be allowed since it's a subdocument
    },
    images: [{ type: String }],
    video: { type: String },
  },
  {
    timestamps: true, // Automatically manage createdAt & updatedAt
  }
);

// Export the compiled model
export default mongoose.model<IPendant>("Pendant", PendantSchema);
