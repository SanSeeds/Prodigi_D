// Import necessary dependencies
import React, { useContext, useEffect, useState, FormEvent } from 'react';
import Navbar from '../components/Global/Navbar'; // Import Navbar component
import { AuthContext } from '../components/Global/AuthContext'; // Import AuthContext for authentication
import { ToastContainer, toast } from 'react-toastify'; // Import Toast components for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import Toast CSS

// Define ProfileForm component
const ProfileForm: React.FC = () => {
    // Access authentication context
    const authContext = useContext(AuthContext);

    // Ensure AuthContext is used within an AuthProvider
    if (!authContext) {
        throw new Error("AuthContext must be used within an AuthProvider");
    }

    // Destructure user and accessToken from authContext
    const { user, accessToken } = authContext;

    // Define state for form data, password error, and general errors
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

    const [passwordError, setPasswordError] = useState(''); // State for password error
    const [errors, setErrors] = useState<string[]>([]); // State for general errors

    // Fetch profile data when user changes
    useEffect(() => {
        if (user) {
            setFormData((prevData) => ({
                ...prevData,
                email: user.email // Set email in form data
            }));
            fetchProfileData(); // Fetch profile data
        }
    }, [user]);

    // Function to fetch profile data from the backend
    const fetchProfileData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/profile/', {
                headers: {
                    'Authorization': `Bearer ${accessToken}` // Set authorization header
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
                toast.error('Failed to fetch profile data'); // Show error toast
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
            toast.error('Something went wrong. Please try again later.'); // Show error toast
        }
    };

    // Handle changes in input fields
    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle profile update form submission
    const handleProfileUpdate = async (e: FormEvent) => {
        e.preventDefault();
        setErrors([]); // Reset errors
        try {
            const response = await fetch('http://127.0.0.1:8000/profile/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}` // Set authorization header
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
                toast.success('Profile updated successfully'); // Show success toast
                fetchProfileData(); // Optionally refetch the profile data
            } else {
                const data = await response.json();
                setErrors(data.errors || ['Failed to update profile']); // Set errors from response
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Something went wrong. Please try again later.'); // Show error toast
        }
    };

    // Handle password change form submission
    const handleChangePassword = async (e: FormEvent) => {
        e.preventDefault();
        setPasswordError(''); // Reset password error

        // Check if new passwords match
        if (formData.newPassword !== formData.confirmNewPassword) {
            setPasswordError('New passwords do not match.');
            return;
        }

        try {
            const response = await fetch('http://43.205.83.83/change_password/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}` // Set authorization header
                },
                body: JSON.stringify({
                    current_password: formData.currentPassword,
                    new_password: formData.newPassword,
                    confirm_new_password: formData.confirmNewPassword
                })
            });

            if (response.ok) {
                toast.success('Password changed successfully'); // Show success toast
                setFormData((prevData) => ({
                    ...prevData,
                    currentPassword: '',
                    newPassword: '',
                    confirmNewPassword: ''
                }));
            } else {
                const data = await response.json();
                setPasswordError(data.error); // Set password error from response
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setPasswordError('Something went wrong. Please try again later.'); // Show error toast
        }
    };

    // Render ProfileForm component
    return (
        <>
            <Navbar /> {/* Render Navbar component */}
            <div className="max-w-lg mx-auto p-6">
                <h1 className="text-center text-3xl mb-6 text-black">Profile</h1>
                {/* Form to update profile */}
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
                {/* Display errors */}
                {errors.length > 0 && (
                    <div className="text-red-500 mt-4">
                        {errors.map((error, index) => (
                            <p key={index}>{error}</p>
                        ))}
                    </div>
                )}
                <h2 className="mt-8 text-xl font-bold">Change Password</h2>
                {/* Form to change password */}
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
            <ToastContainer position="bottom-right" autoClose={5000} /> {/* Toast container for notifications */}
        </>
    );
};

export default ProfileForm;
