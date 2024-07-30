// Import necessary dependencies
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Global/Navbar'; // Import Navbar component
import { AuthContext } from '../components/Global/AuthContext'; // Import AuthContext component
import CryptoJS from 'crypto-js'; // Import CryptoJS library
import config from '../config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const apiUrl = config.apiUrl;

// Constants for AES encryption
const AES_IV = CryptoJS.enc.Base64.parse('3G1Nd0j0l5BdPmJh01NrYg=='); // AES IV in Base64 format
const AES_SECRET_KEY = CryptoJS.enc.Base64.parse('XGp3hFq56Vdse3sLTtXyQQ=='); // AES secret key in Base64 format

// Define OfferLetterService component
function OfferLetterService() {
  const navigate = useNavigate(); // Initialize navigate

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

  const [,setGeneratedContent] = useState(''); // State for generated offer letter content
  const [,setTranslatedContent] = useState(''); // State for translated offer letter content
  const [,setError] = useState(''); // State for error message
  const authContext = useContext(AuthContext); // Access authentication context
  const [loading, setLoading] = useState(false);

  // Ensure AuthContext is available
  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }
  const currentDate = new Date().toISOString().split('T')[0];

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

        // Navigate to /content-display with generated content
        navigate('/content-display', { state: { generatedContent: formattedContent } });

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




  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-3xl mx-auto p-8 rounded">
      <h1 className="text-center text-xl font-semibold text-black">Offer Letter Generation</h1>
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
              min={currentDate}
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
            <input
              type='date'
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black w-full"
              placeholder='Offer Letter Acceptance Deadline'
              min={currentDate}

            />
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
              placeholder='Enter Contact Information'
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
            placeholder='Enter Closing Remarks'
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

      <ToastContainer position="bottom-right" autoClose={5000} />
      </div>
      </div>
    </>
  );
}

export default OfferLetterService;
