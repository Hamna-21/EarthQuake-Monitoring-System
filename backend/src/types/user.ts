export interface User {
  email: string;
  password?: string;
  name: string;
  country: string;
  organization?: string;
  authProvider: 'local' | 'google';
  createdAt: Date;
}
