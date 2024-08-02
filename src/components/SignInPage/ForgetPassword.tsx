import React, { useState, useContext, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Global/AuthContext';
import Nav from "../Global/Nav";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from './../../config';
import { LuEye, LuEyeOff } from "react-icons/lu";

const apiUrl = config.apiUrl;

const ForgetPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [, setError] = useState('');
    const [step, setStep] = useState(1);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("AuthContext must be used within an AuthProvider");
    }

    const validatePassword = (password: string): boolean => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasMinLength = password.length >= 8;

        if (!hasUpperCase) {
            toast.error('Password must contain at least one uppercase letter.');
            return false;
        }

        if (!hasLowerCase) {
            toast.error('Password must contain at least one lowercase letter.');
            return false;
        }

        if (!hasSpecialChar) {
            toast.error('Password must contain at least one special character.');
            return false;
        }

        if (!hasMinLength) {
            toast.error('Password must be at least 8 characters long.');
            return false;
        }

        return true;
    };

    const handleEmailSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError('');
    
        try {
            const response = await axios.post(`${apiUrl}/send_otp/`, { email });
    
            if (response.status === 200) {
                setStep(2);
            } else {
                // Handle specific error responses from the backend
                const errorMessage = response.data.error || 'An error occurred.';
                setError(errorMessage);
                toast.error(errorMessage);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.error || 'Something went wrong. Please try again later.';
                setError(errorMessage);
                toast.error(errorMessage);
            } else {
                console.error('Error during send OTP:', error);
                setError('Something went wrong. Please try again later.');
                toast.error('Something went wrong. Please try again later.');
            }
        }
    };
    

    const handleResetPasswordSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        if (!validatePassword(newPassword)) {
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/reset_password/`, {
                email,
                otp,
                new_password: newPassword,
                confirm_password: confirmPassword,
            });

            if (response.status === 200) {
                navigate('/signin');
            } else {
                const errorMessage = response.data.error || 'Something went wrong. Please try again later.';
                setError(errorMessage);
                toast.error(errorMessage);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.error || 'Something went wrong. Please try again later.';
                setError(errorMessage);
                toast.error(errorMessage);
            } else {
                console.error('Error during reset password:', error);
                const errorMessage = 'Something went wrong. Please try again later.';
                setError(errorMessage);
                toast.error(errorMessage);
            }
        }
    };

    const handleResendOtp = async () => {
        try {
            const response = await axios.post(`${apiUrl}/send_otp/`, { email });

            if (response.status === 200) {
                toast.success('OTP has been resent to your email.');
            } else {
                toast.error(response.data.error || 'Failed to resend OTP.');
            }
        } catch (error) {
            console.error('Error during resend OTP:', error);
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
                                            <div className="flex">
                                                <input 
                                                    type={showNewPassword ? 'text' : 'password'}
                                                    name="new_password" 
                                                    id="new_password" 
                                                    className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                    placeholder="New Password" 
                                                    required 
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    className="ml-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-primary-600 focus:border-primary-600 dark:text-black dark:border-gray-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                >
                                                    {showNewPassword ? <LuEyeOff /> : <LuEye />}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-black dark:text-black">Confirm Password</label>
                                            <div className="flex">
                                                <input 
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    name="confirm_password" 
                                                    id="confirm_password" 
                                                    className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                    placeholder="Confirm Password" 
                                                    required 
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    className="ml-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-primary-600 focus:border-primary-600 dark:text-black dark:border-gray-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                >
                                                    {showConfirmPassword ? <LuEyeOff /> : <LuEye />}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                                <button 
                                    type="submit"
                                    className="w-full py-3 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                                    disabled={step === 1 && !email || step === 2 && (!otp || !validatePassword(newPassword) || !validatePassword(confirmPassword))}
                                >
                                    {step === 1 ? 'Send OTP' : 'Reset Password'}
                                </button>
                                {step === 2 && (
                                    <p 
                                        className="text-sm text-center font-medium text-primary-600 hover:underline dark:text-primary-500 cursor-pointer"
                                        onClick={handleResendOtp}
                                    >
                                        Resend OTP
                                    </p>
                                )}
                                <p className="text-sm text-center font-light text-gray-500 dark:text-gray-400">
                                    Remember your password? <a href="/signin" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign In</a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <ToastContainer position='bottom-right' autoClose={5000} />
        </>
    );
};

export default ForgetPassword;
