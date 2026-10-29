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
