export interface User {
  id?: number;
  username?: string;
  name?: string;
  email: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password?: string;
}

export interface SignUpResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}
