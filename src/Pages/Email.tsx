import { ChangeEvent, FormEvent, useState } from "react";
import Navbar from "../components/Global/Navbar";

function EmailService() {
    const [formData, setFormData] = useState({
        purpose: "",
        otherPurpose: "",
        subject: "",
        rephraseSubject: false,
        to: "",
        tone: "Formal",
        keywords: Array(8).fill(""),
        contextualBackground: "",
        callToAction: "Reply",
        additionalDetails: "",
        priorityLevel: "Low",
        closingRemarks: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox" && e.target instanceof HTMLInputElement) {
            setFormData({ ...formData, [name]: e.target.checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleKeywordChange = (index: number, value: string) => {
        const newKeywords = [...formData.keywords];
        newKeywords[index] = value;
        setFormData({ ...formData, keywords: newKeywords });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle form submission
        console.log(formData);
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full max-w-3xl mx-auto p-8 rounded-lg">
                    <h1 className="text-center text-3xl mb-6 text-black font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>Email Generator</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block mb-2 font-bold text-black">Purpose (Optional)</label>
                            <select
                                name="purpose"
                                value={formData.purpose}
                                onChange={handleChange}
                                className="w-full p-3 mb-3 border rounded shadow-sm text-gray-700"
                            >
                                <option value="">Select Purpose</option>
                                <option value="Request Information">Request Information</option>
                                <option value="Confirm Details">Confirm Details</option>
                                <option value="Follow up on a Previous Discussion">Follow up on a Previous Discussion</option>
                                <option value="New Email">New Email</option>
                                <option value="Other">Other</option>
                            </select>
                            {formData.purpose === "Other" && (
                                <input
                                    type="text"
                                    name="otherPurpose"
                                    placeholder="If others, please specify"
                                    value={formData.otherPurpose}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded shadow-sm text-gray-700"
                                />
                            )}
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 font-bold text-black">Subject (Required)</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full p-3 mb-3 border rounded shadow-sm text-gray-700"
                            />
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="rephraseSubject"
                                    checked={formData.rephraseSubject}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                <label className="font-bold text-black">Rephrase Subject</label>
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 font-bold text-black">To (Required)</label>
                            <input
                                type="text"
                                name="to"
                                value={formData.to}
                                onChange={handleChange}
                                className="w-full p-3 border rounded shadow-sm text-gray-700"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 font-bold text-black">Tone (Required)</label>
                            <select
                                name="tone"
                                value={formData.tone}
                                onChange={handleChange}
                                className="w-full p-3 border rounded shadow-sm text-gray-700"
                            >
                                <option value="Formal">Formal</option>
                                <option value="Informal">Informal</option>
                                <option value="Persuasive">Persuasive</option>
                                <option value="Friendly">Friendly</option>
                            </select>
                        </div>
                        <div className="mb-6 grid grid-cols-2 gap-6">
                            {formData.keywords.map((keyword, index) => (
                                <div key={index} className="flex flex-col">
                                    <label className="block mb-2 font-bold text-black">Keyword {index + 1}</label>
                                    <input
                                        type="text"
                                        value={keyword}
                                        onChange={(e) => handleKeywordChange(index, e.target.value)}
                                        className="p-3 border rounded shadow-sm text-gray-700"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 font-bold text-black">Contextual Background (Optional)</label>
                            <textarea
                                name="contextualBackground"
                                value={formData.contextualBackground}
                                onChange={handleChange}
                                className="w-full p-3 border rounded shadow-sm text-gray-700"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 font-bold text-black">Call to Action (Optional)</label>
                            <select
                                name="callToAction"
                                value={formData.callToAction}
                                onChange={handleChange}
                                className="w-full p-3 border rounded shadow-sm text-gray-700"
                            >
                                <option value="Reply">Reply</option>
                                <option value="A Meeting">A Meeting</option>
                                <option value="A Phone Call">A Phone Call</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 font-bold text-black">Additional Details (Optional)</label>
                            <textarea
                                name="additionalDetails"
                                value={formData.additionalDetails}
                                onChange={handleChange}
                                className="w-full p-3 border rounded shadow-sm text-gray-700"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 font-bold text-black">Priority Level (Required)</label>
                            <select
                                name="priorityLevel"
                                value={formData.priorityLevel}
                                onChange={handleChange}
                                className="w-full p-3 border rounded shadow-sm text-gray-700"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 font-bold text-black">Closing Remarks (Optional)</label>
                            <textarea
                                name="closingRemarks"
                                value={formData.closingRemarks}
                                onChange={handleChange}
                                className="w-full p-3 border rounded shadow-sm text-gray-700"
                            />
                        </div>
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Generate Email
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default EmailService;
