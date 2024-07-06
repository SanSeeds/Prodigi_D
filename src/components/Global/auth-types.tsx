// Defines an interface for a User object
export interface User {
  // The user's email address
  email: string;
}

// Defines an interface for the authentication context type
export interface AuthContextType {
  // The current authenticated user, or null if not authenticated
  user: User | null;
  
  // A function to log in a user, which takes a User object as an argument
  login: (userData: User) => void;
  
  // A function to log out the current user
  logout: () => void;
}
