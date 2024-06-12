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
