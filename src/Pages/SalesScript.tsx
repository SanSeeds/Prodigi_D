import { useState, useContext } from 'react';
import axios from 'axios';
import Navbar from '../components/Global/Navbar';
import { AuthContext } from '../components/Global/AuthContext';
import TranslateComponent from '../components/Global/TranslateContent';
import CryptoJS from 'crypto-js';

// Encryption keys
const ENCRYPTION_IV = CryptoJS.enc.Base64.parse("3G1Nd0j0l5BdPmJh01NrYg==");
const ENCRYPTION_SECRET_KEY = CryptoJS.enc.Base64.parse("XGp3hFq56Vdse3sLTtXyQQ==");

function SalesScriptService() {
  const [formData, setFormData] = useState({
    num_words: '',
    company_details: '',
    product_descriptions: '',
    features_benefits: '',
    pricing_info: '',
    promotions: '',
    target_audience: '',
    sales_objectives: '',
    tone_style: '',
    competitive_advantage: '',
    testimonials: '',
    compliance: '',
    tech_integration: '',
  });

  const [generatedScript, setGeneratedScript] = useState('');
  const [translatedScript, setTranslatedScript] = useState('');
  const [error, setError] = useState('');
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { accessToken } = authContext;

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError('');
    setGeneratedScript('');
    setTranslatedScript('');

    try {
      console.log('Form data:', formData);
      
      // Encrypt the payload
      const payload = JSON.stringify(formData);
      const encryptedPayload = CryptoJS.AES.encrypt(payload, ENCRYPTION_SECRET_KEY, { iv: ENCRYPTION_IV }).toString();

      const response = await axios.post('http://localhost:8000/sales_script_generator/', 
        { encrypted_content: encryptedPayload },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      console.log('Response:', response.data);
      if (response.data && response.data.encrypted_content) {
        // Decrypt the content
        const decryptedBytes = CryptoJS.AES.decrypt(response.data.encrypted_content, ENCRYPTION_SECRET_KEY, { iv: ENCRYPTION_IV });
        const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedText) {
          throw new Error('Decryption failed');
        }

        const parsedContent = JSON.parse(decryptedText);
        const formattedContent = parsedContent.generated_content.replace(/\[|\]/g, '').replace(/\n/g, '\n');

        setGeneratedScript(formattedContent);
      } else {
        setError('Failed to generate sales script. No content received.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error;
        if (axiosError.response) {
          console.error('Error response data:', axiosError.response.data);
          console.error('Error response status:', axiosError.response.status);
          console.error('Error response headers:', axiosError.response.headers);
        } else if (axiosError.request) {
          console.error('Error request:', axiosError.request);
        }
      } else {
        console.error(error);
      }
      setError('Failed to generate sales script. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <h1 className="text-center text-3xl mt-5 font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
        Sales Script Generator
      </h1>
      <form className="w-full max-w-3xl mx-auto p-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Company Details</label>
            <textarea
              name="company_details"
              value={formData.company_details}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-bold">Number of words</label>
            <input
              type="number"
              name="num_words"
              value={formData.num_words}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Product Descriptions</label>
            <textarea
              name="product_descriptions"
              value={formData.product_descriptions}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Features and Benefits</label>
            <textarea
              name="features_benefits"
              value={formData.features_benefits}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Pricing Information</label>
            <textarea
              name="pricing_info"
              value={formData.pricing_info}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Promotions</label>
            <textarea
              name="promotions"
              value={formData.promotions}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Target Audience</label>
            <textarea
              name="target_audience"
              value={formData.target_audience}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Sales Objectives</label>
            <textarea
              name="sales_objectives"
              value={formData.sales_objectives}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Tone and Style</label>
            <textarea
              name="tone_style"
              value={formData.tone_style}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Competitive Advantage</label>
            <textarea
              name="competitive_advantage"
              value={formData.competitive_advantage}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Testimonials</label>
            <textarea
              name="testimonials"
              value={formData.testimonials}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Compliance</label>
            <textarea
              name="compliance"
              value={formData.compliance}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
        </div>
        <div className="flex flex-col mb-6">
          <label className="mb-2 font-bold text-black">Technology Integration</label>
          <textarea
            name="tech_integration"
            value={formData.tech_integration}
            onChange={handleChange}
            className="p-3 border rounded shadow-sm text-black"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-3 px-6 rounded shadow-md hover:bg-blue-600"
        >
          Generate Sales Script
        </button>
      </form>
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      {generatedScript && (
        <div className="w-full max-w-3xl mx-auto p-8 rounded mt-6">
          <h2 className="text-xl font-bold mb-4 text-black">Generated Sales Script</h2>
          <p className="whitespace-pre-line text-black">{generatedScript}</p>
          <TranslateComponent 
            setError={setError} 
            generatedContent={generatedScript} setTranslatedContent={setTranslatedScript} />
        </div>
      )}
     
      {translatedScript && (
        <div className="w-full max-w-3xl mx-auto p-8  rounded">
          <h2 className="text-xl font-bold mb-4 text-black">Translated Sales Script</h2>
          <p className="whitespace-pre-line text-black">{translatedScript}</p>
        </div>
      )}
    </>
  );
}

export default SalesScriptService;
