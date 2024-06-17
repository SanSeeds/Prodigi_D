import { useState } from "react";
import Navbar from "../components/Global/Navbar";

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('authToken');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    const response = await fetch(url, { ...options, headers });
    return response;
};


function ContentGenerationService() {
    const [formData, setFormData] = useState({
        companyInfo: '',
        purpose: 'Inform',
        action: 'Visit Website',
        keywords: '',
        topicDetails: '',
        audienceProfile: '',
        format: 'Listicle',
        numberOfWords: '',
        seoKeywords: '',
        references: ''
    });

    const [generatedContent, setGeneratedContent] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setError('');
        setGeneratedContent('');
        try {
            console.log('Form data:', formData); // Log form data
            const response = await fetchWithAuth('http://127.0.0.1:8000/content_generator/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            console.log('Response:', data); // Log response data
            if (response.ok) {
                setGeneratedContent(data.generated_content);
            } else {
                setError(data.error || 'An error occurred');
            }
        } catch (error) {
            console.error('Fetch error:', error); // Log fetch error
            setError('An error occurred');
        }
    };

    return (
        <>
            <Navbar />
            <h1 className="text-center text-3xl mt-5 font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>Content Generator</h1>
            <form className="w-full max-w-3xl mx-auto p-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex flex-col">
                        <label className="mb-2 font-bold text-black">Company Information</label>
                        <textarea
                            name="companyInfo"
                            value={formData.companyInfo}
                            onChange={handleChange}
                            className="p-3 border rounded shadow-sm text-black"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 font-bold">Content Purpose and Goals</label>
                        <select
                            name="purpose"
                            value={formData.purpose}
                            onChange={handleChange}
                            className="p-3 border rounded shadow-sm text-black"
                        >
                            <option value="Inform">Inform</option>
                            <option value="Educate">Educate</option>
                            <option value="Entertain">Entertain</option>
                            <option value="Persuade">Persuade</option>
                            <option value="Combination">Combination</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex flex-col">
                        <label className="mb-2 font-bold text-black">Desired Action from Audience</label>
                        <select
                            name="action"
                            value={formData.action}
                            onChange={handleChange}
                            className="p-3 border rounded shadow-sm text-black"
                        >
                            <option value="Visit Website">Visit Website</option>
                            <option value="Sign Up For Webinar">Sign Up For Webinar</option>
                            <option value="Use Promo Code">Use Promo Code</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 font-bold text-black">Topic Details</label>
                        <textarea
                            name="topicDetails"
                            value={formData.topicDetails}
                            onChange={handleChange}
                            className="p-3 border rounded shadow-sm text-black"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex flex-col">
                        <label className="mb-2 font-bold text-black">Keywords</label>
                        <input
                            type="text"
                            name="keywords"
                            value={formData.keywords}
                            onChange={handleChange}
                            className="p-3 border rounded shadow-sm text-black"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 font-bold text-black">Audience Profile</label>
                        <input
                            type="text"
                            name="audienceProfile"
                            value={formData.audienceProfile}
                            onChange={handleChange}
                            className="p-3 border rounded shadow-sm text-black"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex flex-col">
                        <label className="mb-2 font-bold text-black">Format and Structure</label>
                        <select
                            name="format"
                            value={formData.format}
                            onChange={handleChange}
                            className="p-3 border rounded shadow-sm text-black"
                        >
                            <option value="Listicle">Listicle</option>
                            <option value="How-To Guide">How-To Guide</option>
                            <option value="Interview">Interview</option>
                            <option value="Case Study">Case Study</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 font-bold text-black">Number of Words</label>
                        <input
                            type="number"
                            name="numberOfWords"
                            value={formData.numberOfWords}
                            onChange={handleChange}
                            className="p-3 border rounded shadow-sm text-black"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="flex flex-col">
                        <label className="mb-2 font-bold text-black">SEO and Keywords</label>
                        <input
                            type="text"
                            name="seoKeywords"
                            value={formData.seoKeywords}
                            onChange={handleChange}
                            className="p-3 border rounded shadow-sm text-black"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="flex flex-col">
                        <label className="mb-2 font-bold text-black">References and Sources</label>
                        <input
                            type="text"
                            name="references"
                            value={formData.references}
                            onChange={handleChange}
                            className="p-3 border rounded shadow-sm text-black"
                        />
                    </div>
                </div>
                <div className="flex justify-center">
                    <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Generate
                    </button>
                </div>
            </form>
            {generatedContent && (
                <div className="w-full max-w-3xl mx-auto p-8 mt-6 border rounded shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Generated Content</h2>
                    <p className="text-black whitespace-pre-line">{generatedContent}</p>
                </div>
            )}
            {error && (
                <div className="w-full max-w-3xl mx-auto p-8 mt-6 border rounded shadow-sm text-red-500">
                    {error}
                </div>
            )}
        </>
    );
};

export default ContentGenerationService;
