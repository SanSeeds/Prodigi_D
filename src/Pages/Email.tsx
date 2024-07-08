import { useState, useContext, ChangeEvent, FormEvent } from 'react'; // Importing necessary hooks and types from React
import Navbar from '../components/Global/Navbar'; // Importing the Navbar component
import axios, { AxiosError } from 'axios'; // Importing axios for making HTTP requests and AxiosError for error handling
import { AuthContext } from '../components/Global/AuthContext'; // Importing AuthContext for authentication
import TranslateComponent from '../components/Global/TranslateContent'; // Importing a translation component
import CryptoJS from 'crypto-js'; // Importing CryptoJS for encryption and decryption
import { saveAs } from 'file-saver'; // Importing file-saver for saving files
import { Document, Packer, Paragraph, TextRun } from 'docx'; // Importing docx for generating .docx files
import { toast, ToastContainer } from 'react-toastify'; // Importing react-toastify for notifications

// Constants for AES encryption
const AES_IV = CryptoJS.enc.Base64.parse("3G1Nd0j0l5BdPmJh01NrYg=="); // Initialization vector for AES encryption
const AES_SECRET_KEY = CryptoJS.enc.Base64.parse("XGp3hFq56Vdse3sLTtXyQQ=="); // Secret key for AES encryption

