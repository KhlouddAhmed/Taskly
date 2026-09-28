export interface SignUpRequest {
  email: string;
  password: string;
  full_name: string;
  job_title: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}