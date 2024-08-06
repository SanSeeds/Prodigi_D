import React, { useState, useContext, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Navbar from '../components/Global/Navbar';
import axios, { AxiosError } from 'axios';
import { AuthContext } from '../components/Global/AuthContext';
import CryptoJS from 'crypto-js';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { toast, ToastContainer } from 'react-toastify';
import config from '../config';
import TranslateComponent from '../components/Global/TranslateContent';

const apiUrl = config.apiUrl;

// Constants for AES encryption
const AES_IV = CryptoJS.enc.Base64.parse("3G1Nd0j0l5BdPmJh01NrYg==");
const AES_SECRET_KEY = CryptoJS.enc.Base64.parse("XGp3hFq56Vdse3sLTtXyQQ==");

interface FormData {
  purpose: string;
  otherPurpose: string;
  subject: string;
  rephraseSubject: boolean;
  to: string;
  tone: string;
  num_words: string;
  keywords: string;
  contextualBackground: string;
  callToAction: string;
  additionalDetails: string;
  priorityLevel: string;
  closingRemarks: string;
  [key: string]: any;
}

const EmailService: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const navigate = useNavigate(); // Initialize useNavigate
  const [formData, setFormData] = useState<FormData>({
    purpose: '',
    otherPurpose: '',
    subject: '',
    num_words: '',
    rephraseSubject: false,
    to: '',
    tone: 'Formal',
    keywords: '',
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
  const [wordCountError, setWordCountError] = useState<string | null>(null);

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { accessToken } = authContext;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      setFormData({ ...formData, [name]: e.target.checked });
    } else if (name === 'num_words') {
      const numValue = parseInt(value, 10);
      if (numValue < 75 || numValue > 450) {
        setWordCountError('Number of words must be between 75 and 450.');
      } else if (numValue < 0) {
        setWordCountError('Number of words cannot be negative.');
      } else {
        setWordCountError(null);
      }
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    
    try {
      const payload = JSON.stringify(formData);
      const encryptedPayload = CryptoJS.AES.encrypt(payload, AES_SECRET_KEY, { iv: AES_IV }).toString();
      const response = await axios.post(
        `${apiUrl}/email_generator/`,
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

        if (parsedContent.generated_content) {
          setGeneratedEmail(parsedContent.generated_content);
          toast.success('Email generated successfully!');

          // Navigate to /content-display with the generated content
          navigate('/content-display', { state: { generatedContent: parsedContent.generated_content } });
        } else {
          setError('Failed to generate email. No content received.');
        }
      } else {
        setError('Failed to generate email. No content received.');
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
      setError('Failed to generate email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateDocx = (content: string, fileName: string) => {
    const lines = content.split('\n');
    const docContent = lines.map(line => new Paragraph({ children: [new TextRun(line)] }));

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: docContent,
        },
      ],
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, fileName);
    }).catch(error => {
      console.error('Error generating DOCX:', error);
      toast.error('Failed to generate DOCX file.');
    });
  };

  const handleDownload = (type: string) => () => {
    try {
      if (type === 'generated') {
        if (!generatedEmail) {
          throw new Error('No generated content available.');
        }
        generateDocx(generatedEmail, 'Generated_Email.docx');
      } else if (type === 'translated') {
        if (!translatedEmail) {
          throw new Error('No translated content available.');
        }
        generateDocx(translatedEmail, 'Translated_Email.docx');
      } else {
        throw new Error('Invalid download type.');
      }
    } catch (error) {
      console.error('Download error:', error);
      // toast.error(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-3xl mx-auto p-8 rounded-lg">
          <h1 className="text-center text-xl font-semibold mb-6 text-black">Email Generator</h1>
          <form onSubmit={handleSubmit} className="mt-4">
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="flex flex-col">
                <label className="block mb-2 text-black">Purpose</label>
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
              <div className="flex flex-col">
                <label className="block mb-2 text-black">Tone</label>
                <select
                  name="tone"
                  value={formData.tone}
                  onChange={handleChange}
                  className="w-full p-3 border rounded shadow-sm text-gray-700"
                >
                  <option value="Formal">Formal</option>
                  <option value="Informal">Informal</option>
                  <option value="Persuasive">Persuasive</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-black">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-3 mb-3 border rounded shadow-sm text-gray-700"
                placeholder='Enter Subject'
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="rephraseSubject"
                  checked={formData.rephraseSubject}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="text-black">Rephrase Subject</label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col">
                <label className="block mb-2 text-black">To</label>
                <input
                  type="text"
                  name="to"
                  value={formData.to}
                  onChange={handleChange}
                  className="w-full p-3 border rounded shadow-sm text-gray-700"
                  placeholder='Enter your Recipient type'
                />
              </div>
              <div className="mb-6">
        <label className="block mb-2 text-black">Number of Words</label>
        <input
          type="number"
          name="num_words"
          value={formData.num_words}
          onChange={handleChange}
          className="w-full p-3 border rounded shadow-sm text-gray-700"
          placeholder="Enter number of words (75-450)"
          min="0" // Prevent negative input
        />
        {wordCountError && <p className="text-red-500 mt-2">{wordCountError}</p>}
      </div>
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-black">Keywords (Optional, add up to 8, separated by commas)</label>
              <textarea
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                className="w-full p-3 border rounded shadow-sm text-gray-700"
                placeholder='Enter Keywords'
                rows={2}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col">
                <label className="block mb-2 text-black">Contextual Background</label>
                <textarea
                  name="contextualBackground"
                  value={formData.contextualBackground}
                  onChange={handleChange}
                  className="w-full p-3 border rounded shadow-sm text-gray-700"
                  placeholder='Enter Contextual Background'
                />
              </div>
              <div className="flex flex-col">
                <label className="block mb-2 text-black">Additional Details</label>
                <textarea
                  name="additionalDetails"
                  value={formData.additionalDetails}
                  onChange={handleChange}
                  className="w-full p-3 border rounded shadow-sm text-gray-700"
                  placeholder='Enter Additional Details (If Any)'
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col">
                <label className="block mb-2 text-black">Call to Action</label>
                <select
                  name="callToAction"
                  value={formData.callToAction}
                  onChange={handleChange}
                  className="w-full p-3 border rounded shadow-sm text-gray-700"
                >
                  <option value="Reply">Reply</option>
                  <option value="Schedule a Meeting">Schedule a Meeting</option>
                  <option value="Provide Feedback">Provide Feedback</option>
                  <option value="Other">Other</option>
                </select>
                {formData.callToAction === "Other" && (
                  <input
                    type="text"
                    name="otherCallToAction"
                    placeholder="If others, please specify"
                    value={formData.otherCallToAction}
                    onChange={handleChange}
                    className="w-full p-3 border rounded shadow-sm text-gray-700"
                  />
                )}
              </div>
              <div className="flex flex-col">
                <label className="block mb-2 text-black">Priority Level</label>
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
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-black">Closing Remarks</label>
              <textarea
                name="closingRemarks"
                value={formData.closingRemarks}
                onChange={handleChange}
                className="w-full p-3 border rounded shadow-sm text-gray-700"
                placeholder='Enter Closing Remarks'
              />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              disabled={loading}
            >
              {loading ? 'Generating Email...' : 'Generate Email'}
            </button>
          </form>
          {generatedEmail && (
            <div className="mt-6 p-6">
              <h2 className="text-2xl mb-4 text-black">Generated Email:</h2>
              <p className="text-black whitespace-pre-line">
                {generatedEmail.split('**').map((part, index) => {
                  if (index % 2 === 1) {
                    return <strong key={index}>{part}</strong>;
                  } else {
                    return part;
                  }
                })}
              </p>
              <button
                className="w-full p-3 bg-green-500 text-white rounded shadow-sm mt-4 hover:bg-green-600"
                onClick={handleDownload('generated')}
              >
                Download Generated Email
              </button>
              <TranslateComponent
                generatedContent={generatedEmail}
                setTranslatedContent={setTranslatedEmail}
                setError={setError}
              />
            </div>
          )}
          {translatedEmail && (
            <div className="mt-6 p-6">
              <h2 className="text-2xl mb-4">Translated Content</h2>
              <div dangerouslySetInnerHTML={{ __html: translatedEmail }} />
              <button
                onClick={handleDownload('translated')}
                className="w-full p-3 bg-green-500 text-white rounded shadow-sm mt-4 hover:bg-green-600"
              >
                Download Translated Content
              </button>
            </div>
          )}
          
          <ToastContainer position="bottom-right" autoClose={5000} />
        </div>
      </div>
    </>
  );
};

export default EmailService;
