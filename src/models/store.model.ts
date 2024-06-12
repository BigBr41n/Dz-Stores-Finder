import mongoose from "mongoose";

// Define the Store schema
const storeSchema = new mongoose.Schema(
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
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Store = mongoose.model("Store", storeSchema);
export default Store;
