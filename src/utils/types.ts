import { Request } from "express";



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