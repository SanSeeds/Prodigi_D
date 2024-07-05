import { useState, useContext, ChangeEvent, FormEvent } from 'react';
import Navbar from '../components/Global/Navbar';
import axios, { AxiosError } from 'axios';
import { AuthContext } from '../components/Global/AuthContext';
import TranslateComponent from '../components/Global/TranslateContent';
import CryptoJS from 'crypto-js';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { toast, ToastContainer } from 'react-toastify';

const AES_IV = CryptoJS.enc.Base64.parse("3G1Nd0j0l5BdPmJh01NrYg==");
const AES_SECRET_KEY = CryptoJS.enc.Base64.parse("XGp3hFq56Vdse3sLTtXyQQ==");

function EmailService() {
  const [formData, setFormData] = useState({
    purpose: '',
    otherPurpose: '',
    subject: '',
    rephraseSubject: false,
    to: '',
    tone: 'Formal',
    keyword_1: '',
    keyword_2: '',
    keyword_3: '',
    keyword_4: '',
    keyword_5: '',
    keyword_6: '',
    keyword_7: '',
    keyword_8: '',
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Encrypt the payload
      const payload = JSON.stringify(formData);
      const encryptedPayload = CryptoJS.AES.encrypt(payload, AES_SECRET_KEY, { iv: AES_IV }).toString();

      // Send encrypted payload to backend
      const response = await axios.post(
        'http://localhost:8000/email_generator/',
        { encrypted_content: encryptedPayload },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      // Decrypt the response
      if (response.data && response.data.encrypted_content) {
        const decryptedBytes = CryptoJS.AES.decrypt(response.data.encrypted_content, AES_SECRET_KEY, { iv: AES_IV });
        const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedText) {
          throw new Error('Decryption failed');
        }

        const parsedContent = JSON.parse(decryptedText);

        if (parsedContent.generated_content) {
          setGeneratedEmail(parsedContent.generated_content);
          toast.success('Email sent successfully!');
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
        if (!generatedEmail) {
          throw new Error('No generated content available.');
        }
        generateDocx(generatedEmail, 'Generated_Email');
      } else if (type === 'translated') {
        if (!translatedEmail) {
          throw new Error('No translated content available.');
        }
        generateDocx(translatedEmail, 'Translated_Email');
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
              {[...Array(8)].map((_, index) => (
                <div key={index} className="flex flex-col">
                  <label className="block mb-2 font-bold text-black">Keyword {index + 1}</label>
                  <input
                    type="text"
                    name={`keyword_${index + 1}`}
                    value={(formData as any)[`keyword_${index + 1}`]}
                    onChange={handleChange}
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
                <option value="A Confirmation">A Confirmation</option>
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
              <label className="block mb-2 font-bold text-black">Priority Level (Optional)</label>
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
            <div className="mb-6 text-center">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Email'}
              </button>
            </div>
          </form>
        
          {error && <p className="text-center text-red-500">{error}</p>}
          {generatedEmail && (
            <div className="mt-6 p-6 ">
              <h2 className="text-2xl font-bold text-black mb-4">Generated Email:</h2>
              <p className="whitespace-pre-line text-black">{generatedEmail}</p>
              <button
                onClick={handleDownload('generated')}
                className="w-full p-3 bg-green-500 text-white font-bold rounded shadow-sm mt-4"
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
              <h2 className="text-2xl font-bold mb-4">Translated Content</h2>
              <div dangerouslySetInnerHTML={{ __html: translatedEmail }} />
              <button
                onClick={handleDownload('translated')}
                className="w-full p-3 bg-green-500 text-white font-bold rounded shadow-sm mt-4"
              >
                Download Translated Email
              </button>
            </div>
          )}
          {error && (
            <div className="mt-6 p-6 border rounded bg-red-100 text-red-800 shadow-sm">
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={5000} />

    </>
  );
}

export default EmailService;
