import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from "../Global/Nav";
import toast, { Toaster } from 'react-hot-toast';
import CryptoJS from 'crypto-js'; // Import CryptoJS library
import config from './../../config';

const apiUrl = config.apiUrl;

const SignUpForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Constants for AES encryption
    const AES_SECRET_KEY = CryptoJS.enc.Base64.parse('XGp3hFq56Vdse3sLTtXyQQ=='); // Replace with your AES secret key
    const AES_IV = CryptoJS.enc.Base64.parse('3G1Nd0j0l5BdPmJh01NrYg=='); // Replace with your AES IV

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            // Encrypt form data payload
            const encryptedPayload = CryptoJS.AES.encrypt(
                JSON.stringify({ username, email, password, confirm_password: confirmPassword }),
                AES_SECRET_KEY,
                { iv: AES_IV }
            ).toString();

            // Send encrypted payload to the server
            const response = await fetch(`${apiUrl}/add_user/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ encrypted_content: encryptedPayload }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('User created successfully. Redirecting to sign in...');
                setTimeout(() => {
                    navigate('/signin');
                }, 3000);
            } else {
                setError(data.error || 'Signup failed.');
            }
        } catch (error) {
            console.error('Error during sign up:', error);
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
                                {/* Form fields */}
                                {/* Username */}
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
                                {/* Email */}
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
                                {/* Password */}
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
                                {/* Confirm Password */}
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
                                {/* Submit Button */}
                                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 w-full focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Sign Up</button>

                                {/* Sign In Link */}
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
