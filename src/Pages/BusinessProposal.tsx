import { useState, useContext, ChangeEvent, FormEvent, useEffect } from 'react';
import Navbar from '../components/Global/Navbar';
import axios, { AxiosError } from 'axios';
import { AuthContext } from '../components/Global/AuthContext';
import CryptoJS from 'crypto-js';

import config from '../config';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const apiUrl = config.apiUrl;

// AES encryption constants
const AES_IV = CryptoJS.enc.Base64.parse("3G1Nd0j0l5BdPmJh01NrYg=="); // Initialize IV for AES encryption
const AES_SECRET_KEY = CryptoJS.enc.Base64.parse("XGp3hFq56Vdse3sLTtXyQQ=="); // Initialize secret key for AES encryption

function BusinessProposalService() {
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const [formData, setFormData] = useState({
    businessIntroduction: '',
    proposalObjective: 'New Project',
    numberOfWords: '',
    scopeOfWork: '',
    projectPhases: '',
    expectedOutcomes: '',
    technologiesAndInnovations: '',
    targetAudience: '',
    budgetInformation: '',
    timeline: '',
    benefitsToRecipient: '',
    closingRemarks: '',
  });

  const [,setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }
  const { accessToken } = authContext;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = JSON.stringify(formData);
      const encryptedPayload = CryptoJS.AES.encrypt(payload, AES_SECRET_KEY, { iv: AES_IV }).toString();

      const response = await axios.post<{ encrypted_content: string }>(
        `${apiUrl}/business_proposal_generator/`,
        { encrypted_content: encryptedPayload },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      if (response.data && response.data.encrypted_content) {
        const decryptedBytes = CryptoJS.AES.decrypt(response.data.encrypted_content, AES_SECRET_KEY, { iv: AES_IV });
        const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedText) {
          throw new Error('Decryption failed');
        }

        const parsedContent = JSON.parse(decryptedText);
        const formattedContent = parsedContent.generated_content.replace(/\n/g, '\n');
        
        
        // Redirect to /content-display with the generated content
        navigate('/content-display', { state: { generatedContent: formattedContent } });
        toast.success('Content generated successfully!');
      } else {
        setError('Failed to generate business proposal. No content received.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          console.error('Error response data:', axiosError.response.data);
          console.error('Error response status:', axiosError.response.status);
          console.error('Error response headers:', axiosError.response.headers);
        } else if (axiosError.request) {
          console.error('Error request:', axiosError.request);
        } else {
          console.error('Error:', axiosError.message);
        }
      } else {
        console.error('Error:', error);
      }
      setError('Failed to generate business proposal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  


 
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-3xl mx-auto p-8 rounded">
          <h1 className="text-center text-xl font-bold mb-6" style={{ fontFamily: "'Roboto Slab', sans-serif" }}>Business Proposal Generator</h1>
          <form onSubmit={handleSubmit} className="mt-4">
            {/* Form fields */}
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

            {/* Details of Proposal */}
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

            {/* Additional Fields */}
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
                  placeholder='Benefits to the Recipient'
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
          <ToastContainer position="bottom-right" autoClose={5000} />
        </div>
      </div>
    </>
  );
}

export default BusinessProposalService;
