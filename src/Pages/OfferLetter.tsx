import { useState, useContext } from 'react';
import axios from 'axios';
import Navbar from '../components/Global/Navbar';
import { AuthContext } from '../components/Global/AuthContext';
import CryptoJS from 'crypto-js';
import { saveAs } from 'file-saver';
import { Document, IRunOptions, Packer, Paragraph, TextRun } from 'docx';
import TranslateComponent from '../components/Global/TranslateContent';

const AES_IV = CryptoJS.enc.Base64.parse('3G1Nd0j0l5BdPmJh01NrYg==');
const AES_SECRET_KEY = CryptoJS.enc.Base64.parse('XGp3hFq56Vdse3sLTtXyQQ==');

function OfferLetterService() {
  const [formData, setFormData] = useState({
    companyDetails: '',
    numberOfWords: '',
    status: 'Full-time',
    candidateFullName: '',
    positionTitle: '',
    department: '',
    supervisor: '',
    location: '',
    expectedStartDate: '',
    compensationPackage: '',
    benefits: '',
    workHours: '',
    duration: '',
    termsConditions: '',
    deadline: '',
    contactInfo: '',
    documentsNeeded: '',
    closingRemarks: '',
  });

  const [generatedContent, setGeneratedContent] = useState('');
  const [translatedContent, setTranslatedContent] = useState('');
  const [error, setError] = useState('');
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { accessToken } = authContext;

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError('');
    setGeneratedContent('');
    setTranslatedContent('');

    try {
      const payload = JSON.stringify(formData);
      const encryptedPayload = CryptoJS.AES.encrypt(payload, AES_SECRET_KEY, { iv: AES_IV }).toString();

      const response = await axios.post(
        'http://127.0.0.1:8000/offer_letter_generator/',
        { encrypted_content: encryptedPayload },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = response.data;
      if (response.status === 200) {
        const encryptedContent = data.encrypted_content;
        const decryptedBytes = CryptoJS.AES.decrypt(encryptedContent, AES_SECRET_KEY, { iv: AES_IV });
        const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedText) {
          throw new Error('Decryption failed');
        }

        const parsedContent = JSON.parse(decryptedText);
        const formattedContent = parsedContent.generated_content.replace(/\\n/g, '\n');

        setGeneratedContent(formattedContent);
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Error generating offer letter:', error);
      setError('An error occurred');
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

    return Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `${fileName}.docx`);
    });
  };

  const handleDownload = (type: string) => () => {
    try {
      if (type === 'generated') {
        if (!generatedContent) {
          throw new Error('No generated content available.');
        }
        generateDocx(generatedContent, 'Generated_Offer_Letter');
      } else if (type === 'translated') {
        if (!translatedContent) {
          throw new Error('No translated content available.');
        }
        generateDocx(translatedContent, 'Translated_Offer_Letter');
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
      <h1 className="text-center text-3xl mt-5 text-black font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>Offer Letter Generation</h1>
      <form className="w-full max-w-3xl mx-auto p-8 rounded" onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block mb-2 font-bold text-black">Company Details</label>
          <input
            type="text"
            name="companyDetails"
            value={formData.companyDetails}
            onChange={handleChange}
            className="p-3 border rounded shadow-sm text-black w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Number of Words</label>
            <input
              type="text"
              name="numberOfWords"
              value={formData.numberOfWords}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Candidate's Full Name</label>
            <input
              type="text"
              name="candidateFullName"
              value={formData.candidateFullName}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Position Title</label>
            <input
              type="text"
              name="positionTitle"
              value={formData.positionTitle}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Supervisor</label>
            <input
              type="text"
              name="supervisor"
              value={formData.supervisor}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Expected Start Date</label>
            <input
              type="date"
              name="expectedStartDate"
              value={formData.expectedStartDate}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-bold text-black">Offer Details</label>
          <textarea
            name="compensationPackage"
            value={formData.compensationPackage}
            onChange={handleChange}
            className="p-3 border rounded shadow-sm text-black w-full"
            placeholder="Compensation Package"
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-bold text-black">Benefits (Health insurance, retirement plans, etc.)</label>
          <textarea
            name="benefits"
            value={formData.benefits}
            onChange={handleChange}
            className="p-3 border rounded shadow-sm text-black w-full"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Work Hours and Schedule</label>
            <input
              type="text"
              name="workHours"
              value={formData.workHours}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-black">Duration of Employment</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="p-3 border rounded shadow-sm text-black"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-bold text-black">Terms and Conditions</label>
          <textarea
            name="termsConditions"
            value={formData.termsConditions}
            onChange={handleChange}
            className="p-3 border rounded shadow-sm text-black w-full"
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-bold text-black">Acceptance Deadline</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="p-3 border rounded shadow-sm text-black w-full"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-bold text-black">Contact Information</label>
          <textarea
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            className="p-3 border rounded shadow-sm text-black w-full"
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-bold text-black">Documents Needed for Onboarding</label>
          <textarea
            name="documentsNeeded"
            value={formData.documentsNeeded}
            onChange={handleChange}
            className="p-3 border rounded shadow-sm text-black w-full"
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-bold text-black">Closing Remarks</label>
          <textarea
            name="closingRemarks"
            value={formData.closingRemarks}
            onChange={handleChange}
            className="p-3 border rounded shadow-sm text-black w-full"
          ></textarea>
        </div>

        <div className="text-center">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Generate Offer Letter</button>
        </div>
      </form>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {generatedContent && (
        <div className="w-full max-w-3xl mx-auto p-8 mt-6 rounded">
          <h2 className="text-xl font-bold mb-4">Generated Offer Letter</h2>
          <p className="text-black whitespace-pre-line">
            {generatedContent.split('**').map((part, index) => {
              if (index % 2 === 1) {
                return <strong key={index}>{part}</strong>;
              } else {
                return part;
              }
            })}
          </p>
          <button
            onClick={handleDownload('generated')}
            className="w-full p-3 bg-green-500 text-white font-bold rounded shadow-sm mt-4"
          >
            Download Generated Content
          </button>
          <TranslateComponent
              generatedContent={generatedContent}
              setTranslatedContent={setTranslatedContent}
              setError={setError}
            />
      
        </div>
      )}
      {translatedContent && (
        <div className="w-full max-w-3xl mx-auto p-8 mt-6 rounded">
          <h2 className="text-xl font-bold mb-4">Translated Offer Letter</h2>
          <pre className="whitespace-pre-wrap">{translatedContent}</pre>
          <div className="flex justify-center mt-4">
          <button
            onClick={handleDownload('translated')}
            className="w-full p-3 bg-green-500 text-white font-bold rounded shadow-sm mt-4"
          >
            Download Translated Content
          </button>
          </div>
        </div>
      )}
    </>
  );
}

export default OfferLetterService;