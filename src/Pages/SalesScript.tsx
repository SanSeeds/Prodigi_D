import { useState, useContext } from 'react';
import axios, { AxiosError } from 'axios';
import Navbar from '../components/Global/Navbar';
import { AuthContext } from '../components/Global/AuthContext';

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

  const [generatedScript, setGeneratedScript] = useState<string>('');
  const [error, setError] = useState<string>('');
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { accessToken } = authContext;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post<{ generated_content: string }>('http://localhost:8000/sales_script_generator/', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`, // Include access token
        },
      });

      if (response.data && response.data.generated_content) {
        setGeneratedScript(response.data.generated_content);
        setError('');
      } else {
        setError('Failed to generate sales script. No content received.');
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
      setError('Failed to generate sales script. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      
      <h1 className="text-center text-3xl mb-6 text-black font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
        Sales Script Generator
      </h1>

      <div className="min-h-screen flex flex-col items-center justify-center">
        <form className="p-6 w-full max-w-4xl space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="company_details" className="block text-sm font-bold text-gray-700">Company Details</label>
            <textarea
              id="company_details"
              name="company_details"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={2}
              value={formData.company_details}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="num_words" className="block text-sm font-bold text-gray-700">Number of words</label>
              <input
                type="text"
                id="num_words"
                name="num_words"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.num_words}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="product_descriptions" className="block text-sm font-bold text-gray-700">Names and Descriptions of Products</label>
              <textarea
                id="product_descriptions"
                name="product_descriptions"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                rows={2}
                value={formData.product_descriptions}
                onChange={handleChange}
              ></textarea>
            </div>
            <div>
              <label htmlFor="features_benefits" className="block text-sm font-bold text-gray-700">Key Features and Benefits</label>
              <textarea
                id="features_benefits"
                name="features_benefits"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                rows={2}
                value={formData.features_benefits}
                onChange={handleChange}
              ></textarea>
            </div>
            <div>
              <label htmlFor="pricing_info" className="block text-sm font-bold text-gray-700">Pricing Information</label>
              <textarea
                id="pricing_info"
                name="pricing_info"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                rows={2}
                value={formData.pricing_info}
                onChange={handleChange}
              ></textarea>
            </div>
            <div>
              <label htmlFor="promotions" className="block text-sm font-bold text-gray-700">Promotions or Special Offers</label>
              <textarea
                id="promotions"
                name="promotions"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                rows={2}
                value={formData.promotions}
                onChange={handleChange}
              ></textarea>
            </div>
            <div>
              <label htmlFor="target_audience" className="block text-sm font-bold text-gray-700">Target Audience</label>
              <textarea
                id="target_audience"
                name="target_audience"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                rows={2}
                value={formData.target_audience}
                onChange={handleChange}
              ></textarea>
            </div>
            <div>
              <label htmlFor="sales_objectives" className="block text-sm font-bold text-gray-700">Sales Objectives</label>
              <textarea
                id="sales_objectives"
                name="sales_objectives"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                rows={2}
                value={formData.sales_objectives}
                onChange={handleChange}
              ></textarea>
            </div>
            <div>
              <label htmlFor="tone_style" className="block text-sm font-bold text-gray-700">Tone and Style</label>
              <textarea
                id="tone_style"
                name="tone_style"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                rows={2}
                value={formData.tone_style}
                onChange={handleChange}
              ></textarea>
            </div>
            <div>
              <label htmlFor="competitive_advantage" className="block text-sm font-bold text-gray-700">Competitive Advantages</label>
              <textarea
                id="competitive_advantage"
                name="competitive_advantage"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                rows={2}
                value={formData.competitive_advantage}
                onChange={handleChange}
              ></textarea>
            </div>
            <div>
              <label htmlFor="testimonials" className="block text-sm font-bold text-gray-700">Customer Testimonials or Case Studies</label>
              <textarea
                id="testimonials"
                name="testimonials"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                rows={2}
                value={formData.testimonials}
                onChange={handleChange}
              ></textarea>
            </div>
            <div>
              <label htmlFor="compliance" className="block text-sm font-bold text-gray-700">Compliance and Regulatory Requirements</label>
              <textarea
                id="compliance"
                name="compliance"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                rows={2}
                value={formData.compliance}
                onChange={handleChange}
              ></textarea>
            </div>
            <div>
              <label htmlFor="tech_integration" className="block text-sm font-bold text-gray-700">Technical Integrations</label>
              <textarea
                id="tech_integration"
                name="tech_integration"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                rows={2}
                value={formData.tech_integration}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="flex items-center px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Generate Sales Script
            </button>
          </div>
        </form>
      </div>
      {generatedScript && (
        <div className="mt-6 p-6 border rounded shadow-sm flex justify-center">
          <div className=" max-w-4xl">
            <h2 className="text-2xl font-bold mb-4 text-center">Generated Sales Script:</h2>
            <pre className="whitespace-pre-wrap p-4 rounded-md">{generatedScript}</pre>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-6 p-6 border rounded bg-red-100 text-red-800 shadow-sm">
          {error}
        </div>
      )}
    </>
  );
}

export default SalesScriptService;