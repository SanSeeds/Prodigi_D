// Import necessary dependencies
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Global/Navbar'; // Import Navbar component
import { AuthContext } from '../components/Global/AuthContext'; // Import AuthContext component
import CryptoJS from 'crypto-js'; // Import CryptoJS library
import { saveAs } from 'file-saver'; // Import saveAs function from file-saver
import { Document, Packer, Paragraph, TextRun } from 'docx'; // Import Document, Packer, Paragraph, and TextRun from docx
import TranslateComponent from '../components/Global/TranslateContent'; // Import TranslateComponent
import config from '../config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiUrl = config.apiUrl;

// Constants for AES encryption
const AES_IV = CryptoJS.enc.Base64.parse('3G1Nd0j0l5BdPmJh01NrYg=='); // AES IV in Base64 format
const AES_SECRET_KEY = CryptoJS.enc.Base64.parse('XGp3hFq56Vdse3sLTtXyQQ=='); // AES secret key in Base64 format

// Define OfferLetterService component
function OfferLetterService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // State management for form data, generated content, translated content, and error handling
  const [formData, setFormData] = useState({
    companyDetails: '',
    status: 'Full-time',
    candidateFullName: '',
    positionTitle: '',
    department: '',
    location: '',
    expectedStartDate: '',
    compensationBenefits: '', // Merged field
    workHours: '',
    termsConditions: '',
    deadline: '',
    contactInfo: '',
    documentsNeeded: '',
    closingRemarks: '',
  });

  const [generatedContent, setGeneratedContent] = useState(''); // State for generated offer letter content
  const [translatedContent, setTranslatedContent] = useState(''); // State for translated offer letter content
  const [,setError] = useState(''); // State for error message
  const authContext = useContext(AuthContext); // Access authentication context
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      // Encrypt form data payload
      const payload = JSON.stringify(formData);
      const encryptedPayload = CryptoJS.AES.encrypt(payload, AES_SECRET_KEY, { iv: AES_IV }).toString();

      console.log(payload);
      
      // Send encrypted payload to backend
      const response = await axios.post(
        `${apiUrl}/offer_letter_generator/`,
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
        toast.success('Offer Letter generated successfully!');
      } else {
        setError(data.error || 'An error occurred'); // Set error message from response
      }
    } catch (error) {
      console.error('Error generating offer letter:', error); // Log error to console
      setError('An error occurred'); // Set generic error message
    } finally {
      setLoading(false);
    }
  };

  // Generate .docx file with formatted content
  const generateDocx = (content: string, fileName: string) => {
    const lines = content.split('\n'); // Split content into lines
    const docContent = lines.map((line) => {
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

    Packer.toBlob(doc).then((blob) => {
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
      <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-3xl mx-auto p-8 rounded">
      <h1 className="text-center text-3xl text-black" style={{ fontFamily: "'Poppins', sans-serif" }}>Offer Letter Generation</h1>
      <form className="w-full max-w-3xl mx-auto p-8 rounded" onSubmit={handleSubmit}>
      
        {/* Company Details */}
        <div className="mb-6">
          <label className="block mb-2 text-black">Company Details</label>
          <input
            type="text"
            name="companyDetails"
            value={formData.companyDetails}
            onChange={handleChange}
            className="p-3 border rounded shadow-sm text-black w-full"
            placeholder='Enter Company Details'

          />
        </div>

        {/* Candidate Full Name + Status */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
          <label className="mb-2 text-black">Candidate's Full Name</label>
            <input
              type="text"
              name="candidateFullName"
              value={formData.candidateFullName}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
              placeholder='Enter Full Name'

            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-black">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Intern">Intern</option>
              <option value="Contract">Contract</option>

            </select>
          </div>
        </div>

        {/* Department + Position Title */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
          <label className="mb-2 text-black">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
              placeholder='Enter Department'

            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-black">Position Title</label>
            <input
              type="text"
              name="positionTitle"
              value={formData.positionTitle}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
              placeholder='Enter Position Title'

            />
          </div>
        </div>

        {/* Location + Start Date */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="mb-2 text-black">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
              placeholder='Enter Job Location'

            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-black">Expected Start Date</label>
            <input
              type="date"
              name="expectedStartDate"
              value={formData.expectedStartDate}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
           

            />
          </div>
        </div>

        {/* Compensation Package + Benefits */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
          <label className="block mb-2 text-black">Compensation Package and Benefits</label>
          <textarea
            name="compensationBenefits"
            value={formData.compensationBenefits}
            onChange={handleChange}
            className="p-3 border rounded shadow-sm text-black w-full"
            placeholder='Enter Compensation Package and Benefits'

          ></textarea>
          </div>
          <div className="flex flex-col">
          <label className="block mb-2 text-black">Work Hours</label>
          <textarea
            name="workHours"
            value={formData.workHours}
            onChange={handleChange}
            className="p-3 border rounded shadow-sm text-black w-full"
            placeholder='Enter Work Hours Details'

          ></textarea>
          </div>
        
        </div>
     
    
        {/* Terms and Conditions + Deadline */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
          <label className="block mb-2 text-black">Terms and Conditions</label>
          <textarea
            name="termsConditions"
            value={formData.termsConditions}
            onChange={handleChange}
            className="p-3 border rounded shadow-sm text-black w-full"
            placeholder='Enter Terms and Conditions'

          ></textarea>
          </div>
          <div className="flex flex-col">
          <label className="block mb-2 text-black">Deadline</label>
          <textarea
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="p-3 border rounded shadow-sm text-black w-full"
            placeholder='Offer Letter Acceptance Deadline'

          ></textarea>
          </div>
        </div>
    
        {/* Contact Information + Documents Needed */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
          <label className="block mb-2 text-black">Contact Information</label>
          <textarea
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            className="p-3 border rounded shadow-sm text-black w-full"
            placeholder='Enter Conact Information'

          ></textarea>
          </div>
          <div className="flex flex-col">
          <label className="block mb-2 text-black">Documents Needed</label>
          <textarea
            name="documentsNeeded"
            value={formData.documentsNeeded}
            onChange={handleChange}
            className="p-3 border rounded shadow-sm text-black w-full"
            placeholder='Documents Required'

          ></textarea>
          </div>
        </div>
    
        {/* Closing Remarks */}

        <div className="mb-6">
          <label className="block mb-2 text-black">Closing Remarks</label>
          <textarea
            name="closingRemarks"
            value={formData.closingRemarks}
            onChange={handleChange}
            className="p-3 border rounded shadow-sm text-black w-full"
            placeholder='Enter closing Remarks'

          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"


          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Offer Letter'}
        </button>
      </form>

      {generatedContent && (
        <div className="mt-6 p-6">
          <h2 className="text-2xl mb-4">Generated Offer Letter:</h2>
          <p className="text-black whitespace-pre-line">
                {generatedContent.split('**').map((part, index) => { // Split content by '**' and map over parts
                  if (index % 2 === 1) { // Check if index is odd, indicating bold content
                    return <strong key={index}>{part}</strong>; // Render part in bold
                  } else {
                    return part; // Render part as plain text
                  }
                })}
              </p>          
              <button
                className="w-full p-3 bg-green-500 text-white rounded shadow-sm mt-4"
                onClick={handleDownload('generated')}
          >
            Download Offer Letter
          </button>
          <TranslateComponent
          generatedContent={generatedContent}
          setTranslatedContent={setTranslatedContent}
          setError={setError} // Pass setError function to TranslateComponent

        />
        </div>
      )}

      {translatedContent && (
        <div className="w-full max-w-3xl mx-auto p-8">
          <h2 className="text-xl mb-4">Translated Offer Letter:</h2>
          <pre className="whitespace-pre-wrap text-black">{translatedContent}</pre>
          <button
                className="w-full p-3 bg-green-500 text-white rounded shadow-sm mt-4"
                onClick={handleDownload('translated')}
          >
            Download Translated Offer Letter
          </button>
        </div>
      )}

      <ToastContainer   position="bottom-right" autoClose={5000} />

      
      </div>
      </div>
    </>
  );
}

export default OfferLetterService;
