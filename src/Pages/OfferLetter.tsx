import { useState } from "react";
import axios from 'axios';
import Navbar from "../components/Global/Navbar";

function OfferLetterService() {
  const [formData, setFormData] = useState({
    companyDetails: '',
    numberOfWords: '',
    status: 'Full-time',
    candidateFullName: '',
    positionTitle: '',
    department: '',
    supervisor: '',
    location: '',
    expectedStartDate: '',
    compensationPackage: '',
    benefits: '',
    workHours: '',
    duration: '',
    termsConditions: '',
    deadline: '',
    contactInfo: '',
    documentsNeeded: '',
    closingRemarks: '',
  });

  const [generatedContent, setGeneratedContent] = useState('');
  const [translatedContent, setTranslatedContent] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [error, setError] = useState('');

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError('');  // Clear previous error message
    setGeneratedContent('');  // Clear previous generated content
    setTranslatedContent('');  // Clear previous translated content
    try {
      const response = await axios.post('http://127.0.0.1:8000/offer_letter_generator/', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      if (response.status === 200) {
        setGeneratedContent(data.generated_content);
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch (error) {
      setError('An error occurred');
    }
  };

  const handleTranslate = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/translate/', {
        input_text: generatedContent,
        from_language: 'English', // Assuming the original text is in English
        to_language: selectedLanguage,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      if (response.status === 200) {
        setTranslatedContent(data.translated_text);
      } else {
        setError(data.error || 'Translation error occurred');
      }
    } catch (error) {
      setError('Translation error occurred');
    }
  };

  return (
    <>
      <Navbar />
      <h1 className="text-center text-3xl mt-5 text-black font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>Offer Letter Generation</h1>
      <form className="w-full max-w-3xl mx-auto p-8 rounded" onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block mb-2 font-bold text-black">Company Details</label>
          <input
            type="text"
            name="companyDetails"
            value={formData.companyDetails}
            onChange={handleChange}
            className="p-3 border rounded shadow-sm text-black w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Number of Words</label>
            <input
              type="text"
              name="numberOfWords"
              value={formData.numberOfWords}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Candidate's Full Name</label>
            <input
              type="text"
              name="candidateFullName"
              value={formData.candidateFullName}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Position Title</label>
            <input
              type="text"
              name="positionTitle"
              value={formData.positionTitle}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Supervisor</label>
            <input
              type="text"
              name="supervisor"
              value={formData.supervisor}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Expected Start Date</label>
            <input
              type="date"
              name="expectedStartDate"
              value={formData.expectedStartDate}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-bold text-black">Offer Details</label>
          <textarea
            name="compensationPackage"
            value={formData.compensationPackage}
            onChange={handleChange}
            className="p-3 border rounded shadow-sm text-black w-full"
            placeholder="Compensation Package"
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-bold text-black">Benefits (Health insurance, retirement plans, etc.)</label>
          <textarea
            name="benefits"
            value={formData.benefits}
            onChange={handleChange}
            className="p-3 border rounded shadow-sm text-black w-full"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Work Hours and Schedule</label>
            <input
              type="text"
              name="workHours"
              value={formData.workHours}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-bold text-black">Terms and Conditions</label>
          <textarea
            name="termsConditions"
            value={formData.termsConditions}
            onChange={handleChange}
            className="p-3 border rounded shadow-sm text-black w-full"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Deadline for accepting the offer</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Contact information for questions</label>
            <input
              type="text"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-bold text-black">Documents needed to submit</label>
          <textarea
            name="documentsNeeded"
            value={formData.documentsNeeded}
            onChange={handleChange}
            className="p-3 border rounded shadow-sm text-black w-full"
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-bold text-black">Closing Remarks</label>
          <textarea
            name="closingRemarks"
            value={formData.closingRemarks}
            onChange={handleChange}
            className="p-3 border rounded shadow-sm text-black w-full"
          ></textarea>
        </div>

        <div className="flex justify-center">
          <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Generate
          </button>
        </div>
      </form>
      {generatedContent && (
        <div className="w-full max-w-3xl mx-auto p-8 mt-6 rounded bg-gray-100">
          <h2 className="text-xl font-bold mb-4">Generated Offer Letter</h2>
          <pre className="whitespace-pre-wrap">{generatedContent}</pre>
          <div className="flex items-center mt-4">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="p-3 border rounded shadow-sm text-black mr-4"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Telugu">Telugu</option>
              <option value="Marathi">Marathi</option>
              {/* Add more languages as needed */}
            </select>
            <button
              onClick={handleTranslate}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Translate
            </button>
          </div>
        </div>
      )}
      {translatedContent && (
        <div className="w-full max-w-3xl mx-auto p-8 mt-6 rounded bg-gray-100">
          <h2 className="text-xl font-bold mb-4">Translated Offer Letter</h2>
          <pre className="whitespace-pre-wrap">{translatedContent}</pre>
        </div>
      )}
      {error && (
        <div className="w-full max-w-3xl mx-auto p-8 mt-6 rounded bg-red-100 text-red-800">
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p>{error}</p>
        </div>
      )}
    </>
  );
}

export default OfferLetterService;
