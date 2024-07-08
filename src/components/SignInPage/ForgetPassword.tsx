import React, { useState, useContext, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Global/AuthContext';
import Nav from "../Global/Nav";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgetPassword: React.FC = () => {
    // State variables using useState hook
    const [email, setEmail] = useState('');  // State for email input
    const [otp, setOtp] = useState('');  // State for OTP input
    const [newPassword, setNewPassword] = useState('');  // State for new password input
    const [confirmPassword, setConfirmPassword] = useState('');  // State for confirm password input
    const [, setError] = useState('');  // State for error messages
    const [step, setStep] = useState(1);  // State for current step in password reset process
    const navigate = useNavigate();  // Navigation hook for redirecting to different routes
    const authContext = useContext(AuthContext);  // Accessing authentication context

    // Check if the authContext is not defined
    if (!authContext) {
        // If authContext is not defined, throw an error
        throw new Error("AuthContext must be used within an AuthProvider");
    }

    // Function to handle email submission for OTP
    const handleEmailSubmit = async (event: FormEvent) => {
        // Prevent the default form submission behavior
        event.preventDefault();
        
        // Clear any previous error messages
        setError('');

        try {
            // Make a POST request to send the OTP to the provided email
            const response = await axios.post('http://localhost:8000/send_otp/', {
                // Include the email in the request body
                email: email,
            });

            // Check if the response status is 200 (success)
            if (response.status === 200) {
                // Move to step 2 to enter OTP and new password
                setStep(2);
            } else {
                // If response is not successful, set an error message
                setError(response.data.error);
                toast.error(response.data.error);
            }
        } catch (error) {
            // Log any errors that occur during the send OTP process
            console.error('Error during send OTP:', error);
            
            // Set a generic error message
            setError('Something went wrong. Please try again later.');
            toast.error('Something went wrong. Please try again later.');
        }
    };

    // Function to handle reset password form submission
    const handleResetPasswordSubmit = async (event: FormEvent) => {
        // Prevent the default form submission behavior
        event.preventDefault();
        
        // Clear any previous error messages
        setError('');

        // Check if the new password and confirm password match
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            toast.error('Passwords do not match.');
            return;
        }

        try {
            // Make a POST request to reset the password
            const response = await axios.post('http://127.0.0.1:8000/reset_password/', {
                // Include the email, OTP, new password, and confirm password in the request body
                email: email,
                otp: otp,
                new_password: newPassword,
                confirm_password: confirmPassword,
            });

            // Check if the response status is 200 (success)
            if (response.status === 200) {
                // Redirect to the sign-in page
                navigate('/signin');
            } else {
                // If response is not successful, set an error message
                setError(response.data.error);
                toast.error(response.data.error);
            }
        } catch (error) {
            // Log any errors that occur during the reset password process
            console.error('Error during reset password:', error);
            
            // Set a generic error message
            setError('Something went wrong. Please try again later.');
            toast.error('Something went wrong. Please try again later.');
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
                                {step === 1 ? 'Forgot Password?' : 'Reset Password'}
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={step === 1 ? handleEmailSubmit : handleResetPasswordSubmit}>
                                {step === 1 && (
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
                                )}
                                {step === 2 && (
                                    <>
                                        <div>
                                            <label htmlFor="otp" className="block mb-2 text-sm font-medium text-black dark:text-black">OTP</label>
                                            <input 
                                                type="text" 
                                                name="otp" 
                                                id="otp" 
                                                className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                placeholder="Enter OTP" 
                                                required 
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="new_password" className="block mb-2 text-sm font-medium text-black dark:text-black">New Password</label>
                                            <input 
                                                type="password" 
                                                name="new_password" 
                                                id="new_password" 
                                                className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                placeholder="New Password" 
                                                required 
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-black dark:text-black">Confirm Password</label>
                                            <input 
                                                type="password" 
                                                name="confirm_password" 
                                                id="confirm_password" 
                                                className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                placeholder="Confirm Password" 
                                                required 
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}
                                
                                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 w-full focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                    {step === 1 ? 'Send OTP' : 'Reset Password'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
      <ToastContainer position="bottom-right" autoClose={5000} />

        </>
    );
};

export default ForgetPassword;
