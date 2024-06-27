import { useState, useContext } from 'react';
import axios, { AxiosError } from 'axios';
import Navbar from '../components/Global/Navbar';
import { AuthContext } from '../components/Global/AuthContext';
import TranslateComponent from '../components/Global/TranslateContent'; // Import the TranslateComponent

function ContentGenerationService() {
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

  const [generatedContent, setGeneratedContent] = useState('');
  const [translatedContent, setTranslatedContent] = useState(''); // State for translated content
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setGeneratedContent('');
    setTranslatedContent(''); // Clear translated content when generating new content
    try {
      console.log('Form data:', formData); // Log form data
      const response = await axios.post<{ generated_content: string }>('http://localhost:8000/content_generator/', 
        {
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
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`, // Include access token
          },
        }
      );

      console.log('Response:', response.data); // Log response data
      if (response.data && response.data.generated_content) {
        setGeneratedContent(response.data.generated_content);
      } else {
        setError('Failed to generate content. No content received.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // AxiosError type assertion
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          console.error('Error response data:', axiosError.response.data);
          console.error('Error response status:', axiosError.response.status);
          console.error('Error response headers:', axiosError.response.headers);
        } else if (axiosError.request) {
          console.error('Error request:', axiosError.request);
        }
      } else {
        // Generic error handling
        console.log(error);
      }
      setError('Failed to generate content. Please try again.');
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
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">SEO and Keywords</label>
            <input
              type="text"
              name="seoKeywords"
              value={formData.seoKeywords}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">References and Sources</label>
            <input
              type="text"
              name="references"
              value={formData.references}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
        </div>
        <div className="flex justify-center">
          <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Generate
          </button>
        </div>
      </form>
      {generatedContent && (
        <div className="w-full max-w-3xl mx-auto p-8 mt-6">
          <h2 className="text-xl font-bold mb-4">Generated Content</h2>
          <p className="text-black whitespace-pre-line">{generatedContent}</p>
          <TranslateComponent 
            generatedContent={generatedContent} 
            setTranslatedContent={setTranslatedContent} 
            setError={setError} 
          />
        </div>
      )}
      {translatedContent && (
        <div className="w-full max-w-3xl mx-auto p-8 mt-6">
          <h2 className="text-xl font-bold mb-4">Translated Content</h2>
          <p className="text-black whitespace-pre-line">{translatedContent}</p>
        </div>
      )}
      {error && (
        <div className="w-full max-w-3xl mx-auto p-8 mt-6 border rounded shadow-sm text-red-500">
          {error}
        </div>
      )}
    </>
  );
};

export default ContentGenerationService;