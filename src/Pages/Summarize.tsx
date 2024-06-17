import { useState } from "react";
import Navbar from "../components/Global/Navbar";

function SummarizeService(){
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFormData({ ...formData, uploadFile: e.target.files[0] });
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle form submission
        console.log(formData);
    };

    return (
        <>
        <Navbar/>
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
                        className="p-3 border rounded shadow-sm text-black "
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
                        className="p-3 border rounded shadow-sm text-black "
                    />
                </div>
            </div>
            <div className="flex justify-center">
                <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Summarize
                </button>
            </div>
        </form>
        </>
        
    );
};

export default SummarizeService;