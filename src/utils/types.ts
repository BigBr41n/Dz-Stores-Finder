import { Request } from "express";
import { Schema } from "mongoose";



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
  user?: {id : string}
} 

export interface STORE {
  name : string ;
  description : string ; 
  phone : string ; 
  email : string ; 
  website? : string ; 
  keywords : string[];
  owner : Schema.Types.ObjectId ; 
  wilaya : string; 
  city : string; 
  longitude? : string ;
  latitude? : string ;
  storeType : string ;
  socialMediaLinks?: { name: string; link: string }[]
}




export interface RATING {
  storeId : string ; 
  userId : Schema.Types.ObjectId ;
  rating : number ; 
}