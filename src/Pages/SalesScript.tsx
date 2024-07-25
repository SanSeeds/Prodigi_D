import { useState, useContext, ChangeEvent, FormEvent, useEffect } from 'react'; // Importing necessary hooks and types from React
import axios from 'axios'; // Importing axios for making HTTP requests
import Navbar from '../components/Global/Navbar'; // Importing Navbar component
import { AuthContext } from '../components/Global/AuthContext'; // Importing AuthContext for authentication context
import TranslateComponent from '../components/Global/TranslateContent'; // Importing TranslateComponent for translation
import CryptoJS from 'crypto-js'; // Importing CryptoJS for encryption
import { saveAs } from 'file-saver'; // Importing file-saver for saving files
import { Document, Packer, Paragraph, TextRun } from 'docx'; // Importing docx for creating Word documents
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import config from '../config';

const apiUrl = config.apiUrl;

// Encryption keys
const ENCRYPTION_IV = CryptoJS.enc.Base64.parse("3G1Nd0j0l5BdPmJh01NrYg=="); // Defining the initialization vector for AES encryption
const ENCRYPTION_SECRET_KEY = CryptoJS.enc.Base64.parse("XGp3hFq56Vdse3sLTtXyQQ=="); // Defining the secret key for AES encryption

function SalesScriptService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // State for form data
  const [formData, setFormData] = useState({
    num_words: '', // State for number of words
    company_details: '', // State for company details
    product_descriptions: '', // State for product descriptions
    features_benefits: '', // State for features and benefits
    pricing_info: '', // State for pricing information
    promotions: '', // State for promotions
    target_audience: '', // State for target audience
    sales_objectives: '', // State for sales objectives
    tone_style: '', // State for tone and style
    competitive_advantage: '', // State for competitive advantage
    testimonials: '', // State for testimonials
    compliance: '', // State for compliance
    tech_integration: '', // State for technical integration
  });

  const [generatedScript, setGeneratedScript] = useState(''); // State for generated sales script
  const [translatedScript, setTranslatedScript] = useState(''); // State for translated sales script
  const [error, setError] = useState(''); // State for error messages
  const authContext = useContext(AuthContext); // Accessing the authentication context
  const [loading, setLoading] = useState(false);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider"); // Throwing an error if AuthContext is not available
  }

  const { accessToken } = authContext; // Destructuring accessToken from AuthContext

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target; // Extracting name and value from the input event
    setFormData({ ...formData, [name]: value }); // Updating formData state with the new input value
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Preventing default form submission behavior
    setError(''); // Resetting error state
    setGeneratedScript(''); // Resetting generated script state
    setTranslatedScript(''); // Resetting translated script state
    setLoading(true);


    try {
      // Encrypt the payload
      const payload = JSON.stringify(formData); // Converting formData to JSON string
      const encryptedPayload = CryptoJS.AES.encrypt(payload, ENCRYPTION_SECRET_KEY, { iv: ENCRYPTION_IV }).toString(); // Encrypting the payload

      
      // Sending POST request with the encrypted payload
      const response = await axios.post(`${apiUrl}/sales_script_generator/`, 
        { encrypted_content: encryptedPayload },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data && response.data.encrypted_content) {
        // Decrypt the content
        const decryptedBytes = CryptoJS.AES.decrypt(response.data.encrypted_content, ENCRYPTION_SECRET_KEY, { iv: ENCRYPTION_IV });
        const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
      
        if (!decryptedText) {
          throw new Error('Decryption failed'); // Throwing error if decryption fails
        }

        const parsedContent = JSON.parse(decryptedText); // Parsing decrypted text as JSON
        const formattedContent = parsedContent.generated_content.replace(/\[|\]/g, '').replace(/\n/g, '\n'); // Formatting the content
        toast.success('Sales Scripts generated successfully!');

        setGeneratedScript(formattedContent); // Setting the generated script
      } else {
        setError('Failed to generate sales script. No content received.'); // Setting error if no content is received
      }
    } catch (error) {
      console.error('Error generating sales script:', error); // Logging error
      setError('Failed to generate sales script. Please try again.'); // Setting error message for UI
    }
    finally {
      setLoading(false);
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
        if (!generatedScript) {
          throw new Error('No generated script available.'); // Throwing error if no generated script is available
        }
        generateDocx(generatedScript, 'Generated_Sales_Script'); // Generating .docx file for generated script
      } else if (type === 'translated') {
        if (!translatedScript) {
          throw new Error('No translated script available.'); // Throwing error if no translated script is available
        }
        generateDocx(translatedScript, 'Translated_Sales_Script'); // Generating .docx file for translated script
      } else {
        throw new Error('Invalid download type.'); // Throwing error for invalid download type
      }
    } catch (error) {
      // setError(error.message); // Setting error message for UI (commented out)
    }
  };


  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-3xl mx-auto p-8 rounded">
      <h1 className="text-center text-3xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
        Sales Script Generator
      </h1>
      <form className="w-full max-w-3xl mx-auto p-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="mb-2 text-black">Company Details</label>
            <textarea
              name="company_details"
              value={formData.company_details}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
              placeholder='Enter Company Details'
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-black">Number of words</label>
            <input
              type="number"
              name="num_words"
              value={formData.num_words}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
              placeholder='Enter number of words'

            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="mb-2 text-black">Product Descriptions</label>
            <textarea
              name="product_descriptions"
              value={formData.product_descriptions}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
              placeholder='Explain Product Description'

            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-black">Features and Benefits</label>
            <textarea
              name="features_benefits"
              value={formData.features_benefits}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
              placeholder='Explain Features and Benefits'

            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="mb-2 text-black">Pricing Information</label>
            <textarea
              name="pricing_info"
              value={formData.pricing_info}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
              placeholder='Enter Pricing Information'

            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-black">Promotions</label>
            <textarea
              name="promotions"
              value={formData.promotions}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
              placeholder='Enter Promotions Details'

            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="mb-2 text-black">Target Audience</label>
            <textarea
              name="target_audience"
              value={formData.target_audience}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
              placeholder='Enter Target Audience'

            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-black">Sales Objectives</label>
            <textarea
              name="sales_objectives"
              value={formData.sales_objectives}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
              placeholder='Enter Sales Objectives'

            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
          <label className="mb-2 text-black">Compliance</label>
            <textarea
              name="compliance"
              value={formData.compliance}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
              placeholder='Enter Compliance'

            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-black">Competitive Advantage</label>
            <textarea
              name="competitive_advantage"
              value={formData.competitive_advantage}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
              placeholder='Enter Competitive Advantage'

            />
          </div>
        </div>
     

        <button
          type="submit"
          disabled={loading}
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"

        >     
        {loading ? 'Generating...' : 'Generate Sales Script'}
          
        </button>
      </form>
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      {generatedScript && (
        <div className="w-full max-w-3xl mx-auto p-8 rounded mt-6">
          <h2 className="text-xl mb-4 text-black">Generated Sales Script</h2>
          <p className="text-black whitespace-pre-line">
            {generatedScript.split('**').map((part, index) => {
            if (index % 2 === 1) {
                return <strong key={index}>{part}</strong>;
            } else {
                return part;
            }
            })}
        </p>

          <button
            onClick={handleDownload('generated')} //Donwload 'generated' type document
            className="w-full bg-green-500 text-white py-3 px-6 rounded shadow-md hover:bg-green-600 mt-4"
          >
            Download Generated Sales Script
          </button>
          {/* Translate component */}
          <TranslateComponent 
            setError={setError} 
            generatedContent={generatedScript} 
            setTranslatedContent={setTranslatedScript} 
          />
        </div>
      )}
      {translatedScript && (
        <div className="w-full max-w-3xl mx-auto p-8  rounded">
          <h2 className="text-xl mb-4 text-black">Translated Sales Script</h2>
          <p className="whitespace-pre-line text-black">{translatedScript}</p>

          <button
            onClick={handleDownload('translated')}  //Donwload 'translated' type document
            className="w-full bg-green-500 text-white py-3 px-6 rounded shadow-md hover:bg-green-600 mt-4"
          >
            Download Translated Sales Script
          </button>
        </div>
      )}
      <ToastContainer   position="bottom-right" autoClose={5000} />

      </div>
      </div>
    </>
  );
}

export default SalesScriptService;