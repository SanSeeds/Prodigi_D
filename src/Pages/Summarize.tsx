import { useState, useContext, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Global/Navbar";
import { AuthContext } from '../components/Global/AuthContext';
import CryptoJS from 'crypto-js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import pdfToText from 'react-pdftotext'
import mammoth from 'mammoth';

import config from '../config';

const apiUrl = config.apiUrl;

const ENCRYPTION_IV = CryptoJS.enc.Base64.parse("3G1Nd0j0l5BdPmJh01NrYg==");
const ENCRYPTION_SECRET_KEY = CryptoJS.enc.Base64.parse("XGp3hFq56Vdse3sLTtXyQQ==");

function SummarizeService() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [formData, setFormData] = useState({
        documentContext: 'Research Paper',
        mainSubject: 'Technology',
        purpose: 'General Overview',
        lengthDetail: 'High-level Overview',
        importantElements: '',
        audience: '',
        tone: '',
        format: '',
        additionalInstructions: '',
        document: null as File | null,
        documentContent: '' // State for document content
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    if (!authContext) {
        throw new Error('AuthContext must be used within an AuthProvider');
    }

    const { accessToken } = authContext;

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
            // e.target.value = ''; // Clear the input field
            if (!allowedTypes.includes(file.type)) {
                toast.error('File type not allowed. Uplaod PDF, DOCX, TXT Files');
                return;
            }

            setFormData({ ...formData, document: file });

            try {
                let fileContent = '';
                const reader = new FileReader();
                reader.onload = async () => {
                    try {
                        if (file.type === 'application/pdf') {
                            const pdfText = await pdfToText(file);
                            fileContent = pdfText.trim();
                        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                            const result = await mammoth.extractRawText({ arrayBuffer: reader.result as ArrayBuffer });
                            fileContent = result.value;
                        } else {
                            fileContent = reader.result as string;
                        }

                        setFormData({ ...formData, document: file, documentContent: fileContent });
                    } catch (err) {
                        setError('Error processing file content.');
                        console.error(err);
                    }
                };

                if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                    reader.readAsArrayBuffer(file);
                } else {
                    reader.readAsText(file);
                }
            } catch (err) {
                setError('Error reading file content.');
                console.error(err);
            }
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = JSON.stringify({
                documentContext: formData.documentContext,
                mainSubject: formData.mainSubject,
                summary_purpose: formData.purpose,
                length_detail: formData.lengthDetail,
                important_elements: formData.importantElements,
                audience: formData.audience,
                tone: formData.tone,
                format: formData.format,
                additional_instructions: formData.additionalInstructions,
                document_content: formData.documentContent // Add document content to payload
            });

            if (!formData.documentContent) {
                setLoading(false);
                setError("No document content available.");
                return;
            }

            const encryptedPayload = CryptoJS.AES.encrypt(payload, ENCRYPTION_SECRET_KEY, { iv: ENCRYPTION_IV }).toString();
            
            const form = new FormData();
            form.append('encrypted_content', encryptedPayload);

            const response = await axios.post(`${apiUrl}/summarize_document/`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (response.data && response.data.encrypted_content) {
                const decryptedBytes = CryptoJS.AES.decrypt(response.data.encrypted_content, ENCRYPTION_SECRET_KEY, { iv: ENCRYPTION_IV });
                const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);

                if (!decryptedText) {
                    throw new Error('Decryption failed');
                }

                const parsedContent = JSON.parse(decryptedText);
                const formattedContent = parsedContent.generated_content.replace(/\[|\]/g, '').replace(/\n/g, '\n');
                toast.success('Document Summarized successfully!');

                // Redirect to /content-display with generated content as state
                navigate('/content-display', { state: { generatedContent: formattedContent } });
            } else {
                setError('Failed to generate content. No content received.');
            }
        } catch (error) {
            console.error('Error generating content:', error);
            setError('Failed to generate content. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full max-w-3xl mx-auto p-8 rounded-lg">
                    <h1 className="text-center text-xl font-semibold mb-6">Summarize Document</h1>
                    <form className="w-full max-w-3xl mx-auto p-8" onSubmit={handleSubmit}>
                        {/* Form fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="flex flex-col">
                                <label className="mb-2 text-black">Document Context</label>
                                <select
                                    name="documentContext"
                                    value={formData.documentContext}
                                    onChange={handleChange}
                                    className="p-3 border rounded shadow-sm text-black"
                                >
                                    <option value="Research Paper">Research Paper</option>
                                    <option value="Article">Article</option>
                                    <option value="Report">Report</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 text-black">Main Subject</label>
                                <select
                                    name="mainSubject"
                                    value={formData.mainSubject}
                                    onChange={handleChange}
                                    className="p-3 border rounded shadow-sm text-black"
                                >
                                    <option value="Technology">Technology</option>
                                    <option value="Science">Science</option>
                                    <option value="Health">Health</option>
                                    <option value="Business">Business</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="flex flex-col">
                                <label className="mb-2 text-black">Purpose of the Summary</label>
                                <select
                                    name="purpose"
                                    value={formData.purpose}
                                    onChange={handleChange}
                                    className="p-3 border rounded shadow-sm text-black"
                                >
                                    <option value="General Overview">General Overview</option>
                                    <option value="In-depth Analysis">In-depth Analysis</option>
                                    <option value="Executive Summary">Executive Summary</option>
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 text-black">Length and Detail</label>
                                <select
                                    name="lengthDetail"
                                    value={formData.lengthDetail}
                                    onChange={handleChange}
                                    className="p-3 border rounded shadow-sm text-black"
                                >
                                    <option value="High-level Overview">High-level Overview</option>
                                    <option value="Detailed Summary">Detailed Summary</option>
                                    <option value="Brief Summary">Brief Summary</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="flex flex-col">
                                <label className="mb-2 text-black">Important Elements</label>
                                <input
                                    type='text'
                                    name="importantElements"
                                    value={formData.importantElements}
                                    onChange={handleChange}
                                    className="p-3 border rounded shadow-sm text-black"
                                    placeholder='Enter Important Elements'
                                    
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 text-black">Target Audience</label>
                                <input
                                    type="text"
                                    name="audience"
                                    value={formData.audience}
                                    onChange={handleChange}
                                    className="p-3 border rounded shadow-sm text-black"
                                    placeholder='Enter Target Audience'

                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="flex flex-col">
                                <label className="mb-2 text-black">Tone</label>
                                <input
                                    type="text"
                                    name="tone"
                                    value={formData.tone}
                                    onChange={handleChange}
                                    className="p-3 border rounded shadow-sm text-black"
                                    placeholder='Enter Tone'

                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 text-black">Format</label>
                                <input
                                    type="text"
                                    name="format"
                                    value={formData.format}
                                    onChange={handleChange}
                                    className="p-3 border rounded shadow-sm text-black"
                                    placeholder='Enter Format'

                                />
                            </div>
                        </div>
                        <div className="flex flex-col mb-6">
                            <label className="mb-2 text-black">Additional Instructions</label>
                            <textarea
                                name="additionalInstructions"
                                value={formData.additionalInstructions}
                                onChange={handleChange}
                                className="p-3 border rounded shadow-sm text-black"
                                rows={2}
                                placeholder='Enter Additional Instructions'

                            />
                        </div>
                        <div className="flex flex-col mb-6">
                            <label className="mb-2 text-black">Upload Document (.pdf, .docx, .txt)</label>
                            <input
                                type="file"
                                accept=".pdf,.docx,.txt"
                                onChange={handleFileChange}
                                className="p-3 border rounded shadow-sm text-black"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"

                            disabled={loading}
                        >
                            {loading ? 'Generating...' : 'Generate Summary'}
                        </button>
                    </form>
                    {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                </div>
            </div>
            <ToastContainer position='bottom-right' autoClose={5000} />
        </>
    );
}

export default SummarizeService;
