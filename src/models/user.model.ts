import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Document,  } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  role: 'admin' | 'user' | 'editor';
  password: string;
  stores: mongoose.Schema.Types.ObjectId[];
  verified: boolean;
  activationToken?: string;
  activeExpires?: number;
  changePassToken?: string;
  changePassTokenExpires?: number;
  passwordChangedAt?: Date;
  ratedStores: mongoose.Schema.Types.ObjectId[];
}



export interface IUserDocument extends IUser, Document {
  _id: mongoose.Types.ObjectId;
}








const userSchema = new mongoose.Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    role: {
      type: String,
      enum: ["admin", "user", "editor"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    stores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
      },
    ],
    activationToken: { type: String },
    activeExpires: { type: Number },
    verified: {
      type: Boolean,
      default: false,
    },
    changePassToken: {
      type: String,
    },
    changePassTokenExpires: { type: Number },
    passwordChangedAt: {
      type: Date,
    },
    ratedStores : [{
      type: mongoose.Schema.Types.ObjectId,
    }]
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const saltRounds = process.env.HASH_ ? parseInt(process.env.HASH_, 10) : 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error : any) {
    next(error);
  }
});

const User = mongoose.model<IUserDocument>("User", userSchema);
export default User;
