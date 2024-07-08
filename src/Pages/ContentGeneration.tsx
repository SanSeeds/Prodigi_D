import { useState, useContext } from 'react'; // Importing hooks for state management and context API
import axios from 'axios'; // Importing axios for making HTTP requests
import Navbar from '../components/Global/Navbar'; // Importing Navbar component
import { AuthContext } from '../components/Global/AuthContext'; // Importing AuthContext for authentication
import TranslateComponent from '../components/Global/TranslateContent'; // Importing TranslateComponent for translation
import CryptoJS from 'crypto-js'; // Importing CryptoJS for encryption
import { saveAs } from 'file-saver'; // Importing file-saver for saving files
import { Document, Packer, Paragraph, TextRun } from 'docx'; // Importing docx for creating Word documents

// AES encryption constants
const ENCRYPTION_IV = CryptoJS.enc.Base64.parse("3G1Nd0j0l5BdPmJh01NrYg=="); // Initialization vector for encryption
const ENCRYPTION_SECRET_KEY = CryptoJS.enc.Base64.parse("XGp3hFq56Vdse3sLTtXyQQ=="); // Secret key for encryption

function ContentGenerationService() {
  // State for form data
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

  // State for generated content, translated content, and errors
  const [generatedContent, setGeneratedContent] = useState('');
  const [translatedContent, setTranslatedContent] = useState('');
  const [error, setError] = useState('');

  // Get the access token from AuthContext
  const authContext = useContext(AuthContext); // Accessing authentication context
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider"); // Throwing error if AuthContext is not available
  }
  const { accessToken } = authContext; // Destructuring accessToken from AuthContext

  // Handle form input changes
  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target; // Extracting name and value from the input event
    setFormData({ ...formData, [name]: value }); // Updating formData state with the new input value
  };

  // Handle form submission
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault(); // Preventing default form submission behavior
    setError(''); // Resetting error state
    setGeneratedContent(''); // Resetting generatedContent state
    setTranslatedContent(''); // Resetting translatedContent state

    try {
      console.log('Form data:', formData); // Logging form data for debugging
      
      // Encrypt the payload
      const payload = JSON.stringify({
        company_info: formData.companyInfo,
        content_purpose: formData.purpose,
        desired_action: formData.action,
        topic_details: formData.topicDetails,
        keywords: formData.keywords,
        audience_profile: formData.audienceProfile,
        format_structure: formData.format,
        num_words: formData.numberOfWords,
        seo_keywords: formData.seoKeywords,
        references: formData.references,
      });

      const encryptedPayload = CryptoJS.AES.encrypt(payload, ENCRYPTION_SECRET_KEY, { iv: ENCRYPTION_IV }).toString(); // Encrypting the payload

      // Send encrypted payload to backend
      const response = await axios.post('http://localhost:8000/content_generator/', 
        { encrypted_content: encryptedPayload },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      console.log('Response:', response.data); // Logging the response for debugging
      if (response.data && response.data.encrypted_content) {
        // Decrypt the content received from the backend
        const decryptedBytes = CryptoJS.AES.decrypt(response.data.encrypted_content, ENCRYPTION_SECRET_KEY, { iv: ENCRYPTION_IV });
        const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
        
        if (!decryptedText) {
          throw new Error('Decryption failed'); // Throwing error if decryption fails
        }

        const parsedContent = JSON.parse(decryptedText); // Parsing decrypted text as JSON
        setGeneratedContent(parsedContent.generated_content); // Setting the generated content
      } else {
        setError('Failed to generate content. No content received.'); // Setting error if no content is received
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error;
        if (axiosError.response) {
          console.error('Error response data:', axiosError.response.data); // Logging error response data
          console.error('Error response status:', axiosError.response.status); // Logging error response status
          console.error('Error response headers:', axiosError.response.headers); // Logging error response headers
        } else if (axiosError.request) {
          console.error('Error request:', axiosError.request); // Logging error request
        }
      } else {
        console.error(error); // Logging generic error
      }
      setError('Failed to generate content. Please try again.'); // Setting error message for UI
    }
  };

  // Generate a .docx file from content with proper formatting
  const generateDocx = (content: string, fileName: string) => {
    const lines = content.split('\n'); // Splitting content into lines
    const docContent = lines.map(line => {
      const parts = line.split('**'); // Splitting line by '**' for bold formatting
      const textRuns = parts.map((part, index) => {
        if (index % 2 === 1) {
          return new TextRun({ text: part, bold: true }); // Creating bold text run
        } else {
          return new TextRun(part); // Creating regular text run
        }
      });
      return new Paragraph({ children: textRuns }); // Creating paragraph with text runs
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: docContent, // Adding content to the document
        },
      ],
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `${fileName}.docx`); // Saving the document as a .docx file
    });
  };

  // Handle download button clicks
  const handleDownload = (type: string) => () => {
    try {
      if (type === 'generated') {
        if (!generatedContent) {
          throw new Error('No generated content available.'); // Throwing error if no generated content is available
        }
        generateDocx(generatedContent, 'Generated Content'); // Generating .docx file for generated content
      } else if (type === 'translated') {
        if (!translatedContent) {
          throw new Error('No translated content available.'); // Throwing error if no translated content is available
        }
        generateDocx(translatedContent, 'Translated Content'); // Generating .docx file for translated content
      } else {
        throw new Error('Invalid download type.'); // Throwing error for invalid download type
      }
    } catch (error) {
      console.error(error); // Logging error
      // setError(error.message); // Setting error message for UI (commented out)
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">SEO Keywords</label>
            <input
              type="text"
              name="seoKeywords"
              value={formData.seoKeywords}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">References and Resources</label>
            <input
              type="text"
              name="references"
              value={formData.references}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white font-bold rounded shadow-sm"
        >
          Generate Content
        </button>
      </form>
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      {generatedContent && (
         <div className="w-full max-w-3xl mx-auto p-8 mt-6 rounded">
          <h2 className="text-xl font-bold mb-4">Generated Content:</h2>
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
          <h2 className="text-xl font-bold mb-4">Translated Content:</h2>
          <p className="whitespace-pre-line">{translatedContent}</p>
          <button
            onClick={handleDownload('translated')}
            className="w-full p-3 bg-green-500 text-white font-bold rounded shadow-sm mt-4"
          >
            Download Translated Content
          </button>
        </div>
      )}
    </>
  );
}

export default ContentGenerationService;
