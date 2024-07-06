// Import the useContext hook from React
import { useContext } from 'react';

// Import the Navigate and Outlet components from react-router-dom
import { Navigate, Outlet } from 'react-router-dom';

// Import the AuthContext from the AuthContext file
import { AuthContext } from './AuthContext';

// Define the PrivateRoute component
const PrivateRoute = () => {
    // Use the useContext hook to access the AuthContext
    const authContext = useContext(AuthContext);

    // If AuthContext is not available, throw an error
    if (!authContext) {
        throw new Error("AuthContext must be used within an AuthProvider");
    }

    // Destructure the user object from the authContext
    const { user } = authContext;

    // If the user is authenticated, render the child components using Outlet
    // Otherwise, navigate to the sign-in page
    return user ? <Outlet /> : <Navigate to="/signin" />;
};

// Export the PrivateRoute component as the default export
export default PrivateRoute;
