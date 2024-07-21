import React, { useState, useContext, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/Global/AuthContext';
import Nav from "../components/Global/Nav";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import config from '../config';

const apiUrl = config.apiUrl

const AES_IV = CryptoJS.enc.Base64.parse("3G1Nd0j0l5BdPmJh01NrYg==");
const AES_SECRET_KEY = CryptoJS.enc.Base64.parse("XGp3hFq56Vdse3sLTtXyQQ==");

const SignInForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [, setError] = useState('');
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("AuthContext must be used within an AuthProvider");
    }

    const { login } = authContext;

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError('');

        try {
            const payload = JSON.stringify({ email, password });
            const encryptedPayload = CryptoJS.AES.encrypt(payload, AES_SECRET_KEY, { iv: AES_IV }).toString();

            const response = await axios.post<{ encrypted_content: string }>(
                `${apiUrl}/signin/`,
                { encrypted_content: encryptedPayload },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (response.data && response.data.encrypted_content) {
                const decryptedBytes = CryptoJS.AES.decrypt(response.data.encrypted_content, AES_SECRET_KEY, { iv: AES_IV });
                const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);

                if (!decryptedText) {
                    throw new Error('Decryption failed');
                }

                const data = JSON.parse(decryptedText);
                const accessToken = data.access;
                const refreshToken = data.refresh;
                const expiry = 3600 * 3600;
                login({ email }, accessToken, refreshToken, expiry);
                toast.success('Logged in successfully');
                navigate('/dashboard');
            } else {
                toast.error('Failed to sign in. No content received.');
                setError('Failed to sign in. No content received.');
            }
        } catch (error: any) {
            console.error('Error during sign in:', error);
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
                setError(error.response.data.error);
            } else {
                toast.error('Something went wrong. Please try again later.');
                setError('Something went wrong. Please try again later.');
            }
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
