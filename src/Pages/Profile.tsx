import React, { useContext, useEffect, useState, FormEvent } from 'react';
import Navbar from '../components/Global/Navbar';
import { AuthContext } from '../components/Global/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../config';
import { Link } from 'react-router-dom';
import { LuEye, LuEyeOff } from "react-icons/lu";

const apiUrl = config.apiUrl;

const ProfileForm: React.FC = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("AuthContext must be used within an AuthProvider");
    }

    const { user, accessToken } = authContext;

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        bio: '',
        location: '',
        birthDate: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const [passwordError, setPasswordError] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData((prevData) => ({
                ...prevData,
                email: user.email
            }));
            fetchProfileData();
        }
    }, [user]);

    const fetchProfileData = async () => {
        try {
            const response = await fetch(`${apiUrl}/profile/`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setFormData({
                    firstName: data.user.first_name,
                    lastName: data.user.last_name,
                    email: data.user.email,
                    bio: data.profile.bio,
                    location: data.profile.location,
                    birthDate: data.profile.birth_date,
                    currentPassword: '',
                    newPassword: '',
                    confirmNewPassword: ''
                });
            } else {
                toast.error('Failed to fetch profile data');
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
            toast.error('Something went wrong. Please try again later.');
        }
    };

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleProfileUpdate = async (e: FormEvent) => {
        e.preventDefault();
        setErrors([]);
        try {
            const response = await fetch(`${apiUrl}/profile/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    bio: formData.bio,
                    location: formData.location,
                    birth_date: formData.birthDate
                })
            });

            if (response.ok) {
                toast.success('Profile updated successfully');
                fetchProfileData();
            } else {
                const data = await response.json();
                setErrors(data.errors || ['Failed to update profile']);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Something went wrong. Please try again later.');
        }
    };

    const handleChangePassword = async (e: FormEvent) => {
        e.preventDefault();
        setPasswordError('');

        if (formData.newPassword !== formData.confirmNewPassword) {
            setPasswordError('New passwords do not match.');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/change_password/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    current_password: formData.currentPassword,
                    new_password: formData.newPassword,
                    confirm_new_password: formData.confirmNewPassword
                })
            });

            if (response.ok) {
                toast.success('Password changed successfully');
                setFormData((prevData) => ({
                    ...prevData,
                    currentPassword: '',
                    newPassword: '',
                    confirmNewPassword: ''
                }));
            } else {
                const data = await response.json();
                setPasswordError(data.error);
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setPasswordError('Something went wrong. Please try again later.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="max-w-lg mx-auto p-6">
                <h1 className="text-center text-3xl mb-6 text-black">Profile</h1>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="flex space-x-4">
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="First Name"
                            className="w-full px-3 py-2 border rounded-md"
                        />
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Last Name"
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full px-3 py-2 border rounded-md"
                        readOnly
                    />
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Location"
                        className="w-full px-3 py-2 border rounded-md"
                    />
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Bio"
                        className="w-full px-3 py-2 border rounded-md"
                    />
                    <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        placeholder="dd-mm-yyyy"
                        className="w-full px-3 py-2 border rounded-md"
                    />
                    <input
                        type="text"
                        name="birthDate"
                        onChange={handleChange}
                        placeholder="subscription"
                        className="w-full px-3 py-2 border rounded-md"
                        disabled
                    />
                    <div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            Update Profile
                        </button> &nbsp;    
                        <Link to='/subscription'>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                            >
                                Update Subscription
                            </button>
                        </Link>
                    </div>
                </form>

                {errors.length > 0 && (
                    <div className="text-red-500 mt-4">
                        {errors.map((error, index) => (
                            <p key={index}>{error}</p>
                        ))}
                    </div>
                )}

                <h2 className="mt-8 text-xl font-bold">Change Password</h2>
                <form onSubmit={handleChangePassword} className="space-y-4 mt-4">
                    <div className="flex">
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            placeholder="Current Password"
                            className="w-full px-3 py-2 border rounded-md"
                        />
                        <button
                            type="button"
                            className="ml-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-primary-600 focus:border-primary-600 dark:text-black dark:border-gray-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                            {showCurrentPassword ? <LuEyeOff /> : <LuEye />}
                        </button>
                    </div>
                    <div className="flex">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="New Password"
                            className="w-full px-3 py-2 border rounded-md"
                        />
                        <button
                            type="button"
                            className="ml-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-primary-600 focus:border-primary-600 dark:text-black dark:border-gray-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <LuEyeOff /> : <LuEye />}
                        </button>
                    </div>
                    <div className="flex">
                        <input
                            type={showConfirmNewPassword ? "text" : "password"}
                            name="confirmNewPassword"
                            value={formData.confirmNewPassword}
                            onChange={handleChange}
                            placeholder="Confirm New Password"
                            className="w-full px-3 py-2 border rounded-md"
                        />
                        <button
                            type="button"
                            className="ml-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-primary-600 focus:border-primary-600 dark:text-black dark:border-gray-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                        >
                            {showConfirmNewPassword ? <LuEyeOff /> : <LuEye />}
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Change Password
                    </button>
                    {passwordError && (
                        <div className="text-red-500 mt-4">{passwordError}</div>
                    )}
                </form>
            </div>
            <ToastContainer position="bottom-right" autoClose={5000} />
        </>
    );
};

export default ProfileForm;
