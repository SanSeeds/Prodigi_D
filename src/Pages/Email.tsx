import { useState, useContext, ChangeEvent, FormEvent } from 'react';
import Navbar from '../components/Global/Navbar';
import axios, { AxiosError } from 'axios';
import { AuthContext } from '../components/Global/AuthContext';
import TranslateComponent from '../components/Global/TranslateContent'; // Import the new TranslateComponent
import CryptoJS from 'crypto-js'; // Import CryptoJS for AES decryption

const AES_IV = CryptoJS.enc.Base64.parse("KRP1pDpqmy2eJos035bxdg==");
const AES_SECRET_KEY = CryptoJS.enc.Base64.parse("HOykfyW56Uesby8PTgxtSA==");

function EmailService() {
    const [formData, setFormData] = useState({
      purpose: '',
      otherPurpose: '',
      subject: '',
      rephraseSubject: false,
      to: '',
      tone: 'Formal',
      keywords: Array(8).fill(''),
      contextualBackground: '',
      callToAction: 'Reply',
      additionalDetails: '',
      priorityLevel: 'Low',
      closingRemarks: '',
    });
  
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedEmail, setGeneratedEmail] = useState<string>('');
    const [translatedEmail, setTranslatedEmail] = useState<string>('');
  
    const authContext = useContext(AuthContext);
  
    if (!authContext) {
      throw new Error('AuthContext must be used within an AuthProvider');
    }
  
    const { accessToken } = authContext;
  
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
        setFormData({ ...formData, [name]: e.target.checked });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    };
  
    const handleKeywordChange = (index: number, value: string) => {
      const newKeywords = [...formData.keywords];
      newKeywords[index] = value;
      setFormData({ ...formData, keywords: newKeywords });
    };
  
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
  
      const payload = {
        ...formData,
        purpose: formData.purpose === 'Other' ? formData.otherPurpose : formData.purpose,
        callToAction: formData.callToAction === 'Other' ? formData.callToAction : formData.callToAction,
      };
  
      try {
        const response = await axios.post<{ encrypted_content: string }>('http://localhost:8000/email_generator/', payload, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });
  
        if (response.data && response.data.encrypted_content) {
          // Decrypt the content
          const decryptedBytes = CryptoJS.AES.decrypt(response.data.encrypted_content, AES_SECRET_KEY, { iv: AES_IV });
          const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
          
          if (!decryptedText) {
            throw new Error('Decryption failed');
          }
  
          setGeneratedEmail(decryptedText);
          setError('');
        } else {
          setError('Failed to generate email. No content received.');
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
          console.error('An error occurred:', error);
        }
        setError('Failed to generate email. Please try again.');
      } finally {
        setLoading(false);
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
                {formData.keywords.map((keyword, index) => (
                  <div key={index} className="flex flex-col">
                    <label className="block mb-2 font-bold text-black">Keyword {index + 1}</label>
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => handleKeywordChange(index, e.target.value)}
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
                  <option value="Other">Other</option>
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
                <label className="block mb-2 font-bold text-black">Priority Level (Required)</label>
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
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate Email"}
                </button>
              </div>
            </form>
            {error && <div className="mt-4 text-red-500">{error}</div>}
            {generatedEmail && (
              <div className="mt-4 p-4 rounded">
                <h2 className="text-2xl font-bold mb-2">Generated Email</h2>
                <pre className="whitespace-pre-wrap">{generatedEmail}</pre>
                <TranslateComponent 
                  generatedContent={generatedEmail} 
                  setTranslatedContent={setTranslatedEmail} 
                  setError={setError} 
                />
              </div>
            )}
            {translatedEmail && (
              <div className="mt-4 p-4 rounded">
                <h2 className="text-2xl font-bold mb-2">Translated Email</h2>
                <pre className="whitespace-pre-wrap">{translatedEmail}</pre>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
  
  export default EmailService;
  