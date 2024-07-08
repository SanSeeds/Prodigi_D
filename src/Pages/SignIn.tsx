import React, { useState, useContext, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { AuthContext } from '../components/Global/AuthContext'; // Import AuthContext for authentication
import Nav from "../components/Global/Nav"; // Import Nav component
import { ToastContainer, toast } from 'react-toastify'; // Import Toast components for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import Toast CSS

// Define SignInForm component
const SignInForm: React.FC = () => {
    // Define state for email and password input fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [, setError] = useState(''); // Define state for error messages
    const navigate = useNavigate(); // Initialize useNavigate for navigation
    const authContext = useContext(AuthContext); // Access authentication context

    // Ensure AuthContext is used within an AuthProvider
    if (!authContext) {
        throw new Error("AuthContext must be used within an AuthProvider");
    }

    const { login } = authContext; // Destructure login function from authContext

    // Handle form submission
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault(); // Prevent default form submission
        setError(''); // Reset error state

        try {
            // Send POST request to sign-in endpoint
            const response = await fetch('http://127.0.0.1:8000/signin/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set content type to JSON
                },
                body: JSON.stringify({ email, password }), // Send email and password in the request body
            });

            const data = await response.json(); // Parse the JSON response
            if (response.ok) {
                const accessToken = data.access; // Extract access token from response
                const refreshToken = data.refresh; // Extract refresh token from response
                const expiry = 3600 * 3600; // Set token expiry time to 1 hour in seconds
                login({ email }, accessToken, refreshToken, expiry); // Save user info and tokens to context
                toast.success('Logged in successfully'); // Show success toast
                navigate('/dashboard'); // Navigate to dashboard
            } else {
                toast.error(data.error); // Show error toast with response error message
                setError(data.error); // Set error state with response error message
            }
        } catch (error) {
            console.error('Error during sign in:', error);
            toast.error('Something went wrong. Please try again later.'); // Show error toast for generic error
            setError('Something went wrong. Please try again later.'); // Set error state for generic error
        }
    };
    
    return (
        <>
            <Nav />
            <section>
                <div className="flex flex-col items-center justify-start mt-12 px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-center md:text-2xl dark:text-black">
                                Sign In
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-black dark:text-black">User Email</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        id="email" 
                                        className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        placeholder="name@company.com" 
                                        required 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Password</label>
                                    <input 
                                        type="password" 
                                        name="password" 
                                        id="password" 
                                        placeholder="••••••••" 
                                        className="border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 w-full focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Log In</button>
                                
                                <span className="text-sm font-light text-blue dark:text-blue-400 text-center block"><a href="/forgotPassword">Forget Password?</a></span>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                                    New Here? <a href="/signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign Up!</a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <ToastContainer position="bottom-right" autoClose={5000} />
        </>
    );
};

export default SignInForm;
