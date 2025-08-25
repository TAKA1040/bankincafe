import { User } from '@supabase/supabase-js'

export interface AuthUser extends User {
  // ��n�������ƣLB�p��
}

export interface AuthState {
  user: AuthUser | null
  loading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials extends LoginCredentials {
  confirmPassword: string
}