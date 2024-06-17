import mongoose ,{ Document} from "mongoose";

export interface IStore {
  storeOwner: mongoose.Schema.Types.ObjectId;
  storeName: string;
  verified?: boolean;
  storeType?: 'real' | 'virtual';
  wilaya?: string;
  city: string;
  longitude?: string;
  latitude?: string;
  phone?: string;
  website?: string;
  socialMediaLinks?: { name: string; link: string }[];
  rating?: number;
  description?: string;
  keywords?: string[];
  storeLogo : string;
}

export interface IStoreDocument extends IStore, Document {
  id: mongoose.Types.ObjectId;
}



// Define the Store schema
const storeSchema = new mongoose.Schema<IStoreDocument>(
  {
    storeOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: [true, "Store owner is required"],
    },
    storeName: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    storeType: {
      type: String,
      enum: ["real", "virtual"],
      default: "real",
    },
    wilaya: {
      type: String,
      trim: true,
    },
    city : {
      type : String,
      required: [true, "City is required"],
    },
    longitude: {
      type: String,
      trim: true,
    },
    latitude: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    socialMediaLinks: [
      {
        name: {
          type: String,
          trim: true,
        },
        link: {
          type: String,
          trim: true,
        },
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating must be at least 0"],
      max: [5, "Rating must be at most 5"],
    },
    description: {
      type: String,
    },
    keywords: [
      {
        type: String,
        required: true,
      },
    ],
    storeLogo : {
      type : String ,
    },
  },
  {
    timestamps: true,
  }
);

const Store = mongoose.model<IStoreDocument>("Store", storeSchema);
export default Store;
