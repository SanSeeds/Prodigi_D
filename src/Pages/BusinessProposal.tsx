import { useState, useContext, ChangeEvent, FormEvent, useEffect } from 'react';
import Navbar from '../components/Global/Navbar';
import axios, { AxiosError } from 'axios';
import { AuthContext } from '../components/Global/AuthContext';
import TranslateComponent from '../components/Global/TranslateContent';
import CryptoJS from 'crypto-js';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import config from '../config';
import { toast, ToastContainer } from 'react-toastify';

const apiUrl = config.apiUrl;

// AES encryption constants
const AES_IV = CryptoJS.enc.Base64.parse("3G1Nd0j0l5BdPmJh01NrYg=="); // Initialize IV for AES encryption
const AES_SECRET_KEY = CryptoJS.enc.Base64.parse("XGp3hFq56Vdse3sLTtXyQQ=="); // Initialize secret key for AES encryption

function BusinessProposalService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // State for form data
  const [formData, setFormData] = useState({
    businessIntroduction: '', // Business introduction field
    proposalObjective: 'New Project', // Proposal objective field
    numberOfWords: '', // Number of words field
    scopeOfWork: '', // Scope of work field
    projectPhases: '', // Project phases field
    expectedOutcomes: '', // Expected outcomes field
    technologiesAndInnovations: '',
    targetAudience: '', // Target audience field
    budgetInformation: '', // Budget information field
    timeline: '', // Timeline field
    benefitsToRecipient: '', // Benefits to recipient field
    closingRemarks: '', // Closing remarks field
  });

  // State for handling errors, generated content, and translated content
  const [error, setError] = useState<string | null>(null); // Error state
  const [generatedContent, setGeneratedContent] = useState<string>(''); // Generated content state
  const [translatedContent, setTranslatedContent] = useState<string>(''); // Translated content state
  const [loading, setLoading] = useState(false);

  // Get the access token from AuthContext
  const authContext = useContext(AuthContext); // Access authentication context
  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider'); // Throw error if AuthContext is not available
  }
  const { accessToken } = authContext; // Destructure access token from authContext

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target; // Destructure name and value from event target
    setFormData({ ...formData, [name]: value }); // Update formData state with new value
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    setError(null); // Reset error state
    setLoading(true);
    try {
      // Encrypt the form data
      const payload = JSON.stringify(formData); // Convert formData to JSON string
      const encryptedPayload = CryptoJS.AES.encrypt(payload, AES_SECRET_KEY, { iv: AES_IV }).toString(); // Encrypt the payload
    
      
      // Send the encrypted payload to the backend
      const response = await axios.post<{ encrypted_content: string }>(
        `${apiUrl}/business_proposal_generator/`, // API endpoint
        { encrypted_content: encryptedPayload }, // Request payload
        {
          headers: {
            'Content-Type': 'application/json', // Set content type header
            'Authorization': `Bearer ${accessToken}`, // Set authorization header
          },
          withCredentials: true, // Include credentials in the request
        }
      );

      // Decrypt the response
      if (response.data && response.data.encrypted_content) {
        const decryptedBytes = CryptoJS.AES.decrypt(response.data.encrypted_content, AES_SECRET_KEY, { iv: AES_IV }); // Decrypt the response
        const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8); // Convert decrypted bytes to UTF-8 string

        if (!decryptedText) {
          throw new Error('Decryption failed'); // Throw error if decryption fails
        }

        // Parse the decrypted content
        const parsedContent = JSON.parse(decryptedText); // Parse decrypted text to JSON
        const formattedContent = parsedContent.generated_content.replace(/\n/g, '\n'); // Format content with newlines

        setGeneratedContent(formattedContent); // Update generatedContent state
        toast.success('Content generated successfully!');
      } else {
        setError('Failed to generate business proposal. No content received.'); // Set error if no content received
      }
    } catch (error) {
      // Handle errors
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError; // Cast error to AxiosError
        if (axiosError.response) {
          console.error('Error response data:', axiosError.response.data); // Log response data
          console.error('Error response status:', axiosError.response.status); // Log response status
          console.error('Error response headers:', axiosError.response.headers); // Log response headers
        } else if (axiosError.request) {
          console.error('Error request:', axiosError.request); // Log request error
        } else {
          console.error('Error:', axiosError.message); // Log general error message
        }
      } else {
        console.error('Error:', error); // Log non-Axios error
      }
      setError('Failed to generate business proposal. Please try again.'); // Set error message
    }finally {
      setLoading(false);
    }
  };

  // Generate a .docx file from content
  const generateDocx = (content: string, fileName: string) => {
    // Split the content into lines
    const lines = content.split('\n');
    
    // Map each line to a Paragraph object with TextRun children
    const docContent = lines.map(line => {
      // Split the line into parts based on '**'
      const parts = line.split('**');
      
      // Map each part to a TextRun, alternating bold and regular text
      const textRuns = parts.map((part, index) => {
        if (index % 2 === 1) {
          // Create a bold TextRun for odd indices
          return new TextRun({ text: part, bold: true });
        } else {
          // Create a regular TextRun for even indices
          return new TextRun(part);
        }
      });
      
      // Return a Paragraph with the TextRun children
      return new Paragraph({ children: textRuns });
    });
  
    // Create a new Document with the Paragraphs
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: docContent,
        },
      ],
    });
  
    // Generate a Blob from the Document and trigger a download
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `${fileName}.docx`);
    });
  };
  
  // Handle download button clicks
  const handleDownload = (type: string) => () => {
    try {
      // Check the type of download and generate the corresponding document
      if (type === 'generated') {
        // Check if generated content is available
        if (!generatedContent) {
          throw new Error('No generated content available.');
        }
        // Generate and download the document with the generated content
        generateDocx(generatedContent, 'Generated_Business_Proposal');
      } else if (type === 'translated') {
        // Check if translated content is available
        if (!translatedContent) {
          throw new Error('No translated content available.');
        }
        // Generate and download the document with the translated content
        generateDocx(translatedContent, 'Translated_Business_Proposal');
      } else {
        // Handle invalid download type
        throw new Error('Invalid download type.');
      }
    } catch (error) {
      // Log the error message (commented out)
      // console.error(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-3xl mx-auto p-8 rounded">
          <h1 className="text-center text-3xl mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Business Proposal Generator</h1>
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-6">
              <label className="block mb-2 text-black">Introduction of Your Business</label>
              <textarea
                name="businessIntroduction"
                value={formData.businessIntroduction}
                onChange={handleChange}
                className="w-full p-3 border rounded shadow-sm text-gray-700"
                placeholder='Write About your business'
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col">
                <label className="mb-2 text-black">Objective of Proposal</label>
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
                <label className="mb-2 text-black">Number of words</label>
                <input
                  type="text"
                  name="numberOfWords"
                  value={formData.numberOfWords}
                  onChange={handleChange}
                  className="p-3 border rounded shadow-sm text-black"
                  placeholder='Enter Number of Words'
                />
              </div>
            </div>


            <div className="mb-6">
              <label className="block mb-2 text-black">Details of Proposal</label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                  <div className="flex flex-col">
                  <input
                    type="text"
                    name="scopeOfWork"
                    placeholder="Scope of Work"
                    value={formData.scopeOfWork}
                    onChange={handleChange}
                    className="w-full p-3 border rounded shadow-sm text-gray-700"
                  />
                  </div>

                  <div className="flex flex-col">
                    <input
                      type="text"
                      name="projectPhases"
                      placeholder="Project Phases"
                      value={formData.projectPhases}
                      onChange={handleChange}
                      className="w-full p-3 border rounded shadow-sm text-gray-700"
                    />
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex flex-col">              
                    <input
                      type="text"
                      name="expectedOutcomes"
                      placeholder="Expected Outcomes"
                      value={formData.expectedOutcomes}
                      onChange={handleChange}
                      className="w-full p-3 border rounded shadow-sm text-gray-700"
                    />
                  </div>
                  <div className="flex flex-col">              
                  <input
                  type='text'
                  name="technologiesAndInnovations"
                  value={formData.technologiesAndInnovations}
                  onChange={handleChange}
                  className="w-full p-3 border rounded shadow-sm text-gray-700"
                  placeholder='Technologies Used and Innovative Approaches (Optional)'
                />
                  </div>

                </div>
              
             
               
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col">
                <label className="mb-2 text-black">Target Audience or Partner Information</label>
                <input
                  type="text"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  className="p-3 border rounded shadow-sm text-gray-700"
                  placeholder='Your target audience'
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 text-black">Budget and Pricing Information (Optional)</label>
                <input
                  type="text"
                  name="budgetInformation"
                  value={formData.budgetInformation}
                  onChange={handleChange}
                  className="p-3 border rounded shadow-sm text-gray-700"
                  placeholder='Your Budget Information'

                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col">
                <label className="mb-2 text-black">Timeline</label>
                <input
                  type="text"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  className="p-3 border rounded shadow-sm text-gray-700"
                  placeholder='Timeline'

                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 text-black">Benefits to the Recipient</label>
                <input
                  type="text"
                  name="benefitsToRecipient"
                  value={formData.benefitsToRecipient}
                  onChange={handleChange}
                  className="p-3 border rounded shadow-sm text-gray-700"
                  placeholder='Your target audience'

                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-black">Closing Remarks (Optional)</label>
              <textarea
                name="closingRemarks"
                value={formData.closingRemarks}
                onChange={handleChange}
                className="w-full p-3 border rounded shadow-sm text-gray-700"
                placeholder='Any Closing Remarks'

              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full font-bold text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"


                disabled={loading}

              >
              {loading ? 'Generating...' : 'Generate'}

              </button>
            </div>
          </form>
          {generatedContent && ( // Check if generatedContent exists
            <div className="mt-6 p-6"> 
              <h2 className="text-2xl mb-4">Generated Content</h2> 
              {/* Render generated content with bold formatting for parts between '**' */}
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
                onClick={handleDownload('generated')} // Call handleDownload for generated content on click
                className="w-full p-3 bg-green-500 text-white rounded shadow-sm mt-4"
              >
                Download Generated Content
              </button>
              {/* Translate component */}
              <TranslateComponent
                generatedContent={generatedContent} // Pass generatedContent to TranslateComponent
                setTranslatedContent={setTranslatedContent} // Pass setTranslatedContent function to TranslateComponent
                setError={setError} // Pass setError function to TranslateComponent
              />
            </div>
          )}
          {translatedContent && ( // Check if translatedContent exists
            <div className="mt-6 p-6">
              <h2 className="text-2xl mb-4">Translated Content</h2>
              <div dangerouslySetInnerHTML={{ __html: translatedContent }} />
              <button
                onClick={handleDownload('translated')} // Call handleDownload for translated content on click
                className="w-full p-3 bg-green-500 text-white rounded shadow-sm mt-4"
              >
                Download Translated Content
                    </button>
            </div>
          )}
          {error && ( // Check if error exists
            <div className="mt-6 p-6 border rounded bg-red-100 text-red-800 shadow-sm"> 
              <p>{error}</p> 
            </div>
          )}

      <ToastContainer   position="bottom-right" autoClose={5000} />

          </div>
          </div>
          </>
      );
    }

export default BusinessProposalService;
