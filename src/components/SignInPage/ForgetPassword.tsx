import React, { useState, useContext, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Global/AuthContext';
import Nav from "../Global/Nav";

const ForgetPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [step, setStep] = useState(1); 
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("AuthContext must be used within an AuthProvider");
    }

    const handleEmailSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:8000/send_otp/', {
                email: email,
            });

            if (response.status === 200) {
                setStep(2); // Move to step 2 to enter OTP and new password
            } else {
                setError(response.data.error);
            }
        } catch (error) {
            console.error('Error during send OTP:', error);
            setError('Something went wrong. Please try again later.');
        }
    };

    const handleResetPasswordSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://127.0.0.1:8000/reset_password/', {
                email: email,
                otp: otp,
                new_password: newPassword,
                confirm_password: confirmPassword,
            });

            if (response.status === 200) {
                navigate('/signin'); // Redirect to sign-in page
            } else {
                setError(response.data.error);
            }
        } catch (error) {
            console.error('Error during reset password:', error);
            setError('Something went wrong. Please try again later.');
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
                            {error && <div className="text-red-500 text-center">{error}</div>}
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
        </>
    );
};

export default ForgetPassword;
