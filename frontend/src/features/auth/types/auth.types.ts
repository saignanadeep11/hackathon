import type { UserRole } from 'src/config/permissions';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}
