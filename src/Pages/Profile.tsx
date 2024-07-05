import React, { useContext, useEffect, useState, FormEvent } from 'react';
import Navbar from '../components/Global/Navbar';
import { AuthContext } from '../components/Global/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            const response = await fetch('http://127.0.0.1:8000/profile/', {
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
            const response = await fetch('http://127.0.0.1:8000/profile/', {
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
                fetchProfileData(); // Optionally refetch the profile data
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
            const response = await fetch('http://127.0.0.1:8000/change_password/', {
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
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Update Profile
                    </button>
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
                    <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="Current Password"
                        className="w-full px-3 py-2 border rounded-md"
                    />
                    <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="New Password"
                        className="w-full px-3 py-2 border rounded-md"
                    />
                    <input
                        type="password"
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleChange}
                        placeholder="Confirm New Password"
                        className="w-full px-3 py-2 border rounded-md"
                    />
                    {passwordError && <p className="text-red-500">{passwordError}</p>}
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Change Password
                    </button>
                </form>
            </div>
            <ToastContainer position="bottom-right" autoClose={5000} />
        </>
    );
};

export default ProfileForm;
