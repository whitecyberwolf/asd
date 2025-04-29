import mongoose, { Schema, type Document } from "mongoose"

export interface IBracelet extends Document {
  productId: string
  name: string
  regularPrice: number
  salePrice: number
  discountPercentage?: number
  description: string
  details: {
    material?: string
    goldWeight?: string
    weight?: string
    stone?: string
    size?: string
    metal?: string
    width?: string
    thickness?: string
    clasp?: string
    length?: string
  }
  options: {
    agateColors?: string[]
    metals?: string[]
    metalColors?: string[]
    colors?: string[]
    sizes?: string[]
  }
  priceVariants: Array<{
    agateColor?: string
    metal?: string
    metalColor?: string
    color?: string
    price: number
    originalPrice?: number
  }>
  media: {
    images: string[]
    video: string | null
  }
}

const BraceletSchema: Schema = new Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    regularPrice: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    discountPercentage: { type: Number },
    description: { type: String, required: true },
    details: {
      material: { type: String },
      goldWeight: { type: String },
      weight: { type: String },
      stone: { type: String },
      size: { type: String },
      metal: { type: String },
      width: { type: String },
      thickness: { type: String },
      clasp: { type: String },
      length: { type: String },
    },
    options: {
      agateColors: { type: [String] },
      metals: { type: [String] },
      metalColors: { type: [String] },
      colors: { type: [String] },
      sizes: { type: [String] },
    },
    priceVariants: [
      {
        agateColor: { type: String },
        metal: { type: String },
        metalColor: { type: String },
        color: { type: String },
        price: { type: Number, required: true },
        originalPrice: { type: Number },
      },
    ],
    media: {
      images: { type: [String], required: true },
      video: { type: String, default: null },
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Bracelet || mongoose.model<IBracelet>("Bracelet", BraceletSchema)
