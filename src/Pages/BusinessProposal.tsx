import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Global/Navbar";

function BusinessProposalService() {
    const [formData, setFormData] = useState({
        businessIntroduction: "",
        proposalObjective: "New Project",
        numberOfWords: "",
        scopeOfWork: "",
        projectPhases: "",
        expectedOutcomes: "",
        innovativeApproaches: "",
        technologiesUsed: "",
        targetAudience: "",
        budgetInformation: "",
        timeline: "",
        benefitsToRecipient: "",
        closingRemarks: "",
    });
    const [generatedContent, setGeneratedContent] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setError('');
        setGeneratedContent('');

        try {
            const response = await axios.post<{ generated_content: string }>('http://localhost:8000/business_proposal_generator/', formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            setGeneratedContent(response.data.generated_content);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error;
                if (axiosError.response) {
                    console.error('Error response data:', axiosError.response.data);
                    console.error('Error response status:', axiosError.response.status);
                    console.error('Error response headers:', axiosError.response.headers);
                    setError(axiosError.response.data.error || 'Failed to generate business proposal. Please try again.');
                } else if (axiosError.request) {
                    console.error('Error request:', axiosError.request);
                    setError('Failed to generate business proposal. Please try again.');
                } else {
                    console.error('Error:', axiosError.message);
                    setError('Failed to generate business proposal. Please try again.');
                }
            } else {
                console.error('Error:', error);
                setError('Failed to generate business proposal. Please try again.');
            }
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full max-w-3xl mx-auto p-8 rounded">
                    <h1 className="text-center text-3xl mb-6 font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>Business Proposal Generator</h1>
                    <form onSubmit={handleSubmit} className="mt-4">
                        <div className="mb-6">
                            <label className="block mb-2 font-bold text-black">Introduction of Your Business</label>
                            <textarea
                                name="businessIntroduction"
                                value={formData.businessIntroduction}
                                onChange={handleChange}
                                className="w-full p-3 border rounded shadow-sm text-gray-700"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="flex flex-col">
                                <label className="mb-2 font-bold text-black">Objective of Proposal</label>
                                <select
                                    name="proposalObjective"
                                    value={formData.proposalObjective}
                                    onChange={handleChange}
                                    className="p-3 border rounded shadow-sm text-gray-700"
                                >
                                    <option value="New Project">New Project</option>
                                    <option value="Partnership">Partnership</option>
                                    <option value="Collaboration">Collaboration</option>
                                    <option value="Service Offering">Service Offering</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 font-bold text-black">Number of words</label>
                                <input
                                    type="text"
                                    name="numberOfWords"
                                    value={formData.numberOfWords}
                                    onChange={handleChange}
                                    className="p-3 border rounded shadow-sm text-black"
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 font-bold text-black">Details of Proposal</label>
                            <input
                                type="text"
                                name="scopeOfWork"
                                placeholder="Scope of Work"
                                value={formData.scopeOfWork}
                                onChange={handleChange}
                                className="w-full p-3 mb-3 border rounded shadow-sm text-gray-700"
                            />
                            <input
                                type="text"
                                name="projectPhases"
                                placeholder="Project Phases"
                                value={formData.projectPhases}
                                onChange={handleChange}
                                className="w-full p-3 mb-3 border rounded shadow-sm text-gray-700"
                            />
                            <input
                                type="text"
                                name="expectedOutcomes"
                                placeholder="Expected Outcomes"
                                value={formData.expectedOutcomes}
                                onChange={handleChange}
                                className="w-full p-3 mb-3 border rounded shadow-sm text-gray-700"
                            />
                            <input
                                type="text"
                                name="innovativeApproaches"
                                placeholder="Innovative Approaches (Optional)"
                                value={formData.innovativeApproaches}
                                onChange={handleChange}
                                className="w-full p-3 mb-3 border rounded shadow-sm text-gray-700"
                            />
                            <input
                                type="text"
                                name="technologiesUsed"
                                placeholder="Technologies Used (Optional)"
                                value={formData.technologiesUsed}
                                onChange={handleChange}
                                className="w-full p-3 border rounded shadow-sm text-gray-700"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="flex flex-col">
                                <label className="mb-2 font-bold text-black">Target Audience or Partner Information</label>
                                <input
                                    type="text"
                                    name="targetAudience"
                                    value={formData.targetAudience}
                                    onChange={handleChange}
                                    className="p-3 border rounded shadow-sm text-gray-700"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 font-bold text-black">Budget and Pricing Information (Optional)</label>
                                <input
                                    type="text"
                                    name="budgetInformation"
                                    value={formData.budgetInformation}
                                    onChange={handleChange}
                                    className="p-3 border rounded shadow-sm text-gray-700"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="flex flex-col">
                                <label className="mb-2 font-bold text-black">Timeline</label>
                                <input
                                    type="text"
                                    name="timeline"
                                    value={formData.timeline}
                                    onChange={handleChange}
                                    className="p-3 border rounded shadow-sm text-gray-700"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 font-bold text-black">Benefits to the Recipient</label>
                                <input
                                    type="text"
                                    name="benefitsToRecipient"
                                    value={formData.benefitsToRecipient}
                                    onChange={handleChange}
                                    className="p-3 border rounded shadow-sm text-gray-700"
                                />
                            </div>
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
                                Generate
                            </button>
                        </div>
                    </form>
                    {generatedContent && (
                        <div className="mt-6 p-6 border rounded shadow-sm">
                            <h2 className="text-2xl font-bold mb-4">Generated Content</h2>
                            <p>{generatedContent}</p>
                        </div>
                    )}
                    {error && (
                        <div className="mt-6 p-6 border rounded bg-red-100 text-red-800 shadow-sm">
                            <p>{error}</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default BusinessProposalService;