function EmailService() {
    // State management for form data, loading state, error messages, generated email, and translated email
  const [formData, setFormData] = useState({
    purpose: '',
    otherPurpose: '',
    subject: '',
    rephraseSubject: false,
    to: '',
    tone: 'Formal',
    keyword_1: '',
    keyword_2: '',
    keyword_3: '',
    keyword_4: '',
    keyword_5: '',
    keyword_6: '',
    keyword_7: '',
    keyword_8: '',
    contextualBackground: '',
    callToAction: 'Reply',
    additionalDetails: '',
    priorityLevel: 'Low',
    closingRemarks: '',
  });

  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [generatedEmail, setGeneratedEmail] = useState<string>(''); // State for generated email content
  const [translatedEmail, setTranslatedEmail] = useState<string>(''); // State for translated email content

  // Accessing the authentication context
  const authContext = useContext(AuthContext); // Using useContext to get the authContext value

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider'); // Throwing an error if AuthContext is not provided
  }

  const { accessToken } = authContext; // Destructuring accessToken from authContext

  // Handling input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // Update formData based on input type
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      setFormData({ ...formData, [name]: e.target.checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handling form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Set loading state to true
    setError(null); // Clear any previous errors

    try {
      // Encrypting the payload
      const payload = JSON.stringify(formData); // Convert form data to JSON string
      const encryptedPayload = CryptoJS.AES.encrypt(payload, AES_SECRET_KEY, { iv: AES_IV }).toString(); // Encrypt payload using AES

      // Sending the encrypted payload to the backend
      const response = await axios.post(
        'http://localhost:8000/email_generator/',
        { encrypted_content: encryptedPayload }, // Send encrypted content in the request body
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`, // Include access token in headers
          },
          withCredentials: true, // Send cookies with the request (if applicable)
        }
      );

      // Decrypting the response
      if (response.data && response.data.encrypted_content) {
        const decryptedBytes = CryptoJS.AES.decrypt(response.data.encrypted_content, AES_SECRET_KEY, { iv: AES_IV }); // Decrypt response
        const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8); // Convert decrypted bytes to UTF-8 string

        if (!decryptedText) {
          throw new Error('Decryption failed'); // Throw error if decryption fails
        }

        const parsedContent = JSON.parse(decryptedText); // Parse decrypted JSON content

        if (parsedContent.generated_content) {
          setGeneratedEmail(parsedContent.generated_content); // Set generated email content in state
          toast.success('Email sent successfully!'); // Display success toast notification
        } else {
          setError('Failed to generate email. No content received.'); // Set error message if no content received
        }
      } else {
        setError('Failed to generate email. No content received.'); // Set error message if no content received
      }
    } catch (error) {
      // Handle Axios errors
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError; // Cast error to AxiosError
        if (axiosError.response) {
          console.error('Error response data:', axiosError.response.data); // Log error response data
          console.error('Error response status:', axiosError.response.status); // Log error response status
          console.error('Error response headers:', axiosError.response.headers); // Log error response headers
        } else if (axiosError.request) {
          console.error('Error request:', axiosError.request); // Log error request
        } else {
          console.error('Error:', axiosError.message); // Log generic error message
        }
      } else {
        console.error('Error:', error); // Log generic error message
      }
      setError('Failed to generate email. Please try again.'); // Set error message for user
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  // Generating a .docx file with proper formatting
  const generateDocx = (content: string, fileName: string) => {
    const lines = content.split('\n'); // Split content into lines
    const docContent = lines.map(line => {
      const parts = line.split('**'); // Split line into parts based on '**'
      const textRuns = parts.map((part, index) => {
        if (index % 2 === 1) {
          return new TextRun({ text: part, bold: true }); // Create bold TextRun for odd-indexed parts
        } else {
          return new TextRun(part); // Create regular TextRun for even-indexed parts
        }
      });
      return new Paragraph({ children: textRuns }); // Create paragraph with text runs
    });

    const doc = new Document({
      sections: [
        {
          properties: {}, // Section properties (none specified)
          children: docContent, // Content of the document section
        },
      ],
    });

    // Convert document to blob and save as .docx file
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `${fileName}.docx`); // Save blob as .docx file with specified filename
    });
  };

  // Handle download of generated or translated content
  const handleDownload = (type: string) => () => {
    try {
      if (type === 'generated') {
        if (!generatedEmail) {
          throw new Error('No generated content available.'); // Throw error if no generated content available
        }
        generateDocx(generatedEmail, 'Generated_Email'); // Generate .docx file for generated content
      } else if (type === 'translated') {
        if (!translatedEmail) {
          throw new Error('No translated content available.'); // Throw error if no translated content available
        }
        generateDocx(translatedEmail, 'Translated_Email'); // Generate .docx file for translated content
      } else {
        throw new Error('Invalid download type.'); // Throw error for invalid download type
      }
    } catch (error) {
      // Handle download errors (currently commented out)
      // setError(error.message);
    }
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
              {[...Array(8)].map((_, index) => (
                <div key={index} className="flex flex-col">
                  <label className="block mb-2 font-bold text-black">Keyword {index + 1}</label>
                  <input
                    type="text"
                    name={`keyword_${index + 1}`}
                    value={(formData as any)[`keyword_${index + 1}`]}
                    onChange={handleChange}
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
                <option value="A Confirmation">A Confirmation</option>
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
              <label className="block mb-2 font-bold text-black">Priority Level (Optional)</label>
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
            <div className="mb-6 text-center">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Email'}
              </button>
            </div>
          </form>
        
          {error && <p className="text-center text-red-500">{error}</p>}
          {generatedEmail && (
            <div className="mt-6 p-6 ">
              <h2 className="text-2xl font-bold text-black mb-4">Generated Email:</h2>
              <p className="whitespace-pre-line text-black">{generatedEmail}</p>
              <button
                onClick={handleDownload('generated')}
                className="w-full p-3 bg-green-500 text-white font-bold rounded shadow-sm mt-4"
              >
                Download Generated Email
              </button>
              <TranslateComponent
                generatedContent={generatedEmail}
                setTranslatedContent={setTranslatedEmail}
                setError={setError}
              />
            </div>
          )}
          {translatedEmail && (
            <div className="mt-6 p-6">
              <h2 className="text-2xl font-bold mb-4">Translated Content</h2>
              <div dangerouslySetInnerHTML={{ __html: translatedEmail }} />
              <button
                onClick={handleDownload('translated')}
                className="w-full p-3 bg-green-500 text-white font-bold rounded shadow-sm mt-4"
              >
                Download Translated Email
              </button>
            </div>
          )}
          {error && (
            <div className="mt-6 p-6 border rounded bg-red-100 text-red-800 shadow-sm">
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={5000} />

    </>
  );
}

export default EmailService;
