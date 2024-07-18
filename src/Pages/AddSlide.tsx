import { useState, useContext, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Navbar from '../components/Global/Navbar';
import { AuthContext } from '../components/Global/AuthContext';
import CryptoJS from 'crypto-js';

const ENCRYPTION_IV = CryptoJS.enc.Base64.parse("3G1Nd0j0l5BdPmJh01NrYg==");
const ENCRYPTION_SECRET_KEY = CryptoJS.enc.Base64.parse("XGp3hFq56Vdse3sLTtXyQQ==");

function AddSlide() {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        bgImage: null as File | null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('AuthContext must be used within an AuthProvider');
    }

    const { accessToken } = authContext;

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFormData({ ...formData, bgImage: e.target.files[0] });
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = JSON.stringify({
                title: formData.title,
                content: formData.content,
                bgImagePath: formData.bgImage ? formData.bgImage.name : null
            });

            const encryptedPayload = CryptoJS.AES.encrypt(payload, ENCRYPTION_SECRET_KEY, { iv: ENCRYPTION_IV }).toString();

            const form = new FormData();
            form.append('encrypted_content', encryptedPayload);
            if (formData.bgImage) {
                form.append('bg_image', formData.bgImage);
            }

            const response = await axios.post('http://localhost:8000/add_slide_api/', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (response.data) {
                alert('Slide added successfully');
            } else {
                setError('Failed to add slide. No content received.');
            }
        } catch (error) {
            console.error('Error adding slide:', error);
            setError('Failed to add slide. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <h1 className="text-center text-3xl mt-5 font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>Add Slide</h1>
            <form className="w-full max-w-3xl mx-auto p-8" onSubmit={handleSubmit}>
                <div className="flex flex-col mb-6">
                    <label className="mb-2 font-bold text-black">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="p-3 border rounded shadow-sm text-black"
                    />
                </div>
                <div className="flex flex-col mb-6">
                    <label className="mb-2 font-bold text-black">Content</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        className="p-3 border rounded shadow-sm text-black"
                    />
                </div>
                <div className="flex flex-col mb-6">
                    <label className="mb-2 font-bold text-black">Background Image</label>
                    <input
                        type="file"
                        name="bgImage"
                        onChange={handleFileChange}
                        className="p-3 border rounded shadow-sm text-black"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full p-3 bg-blue-500 text-white font-bold rounded shadow-sm"
                    disabled={loading}
                >
                    {loading ? "Adding..." : "Add Slide"}
                </button>
                {error && <div className="mt-4 text-red-500">{error}</div>}
            </form>
        </>
    );
}

export default AddSlide;
