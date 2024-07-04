import { useState, useContext, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Navbar from '../components/Global/Navbar';
import { AuthContext } from '../components/Global/AuthContext';
import TranslateComponent from '../components/Global/TranslateContent';
import CryptoJS from 'crypto-js';
import { saveAs } from 'file-saver';
import { Document, IRunOptions, Packer, Paragraph, TextRun } from 'docx';

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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setGeneratedScript('');
    setTranslatedScript('');

    try {
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
      console.error('Error generating sales script:', error);
      setError('Failed to generate sales script. Please try again.');
    }
  };

  const generateDocx = (content: string | IRunOptions, fileName: string) => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun(content)],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `${fileName}.docx`);
    });
  };

  const handleDownload = (type: string) => () => {
    try {
      if (type === 'generated') {
        if (!generatedScript) {
          throw new Error('No generated script available.');
        }
        generateDocx(generatedScript, 'Generated_Sales_Script');
      } else if (type === 'translated') {
        if (!translatedScript) {
          throw new Error('No translated script available.');
        }
        generateDocx(translatedScript, 'Translated_Sales_Script');
      } else {
        throw new Error('Invalid download type.');
      }
    } catch (error) {
      // setError(error.message);
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
            onClick={handleDownload('generated')}
            className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded shadow-md hover:bg-green-600 mt-4"
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
          <h2 className="text-xl font-bold mb-4 text-black">Translated Sales Script</h2>
          <p className="whitespace-pre-line text-black">{translatedScript}</p>
          {/* Download button for translated script */}
          <button
            onClick={handleDownload('translated')}
            className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded shadow-md hover:bg-green-600 mt-4"
          >
            Download Translated Sales Script
          </button>
        </div>
      )}
    </>
  );
}

export default SalesScriptService;