// auth-types.ts
export interface User {
    email: string;
  }
  
  export interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
  }
  