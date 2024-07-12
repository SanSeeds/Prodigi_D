import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from "../Global/Nav";
import toast, { Toaster } from 'react-hot-toast'; 

const SignUpForm: React.FC = () => {
// State to store the username input value
const [username, setUsername] = useState('');
// State to store the email input value
const [email, setEmail] = useState('');
// State to store the password input value
const [password, setPassword] = useState('');
// State to store the confirm password input value
const [confirmPassword, setConfirmPassword] = useState('');
// State to store any error messages
const [error, setError] = useState('');
// Hook to navigate programmatically
const navigate = useNavigate();
// Function to handle form submission
const handleSubmit = async (event: FormEvent) => {
    // Prevent the default form submission behavior
    event.preventDefault();
    // Clear any previous error messages
    setError('');
    // Check if the password and confirm password match
    if (password !== confirmPassword) {
        // If passwords do not match, set an error message
        setError('Passwords do not match.');
        return;
    }
    try {
        // Make a POST request to the server to add a new user
        const response = await fetch('http://43.205.83.83/add_user/', {
            method: 'POST', // Set the request method to POST
            headers: {
                'Content-Type': 'application/json', // Set the request headers to indicate JSON data
            },
            body: JSON.stringify({ username, email, password, confirm_password: confirmPassword }), // Include the form data in the request body
        });
        // Parse the response data as JSON
        const data = await response.json();
        // If the response is successful (status code 200-299)
        if (response.ok) {
            // Show a success message and notify the user
            toast.success('User created successfully. Redirecting to sign in...');
            // Redirect to the sign-in page after a 3-second delay
            setTimeout(() => {
                navigate('/signin');
            }, 3000); // 3000 milliseconds = 3 seconds
        } else {
            // If the response is not successful, set an error message
            setError(data.error || 'Signup failed.');
        }
    } catch (error) {
        // Log any errors that occur during the sign-up process
        console.error('Error during sign up:', error);
        
        // Set a generic error message
        setError('Something went wrong. Please try again later.');
    }
};

    return (
        <>
            <Nav />
            <Toaster /> 
            <section>
                <div className="flex flex-col items-center justify-start mt-12 px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-center md:text-2xl dark:text-black">
                                Sign Up
                            </h1>
                            {error && <div className="text-red-500 text-center">{error}</div>}
                            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-black dark:text-black">Username</label>
                                    <input 
                                        type="text" 
                                        name="username" 
                                        id="username" 
                                        className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        placeholder="John Doe" 
                                        required 
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-black dark:text-black">Email</label>
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
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-black dark:text-black">Password</label>
                                    <input 
                                        type="password" 
                                        name="password" 
                                        id="password" 
                                        className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        placeholder="••••••••" 
                                        required 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Confirm Password</label>
                                    <input 
                                        type="password" 
                                        name="confirm_password" 
                                        id="confirm_password" 
                                        placeholder="••••••••" 
                                        className="border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 w-full focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Sign Up</button>
                                
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                                    Already A User? <a href="/signin" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Log In!</a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SignUpForm;
