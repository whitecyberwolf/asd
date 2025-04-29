import mongoose from "mongoose";

interface IEyeglasses extends mongoose.Document {
  title: string;
  price: number;
  originalPrice?: number;
  salePercentage?: number;
  metalColors: string[];
  description: string;
  details: {
    diamond: string;
    material: string;
    diamondTesterPass: boolean;
    note: string;
  };
  images: string[];
  video?: string;
}

const eyeglassesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true
    },
    originalPrice: {
      type: Number
    },
    salePercentage: {
      type: Number,
      min: 0,
      max: 100
    },
    metalColors: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one metal color must be specified"
      }
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    details: {
      diamond: {
        type: String,
        required: true
      },
      material: {
        type: String,
        required: true
      },
      diamondTesterPass: {
        type: Boolean,
        required: true,
        default: true
      },
      note: {
        type: String,
        required: true
      }
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one image must be provided"
      }
    },
    video: {
      type: String
    }
  },
  { 
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.__v;
        delete ret._id;
        return ret;
      }
    },
    toObject: {
      virtuals: true
    }
  }
);

// Add virtual for discounted price calculation
eyeglassesSchema.virtual('discountedPrice').get(function(this: IEyeglasses) {
  if (this.originalPrice && this.salePercentage) {
    return this.originalPrice * (1 - this.salePercentage / 100);
  }
  return this.price;
});

// Add text index for search functionality
eyeglassesSchema.index({
  title: 'text',
  description: 'text',
  'details.diamond': 'text',
  'details.material': 'text'
});

const Eyeglasses = mongoose.model<IEyeglasses>("Eyeglasses", eyeglassesSchema);

export default Eyeglasses;