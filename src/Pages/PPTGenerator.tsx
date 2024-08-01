import { useState, useContext, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../components/Global/Navbar";
import { AuthContext } from '../components/Global/AuthContext';
import { saveAs } from 'file-saver';
import config from '../config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiUrl = config.apiUrl;

function CreatePresentationService() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [formData, setFormData] = useState({
        title: '',
        num_slides: 1,
        special_instructions: '',
        bg_image: null as File | null,
        document: null as File | null
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
        if (e.target.files && e.target.files[0]) {
            const { name, files } = e.target;
            const file = files[0];

            if (name === 'bg_image') {
                const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/svg+xml'];

                if (allowedImageTypes.includes(file.type)) {
                    setFormData({ ...formData, [name]: file });
                } else {
                    toast.error('Invalid image type. Please upload a JPEG, PNG, GIF, BMP, or SVG file.');
                    e.target.value = ''; // Clear the input field
                }
            } else if (name === 'document') {
                const allowedDocTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];

                if (allowedDocTypes.includes(file.type)) {
                    setFormData({ ...formData, [name]: file });
                } else {
                    toast.error('Invalid file type. Please upload a PDF, DOCX, XLS, or XLSX file.');
                    e.target.value = ''; // Clear the input field
                }
            }
        }
    };


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        try {
            const payload = new FormData();
            payload.append('data', JSON.stringify({
                title: formData.title,
                num_slides: formData.num_slides,
                special_instructions: formData.special_instructions
            }));
    
            if (formData.bg_image) {
                payload.append('bg_image', formData.bg_image);
            }
            console.log(document);
            
            if (formData.document) {
                payload.append('document', formData.document);
            }
    
            const response = await axios.post(`${apiUrl}/create_presentation/`, payload, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                responseType: 'blob'
            });
    
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
            saveAs(blob, 'SmartOffice_Assistant_Presentation.pptx');
    
            toast.success('Presentation created and downloaded successfully!');
        } catch (error) {
            console.error('Error creating presentation:', error);
            setError('Failed to create presentation. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    
    return (
        <>
            <Navbar />
            <div className="min-h-screen flex ">
                <div className="w-full max-w-3xl mx-auto p-8">
                    <h1 className="text-center text-xl font-semibold">Create Presentation</h1>
                    <form className="w-full max-w-3xl mx-auto p-8" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="flex flex-col">
                                <label className="mb-2 text-black">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="p-3 border rounded shadow-sm text-black"
                                    placeholder="Enter the presentation title"
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 text-black">Number of Slides</label>
                                <input
                                    type="number"
                                    name="num_slides"
                                    value={formData.num_slides}
                                    onChange={handleChange}
                                    className="p-3 border rounded shadow-sm text-black"
                                    min="1"
                                    required
                                />
                            </div>
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 text-black">Special Instructions</label>
                                <textarea
                                    name="special_instructions"
                                    value={formData.special_instructions}
                                    onChange={handleChange}
                                    className="p-3 border rounded shadow-sm text-black"
                                    placeholder="Enter any special instructions"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                                <div className="flex flex-col mt-5">
                                    <label className="mb-2 text-black">Background Image (.jpg, .png)</label>
                                    <input
                                        type="file"
                                        name="bg_image"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="p-3 border rounded shadow-sm text-black"
                                    />
                                </div>
                                <div className="flex flex-col mt-5">
                                    <label className="mb-2 text-black">Document(.pdf, .docx, .xlsx) </label>
                                    <input
                                        type="file"
                                        name="document"
                                        accept=".docx,.pdf,.xlsx,.xls"
                                        onChange={handleFileChange}
                                        className="p-3 border rounded shadow-sm text-black"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-center mt-4">
                                <button type="submit"
                                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                    disabled={loading}>
                                    {loading ? "Creating..." : "Create Presentation"}
                                </button>
                            </div>
                    </form>
                    {error && <div className="mt-4 text-red-500">{error}</div>}
                    <ToastContainer position="bottom-right" autoClose={5000} />
                </div>
            </div>
        </>
    );
}

export default CreatePresentationService;
