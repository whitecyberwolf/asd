import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  productId: string;
  productName: string;
  price: number;      // cents
  quantity: number;
  shipping: {
    fullName: string; email: string; phone: string;
    line1: string; line2?: string;
    city: string; state: string; postalCode: string; country: string;
  };
  stripeSessionId: string;
  paymentStatus: "paid" | "unpaid";
}

const OrderSchema = new Schema<IOrder>({
  productId: String,
  productName: String,
  price: Number,
  quantity: Number,
  shipping: {
    fullName: String, email: String, phone: String,
    line1: String, line2: String,
    city: String, state: String, postalCode: String, country: String,
  },
  stripeSessionId: String,
  paymentStatus: { type: String, default: "unpaid" },
}, { timestamps: true });

export default mongoose.model<IOrder>("Order", OrderSchema);
