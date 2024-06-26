import { Request } from "express";
import { Types } from "mongoose";



export interface SIGNUP {
  name: string;
  email: string;
  password: string;
}

export interface LOGIN {
  email: string;
  password: string;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface PASS {
  userId : string | undefined;
  old: string | null;
  new: string | null;
}


export interface AuthRequest extends Request {
  user?: {id : string , role : string }
} 

export interface STORE {
  name : string ;
  description : string ; 
  phone : string ; 
  email : string ; 
  website? : string ; 
  keywords : string[];
  wilaya : string; 
  city : string; 
  longitude? : string ;
  latitude? : string ;
  storeType : string ;
  socialMediaLinks?: { name: string; link: string }[]
}




export interface RATING {
  storeId : Types.ObjectId ; 
  userId : Types.ObjectId ;
  rating : number ; 
}