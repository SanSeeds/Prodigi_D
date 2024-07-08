// Import necessary dependencies
import { useState, useContext } from 'react';
import axios from 'axios';
import Navbar from '../components/Global/Navbar'; // Import Navbar component
import { AuthContext } from '../components/Global/AuthContext'; // Import AuthContext component
import CryptoJS from 'crypto-js'; // Import CryptoJS library
import { saveAs } from 'file-saver'; // Import saveAs function from file-saver
import { Document, Packer, Paragraph, TextRun } from 'docx'; // Import Document, Packer, Paragraph, and TextRun from docx
import TranslateComponent from '../components/Global/TranslateContent'; // Import TranslateComponent

// Constants for AES encryption
const AES_IV = CryptoJS.enc.Base64.parse('3G1Nd0j0l5BdPmJh01NrYg=='); // AES IV in Base64 format
const AES_SECRET_KEY = CryptoJS.enc.Base64.parse('XGp3hFq56Vdse3sLTtXyQQ=='); // AES secret key in Base64 format

// Define OfferLetterService component
function OfferLetterService() {
  // State management for form data, generated content, translated content, and error handling
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

  const [generatedContent, setGeneratedContent] = useState(''); // State for generated offer letter content
  const [translatedContent, setTranslatedContent] = useState(''); // State for translated offer letter content
  const [error, setError] = useState(''); // State for error message
  const authContext = useContext(AuthContext); // Access authentication context

  // Ensure AuthContext is available
  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { accessToken } = authContext; // Destructure access token from authContext

  // Handle input changes in form fields
  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setGeneratedContent(''); // Clear previous generated content
    setTranslatedContent(''); // Clear previous translated content

    try {
      // Encrypt form data payload
      const payload = JSON.stringify(formData);
      const encryptedPayload = CryptoJS.AES.encrypt(payload, AES_SECRET_KEY, { iv: AES_IV }).toString();

      // Send encrypted payload to backend
      const response = await axios.post(
        'http://127.0.0.1:8000/offer_letter_generator/',
        { encrypted_content: encryptedPayload },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`, // Include authorization token in headers
          },
        }
      );

      const data = response.data; // Get response data
      if (response.status === 200) {
        const encryptedContent = data.encrypted_content; // Extract encrypted content from response
        const decryptedBytes = CryptoJS.AES.decrypt(encryptedContent, AES_SECRET_KEY, { iv: AES_IV }); // Decrypt content
        const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8); // Convert decrypted bytes to text

        if (!decryptedText) {
          throw new Error('Decryption failed');
        }

        const parsedContent = JSON.parse(decryptedText); // Parse decrypted JSON content
        const formattedContent = parsedContent.generated_content.replace(/\\n/g, '\n'); // Format generated content

        setGeneratedContent(formattedContent); // Set generated content state
      } else {
        setError(data.error || 'An error occurred'); // Set error message from response
      }
    } catch (error) {
      console.error('Error generating offer letter:', error); // Log error to console
      setError('An error occurred'); // Set generic error message
    }
  };

  // Generate .docx file with formatted content
  const generateDocx = (content: string, fileName: string) => {
    const lines = content.split('\n'); // Split content into lines
    const docContent = lines.map(line => {
      const parts = line.split('**'); // Split line into parts using '**' delimiter
      const textRuns = parts.map((part, index) => {
        if (index % 2 === 1) {
          return new TextRun({ text: part, bold: true }); // Create bold TextRun for odd-indexed parts
        } else {
          return new TextRun(part); // Create normal TextRun for even-indexed parts
        }
      });
      return new Paragraph({ children: textRuns }); // Create Paragraph with TextRuns
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: docContent, // Set document content
        },
      ],
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `${fileName}.docx`); // Save document blob as .docx file with specified fileName
    });
  };

  // Handle download button click for generated or translated content
  const handleDownload = (type: string) => () => {
    try {
      if (type === 'generated') {
        if (!generatedContent) {
          throw new Error('No generated content available.'); // Throw error if no generated content
        }
        generateDocx(generatedContent, 'Generated_Offer_Letter'); // Generate .docx for generated content
      } else if (type === 'translated') {
        if (!translatedContent) {
          throw new Error('No translated content available.'); // Throw error if no translated content
        }
        generateDocx(translatedContent, 'Translated_Offer_Letter'); // Generate .docx for translated content
      } else {
        throw new Error('Invalid download type.'); // Throw error for invalid download type
      }
    } catch (error) {
      // setError(error.message); // Set error message state (currently commented out)
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
            <label className="mb-2 font-bold text-black">Duration of Employment</label>
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

        <div className="mb-6">
          <label className="block mb-2 font-bold text-black">Acceptance Deadline</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="p-3 border rounded shadow-sm text-black w-full"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-bold text-black">Contact Information</label>
          <textarea
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            className="p-3 border rounded shadow-sm text-black w-full"
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-bold text-black">Documents Needed for Onboarding</label>
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

        <div className="text-center">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Generate Offer Letter</button>
        </div>
      </form>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {generatedContent && (
        <div className="w-full max-w-3xl mx-auto p-8 mt-6 rounded">
          <h2 className="text-xl font-bold mb-4">Generated Offer Letter</h2>
          <p className="text-black whitespace-pre-line">
            {generatedContent.split('**').map((part, index) => {
              if (index % 2 === 1) {
                return <strong key={index}>{part}</strong>;
              } else {
                return part;
              }
            })}
          </p>
          <button
            onClick={handleDownload('generated')}
            className="w-full p-3 bg-green-500 text-white font-bold rounded shadow-sm mt-4"
          >
            Download Generated Content
          </button>
          <TranslateComponent
              generatedContent={generatedContent}
              setTranslatedContent={setTranslatedContent}
              setError={setError}
            />
      
        </div>
      )}
      {translatedContent && (
        <div className="w-full max-w-3xl mx-auto p-8 mt-6 rounded">
          <h2 className="text-xl font-bold mb-4">Translated Offer Letter</h2>
          <pre className="whitespace-pre-wrap">{translatedContent}</pre>
          <div className="flex justify-center mt-4">
          <button
            onClick={handleDownload('translated')}
            className="w-full p-3 bg-green-500 text-white font-bold rounded shadow-sm mt-4"
          >
            Download Translated Content
          </button>
          </div>
        </div>
      )}
    </>
  );
}

export default OfferLetterService;