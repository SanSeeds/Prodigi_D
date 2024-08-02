// import React, { useState, FormEvent } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Nav from "../Global/Nav";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import CryptoJS from 'crypto-js'; // Import CryptoJS library
// import config from './../../config';
// import { LuEye, LuEyeOff } from "react-icons/lu";

// const apiUrl = config.apiUrl;

// const SignUpForm: React.FC = () => {
//     const [firstName, setFirstName] = useState('');
//     const [lastName, setLastName] = useState('');
//     const [username, setUsername] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//     const navigate = useNavigate();

//     // Constants for AES encryption
//     const AES_SECRET_KEY = CryptoJS.enc.Base64.parse('XGp3hFq56Vdse3sLTtXyQQ=='); // Replace with your AES secret key
//     const AES_IV = CryptoJS.enc.Base64.parse('3G1Nd0j0l5BdPmJh01NrYg=='); // Replace with your AES IV

//     const validatePassword = (password: string): boolean => {
//         const hasUpperCase = /[A-Z]/.test(password);
//         const hasLowerCase = /[a-z]/.test(password);
//         const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
//         const hasMinLength = password.length >= 8;

//         if (!hasUpperCase) {
//             toast.error('Password must contain at least one uppercase letter.');
//             return false;
//         }

//         if (!hasLowerCase) {
//             toast.error('Password must contain at least one lowercase letter.');
//             return false;
//         }

//         if (!hasSpecialChar) {
//             toast.error('Password must contain at least one special character.');
//             return false;
//         }

//         if (!hasMinLength) {
//             toast.error('Password must be at least 8 characters long.');
//             return false;
//         }

//         return true;
//     };

//     const handleSubmit = async (event: FormEvent) => {
//         event.preventDefault();

//         if (password !== confirmPassword) {
//             toast.error('Passwords do not match.');
//             return;
//         }

//         if (!validatePassword(password)) {
//             return;
//         }

//         try {
//             // Encrypt form data payload
//             const encryptedPayload = CryptoJS.AES.encrypt(
//                 JSON.stringify({ first_name: firstName, last_name: lastName, username, email, password, confirm_password: confirmPassword }),
//                 AES_SECRET_KEY,
//                 { iv: AES_IV }
//             ).toString();

//             // Send encrypted payload to the server
//             const response = await fetch(`${apiUrl}/add_user/`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ encrypted_content: encryptedPayload }),
//             });
            
//             const data = await response.json();

           

//             if (response.ok) {
//                 toast.success('User created successfully. Redirecting to sign in...');
//                 setTimeout(() => {
//                     navigate('/signin');
//                 }, 3000);
//             } else {
//                 toast.error(data.error || 'Signup failed.');
//             }
//         } catch (error) {
//             console.error('Error during sign up:', error);
//             toast.error('Something went wrong. Please try again later.');
//         }
//     };

