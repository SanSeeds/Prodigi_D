import { useState, useContext, ChangeEvent, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
import Navbar from "../components/Global/Navbar";
import TranslateComponent from "../components/Global/TranslateContent"; // Import the TranslateComponent
import { AuthContext } from '../components/Global/AuthContext';

function SummarizeService() {
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
        uploadFile: null as File | null
    });

    const [generatedContent, setGeneratedContent] = useState<string | null>(null);
    const [translatedContent, setTranslatedContent] = useState<string>(''); // State for translated content
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const authContext = useContext(AuthContext);
  
    if (!authContext) {
      throw new Error('AuthContext must be used within an AuthProvider');
    }
  
    const { accessToken } = authContext;

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFormData({ ...formData, uploadFile: e.target.files[0] });
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const form = new FormData();
        form.append('document_context', formData.documentContext);
        form.append('main_subject', formData.mainSubject);
        form.append('summary_purpose', formData.purpose);
        form.append('length_detail', formData.lengthDetail);
        form.append('important_elements', formData.importantElements);
        form.append('audience', formData.audience);
        form.append('tone', formData.tone);
        form.append('format', formData.format);
        form.append('additional_instructions', formData.additionalInstructions);
        if (formData.uploadFile) {
            form.append('document', formData.uploadFile);
        }

        try {
            const response = await axios.post<{ generated_content: string }>('http://localhost:8000/summarize_document/', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${accessToken}`,
                },
                withCredentials: true
            });
            setGeneratedContent(response.data.generated_content);
            setTranslatedContent(''); // Clear translated content when new content is generated
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // AxiosError type assertion
                const axiosError = error as AxiosError;
                if (axiosError.response) {
                    console.error('Error response data:', axiosError.response.data);
                    console.error('Error response status:', axiosError.response.status);
                    console.error('Error response headers:', axiosError.response.headers);
                } else if (axiosError.request) {
                    console.error('Error request:', axiosError.request);
                }
            } else {
                setError('An error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full max-w-3xl mx-auto p-8 rounded-lg">
            <h1 className="text-center text-3xl mt-5 font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>Summarize Document</h1>
            <form className="w-full max-w-3xl mx-auto p-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex flex-col">
                        <label className="mb-2 font-bold text-black">Document Context</label>
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
                        <label className="mb-2 font-bold text-black">Main Subject</label>
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
                        <label className="mb-2 font-bold text-black">Purpose of the Summary</label>
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
                        <label className="mb-2 font-bold text-black">Length and Detail</label>
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
                        <label className="mb-2 font-bold text-black">Important Elements to Include</label>
                        <textarea
                            name="importantElements"
                            value={formData.importantElements}
                            onChange={handleChange}
                            className="p-3 border rounded shadow-sm text-black"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 font-bold text-black">Audience</label>
                        <input
                            type="text"
                            name="audience"
                            value={formData.audience}
                            onChange={handleChange}
                            className="p-3 border rounded shadow-sm text-black"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex flex-col">
                        <label className="mb-2 font-bold text-black">Tone</label>
                        <input
                            type="text"
                            name="tone"
                            value={formData.tone}
                            onChange={handleChange}
                            className="p-3 border rounded shadow-sm text-black"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 font-bold text-black">Format</label>
                        <input
                            type="text"
                            name="format"
                            value={formData.format}
                            onChange={handleChange}
                            className="p-3 border rounded shadow-sm text-black"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="flex flex-col">
                        <label className="mb-2 font-bold text-black">Additional Instructions</label>
                        <textarea
                            name="additionalInstructions"
                            value={formData.additionalInstructions}
                            onChange={handleChange}
                            className="p-3 border rounded shadow-sm text-black"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="flex flex-col">
                        <label className="mb-2 font-bold text-black">Upload Document</label>
                        <input
                            type="file"
                            name="uploadFile"
                            onChange={handleFileChange}
                            className="p-3 border rounded shadow-sm text-black"
                        />
                    </div>
                </div>
                <div className="flex justify-center">
                    <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" disabled={loading}>
                        {loading ? "Generating..." : "Summarize"}
                    </button>
                </div>
            </form>
            {error && <div className="mt-4 text-red-500">{error}</div>}
            {generatedContent && (
                <div className="mt-4 p-4">
                    <h2 className="text-2xl font-bold mb-2">Generated Content</h2>
                    <pre className="whitespace-pre-wrap">{generatedContent}</pre>
                    <TranslateComponent 
                        generatedContent={generatedContent} 
                        setTranslatedContent={setTranslatedContent} 
                        setError={setError} 
                    />
                </div>
            )}
            {translatedContent && (
                <div className="mt-4 p-4">
                    <h2 className="text-2xl font-bold mb-2">Translated Content</h2>
                    <pre className="whitespace-pre-wrap">{translatedContent}</pre>
                </div>
            )}
            </div>
            </div>
        </>
    );
}

export default SummarizeService;
