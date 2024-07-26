import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Navbar from '../components/Global/Navbar';
import { AuthContext } from '../components/Global/AuthContext';
import CryptoJS from 'crypto-js';
import config from '../config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiUrl = config.apiUrl;

const ENCRYPTION_IV = CryptoJS.enc.Base64.parse("3G1Nd0j0l5BdPmJh01NrYg==");
const ENCRYPTION_SECRET_KEY = CryptoJS.enc.Base64.parse("XGp3hFq56Vdse3sLTtXyQQ==");

function ContentGenerationService() {
  const navigate = useNavigate(); // Initialize useNavigate hook
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
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

      const encryptedPayload = CryptoJS.AES.encrypt(payload, ENCRYPTION_SECRET_KEY, { iv: ENCRYPTION_IV }).toString();
      const response = await axios.post(`${apiUrl}/content_generator/`, 
        { encrypted_content: encryptedPayload },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data && response.data.encrypted_content) {
        const decryptedBytes = CryptoJS.AES.decrypt(response.data.encrypted_content, ENCRYPTION_SECRET_KEY, { iv: ENCRYPTION_IV });
        const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedText) {
          throw new Error('Decryption failed');
        }

        const parsedContent = JSON.parse(decryptedText);
        toast.success('Content Generated successfully!');
        
        
        // Navigate to ContentDisplayPage with the generated content
        navigate('/content-display', {
          state: {
            generatedContent: parsedContent.generated_content,
            translatedContent: '' // Initially set to empty string or you can set it based on your needs
          }
        });
      } else {
        setError('Failed to generate content. No content received.');
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
      setError('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-3xl mx-auto p-8 rounded-lg">
          <h1 className="text-center text-xl font-bold" style={{ fontFamily: "'Roboto Slab', sans-serif" }}>Content Generator</h1>
          <form className="mx-auto p-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col">
                <label className="mb-2 text-black">Company Information</label>
                <textarea
                  name="companyInfo"
                  value={formData.companyInfo}
                  onChange={handleChange}
                  className="p-3 border rounded shadow-sm text-black"
                  placeholder='Enter Company Information'
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 text-black">Content Purpose and Goals</label>
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
                <label className="mb-2 text-black">Desired Action from Audience</label>
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
              <label className="mb-2 text-black">SEO Keywords</label>
                <input
                  type="text"
                  name="seoKeywords"
                  value={formData.seoKeywords}
                  onChange={handleChange}
                  className="p-3 border rounded shadow-sm text-black"
                  placeholder='Enter SEO Keywords'
                />
                
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col">
                <label className="mb-2 text-black">Keywords</label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  className="p-3 border rounded shadow-sm text-black"
                  placeholder='Enter Keywords'
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 text-black">Audience Profile</label>
                <input
                  type="text"
                  name="audienceProfile"
                  value={formData.audienceProfile}
                  onChange={handleChange}
                  className="p-3 border rounded shadow-sm text-black"
                  placeholder='Enter your audience'
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col">
                <label className="mb-2 text-black">Format and Structure</label>
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
                <label className="mb-2 text-black">Number of Words</label>
                <input
                  type="number"
                  name="numberOfWords"
                  value={formData.numberOfWords}
                  onChange={handleChange}
                  className="p-3 border rounded shadow-sm text-black"
                  placeholder='Enter Number of Words'
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col">
              <label className="mb-2 text-black">Topic Details</label>
                <textarea
                  name="topicDetails"
                  value={formData.topicDetails}
                  onChange={handleChange}
                  className="p-3 border rounded shadow-sm text-black"
                  placeholder='Enter Topic Details'
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 text-black">References</label>
                <textarea
                  name="references"
                  value={formData.references}
                  onChange={handleChange}
                  className="p-3 border rounded shadow-sm text-black"
                  placeholder='Enter References'
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-blue-500 text-white rounded shadow-sm mt-4"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Content'}
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </form>
          <ToastContainer />
        </div>
      </div>
    </>
  );
}

export default ContentGenerationService;