//     return (
//         <>
//             <Nav />
//             <ToastContainer position="bottom-right" autoClose={5000} />
//             <div className="flex flex-col items-center min-h-screen">
//                 <div className="w-full max-w-xl p-8">
//                     <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">Sign Up</h1>
//                     <form onSubmit={handleSubmit} className="space-y-6">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <div className="flex flex-col">
//                                 <label className="mb-2 text-gray-700">First Name</label>
//                                 <input
//                                     type="text"
//                                     name="firstName"
//                                     className="p-3 border rounded-lg shadow-sm text-gray-900"
//                                     placeholder='Enter First Name'
//                                     value={firstName}
//                                     onChange={(e) => setFirstName(e.target.value)}
//                                 />
//                             </div>
//                             <div className="flex flex-col">
//                                 <label className="mb-2 text-gray-700">Last Name</label>
//                                 <input
//                                     type="text"
//                                     name="lastName"
//                                     className="p-3 border rounded-lg shadow-sm text-gray-900"
//                                     placeholder='Enter Last Name'
//                                     value={lastName}
//                                     onChange={(e) => setLastName(e.target.value)}
//                                 />
//                             </div>
//                         </div>
//                         <div className="flex flex-col">
//                             <label className="mb-2 text-gray-700">Username</label>
//                             <input
//                                 type="text"
//                                 name="username"
//                                 className="p-3 border rounded-lg shadow-sm text-gray-900"
//                                 placeholder='Enter Username'
//                                 value={username}
//                                 onChange={(e) => setUsername(e.target.value)}
//                             />
//                         </div>
//                         <div className="flex flex-col">
//                             <label className="mb-2 text-gray-700">Email</label>
//                             <input
//                                 type="email"
//                                 name="email"
//                                 className="p-3 border rounded-lg shadow-sm text-gray-900"
//                                 placeholder='Enter Email'
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                             />
//                         </div>
//                         <div className="flex flex-col">
//                             <label className="mb-2 text-gray-700">Password</label>
//                             <div className="flex">
//                                 <input
//                                     type={showPassword ? 'text' : 'password'}
//                                     name="password"
//                                     className="w-full p-3 border rounded-lg shadow-sm text-gray-900"
//                                     placeholder='Enter Password'
//                                     value={password}
//                                     onChange={(e) => setPassword(e.target.value)}
//                                 />
//                                 <button
//                                     type="button"
//                                     className="ml-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-primary-600 focus:border-primary-600 dark:text-black dark:border-gray-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                                     onClick={() => setShowPassword(!showPassword)}
//                                 >
//                                     {showPassword ? <LuEyeOff /> : <LuEye />}
//                                 </button>
//                             </div>
//                         </div>
//                         <div className="flex flex-col">
//                             <label className="mb-2 text-gray-700">Confirm Password</label>
//                             <div className="flex">
//                                 <input
//                                     type={showConfirmPassword ? 'text' : 'password'}
//                                     name="confirmPassword"
//                                     className="w-full p-3 border rounded-lg shadow-sm text-gray-900"
//                                     placeholder='Enter Confirm Password'
//                                     value={confirmPassword}
//                                     onChange={(e) => setConfirmPassword(e.target.value)}
//                                 />
//                                 <button
//                                     type="button"
//                                     className="ml-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-primary-600 focus:border-primary-600 dark:text-black dark:border-gray-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                 >
//                                     {showConfirmPassword ? <LuEyeOff /> : <LuEye />}
//                                 </button>
//                             </div>
//                         </div>
//                         <button
//                             type="submit"
//                             className="w-full py-3 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
//                         >
//                             Sign Up
//                         </button>
//                     </form>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default SignUpForm;

import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from "../Global/Nav";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from './../../config';
import { LuEye, LuEyeOff } from "react-icons/lu";

const apiUrl = config.apiUrl;

const SignUpForm: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

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

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        if (!validatePassword(password)) {
            return;
        }

        try {
            // Prepare form data payload
            const payload = { first_name: firstName, last_name: lastName, username, email, password, confirm_password: confirmPassword };

            // Send payload to the server
            const response = await fetch(`${apiUrl}/add_user/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('User created successfully. Redirecting to sign in...');
                setTimeout(() => {
                    navigate('/signin');
                }, 3000);
            } else {
                toast.error(data.error || 'Signup failed.');
            }
        } catch (error) {
            console.error('Error during sign up:', error);
            toast.error('Something went wrong. Please try again later.');
        }
    };

    return (
        <>
            <Nav />
            <ToastContainer position="bottom-right" autoClose={5000} />
            <div className="flex flex-col items-center min-h-screen">
                <div className="w-full max-w-xl p-8">
                    <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">Sign Up</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="mb-2 text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    className="p-3 border rounded-lg shadow-sm text-gray-900"
                                    placeholder='Enter First Name'
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    className="p-3 border rounded-lg shadow-sm text-gray-900"
                                    placeholder='Enter Last Name'
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-2 text-gray-700">Username</label>
                            <input
                                type="text"
                                name="username"
                                className="p-3 border rounded-lg shadow-sm text-gray-900"
                                placeholder='Enter Username'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-2 text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="p-3 border rounded-lg shadow-sm text-gray-900"
                                placeholder='Enter Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-2 text-gray-700">Password</label>
                            <div className="flex">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    className="w-full p-3 border rounded-lg shadow-sm text-gray-900"
                                    placeholder='Enter Password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="ml-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-primary-600 focus:border-primary-600 dark:text-black dark:border-gray-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <LuEyeOff /> : <LuEye />}
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-2 text-gray-700">Confirm Password</label>
                            <div className="flex">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    className="w-full p-3 border rounded-lg shadow-sm text-gray-900"
                                    placeholder='Enter Confirm Password'
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
                        <button
                            type="submit"
                            className="w-full py-3 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default SignUpForm;
