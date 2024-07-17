import { useState, useContext, ChangeEvent, FormEvent } from 'react'; // Importing necessary hooks and types from React
import axios from 'axios'; // Importing axios for making HTTP requests
import Navbar from "../components/Global/Navbar"; // Importing Navbar component
import TranslateComponent from "../components/Global/TranslateContent"; // Importing TranslateComponent for translation
import { AuthContext } from '../components/Global/AuthContext'; // Importing AuthContext for authentication context
import CryptoJS from 'crypto-js'; // Importing CryptoJS for encryption
import { saveAs } from 'file-saver'; // Importing file-saver for saving files
import { Document, Packer, Paragraph, TextRun } from 'docx'; // Importing docx for creating Word documents
import config from '../config';

const apiUrl = config.apiUrl;

const ENCRYPTION_IV = CryptoJS.enc.Base64.parse("3G1Nd0j0l5BdPmJh01NrYg=="); // Defining the initialization vector for AES encryption
const ENCRYPTION_SECRET_KEY = CryptoJS.enc.Base64.parse("XGp3hFq56Vdse3sLTtXyQQ=="); // Defining the secret key for AES encryption

function SummarizeService() {
    // State for form data
    const [formData, setFormData] = useState({
        documentContext: 'Research Paper',
        mainSubject: 'Technology',
        purpose: 'General Overview',
        lengthDetail: 'High-level Overview',
        importantElements: '',
        audience: '',
        tone: '',
        format: '',
        additionalInstructions: '',
        uploadFile: null as File | null // State for the uploaded file, initialized to null
    });

    // State for generated content, translated content, loading status, and errors
    const [generatedContent, setGeneratedContent] = useState('');
    const [translatedContent, setTranslatedContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const authContext = useContext(AuthContext); // Accessing the authentication context

    if (!authContext) {
        throw new Error('AuthContext must be used within an AuthProvider'); // Throwing an error if AuthContext is not available
    }

    const { accessToken } = authContext; // Destructuring accessToken from AuthContext

    // Handle form input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target; // Extracting name and value from the input event
        setFormData({ ...formData, [name]: value }); // Updating formData state with the new input value
    };

    // Handle file input changes
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFormData({ ...formData, uploadFile: e.target.files[0] }); // Updating formData state with the selected file
        }
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Preventing default form submission behavior
        setLoading(true); // Setting loading state to true
        setError(''); // Resetting error state
    
        try {
            const payload = JSON.stringify({
                documentContext: formData.documentContext,
                mainSubject: formData.mainSubject,
                summary_purpose: formData.purpose,
                length_detail: formData.lengthDetail,
                important_elements: formData.importantElements,
                audience: formData.audience,
                tone: formData.tone,
                format: formData.format,
                additional_instructions: formData.additionalInstructions,
            });
    
            const encryptedPayload = CryptoJS.AES.encrypt(payload, ENCRYPTION_SECRET_KEY, { iv: ENCRYPTION_IV }).toString(); // Encrypting the payload
    
            const form = new FormData();
            form.append('encrypted_content', encryptedPayload); // Appending encrypted content to the form
            if (formData.uploadFile) {
                form.append('document', formData.uploadFile); // Appending the uploaded file to the form
            }
    
            const response = await axios.post(`${apiUrl}/summarize_document/`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
    
            if (response.data && response.data.encrypted_content) {
                const decryptedBytes = CryptoJS.AES.decrypt(response.data.encrypted_content, ENCRYPTION_SECRET_KEY, { iv: ENCRYPTION_IV });
                const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    
                if (!decryptedText) {
                    throw new Error('Decryption failed'); // Throwing error if decryption fails
                }
    
                const parsedContent = JSON.parse(decryptedText); // Parsing decrypted text as JSON
                const formattedContent = parsedContent.generated_content.replace(/\[|\]/g, '').replace(/\n/g, '\n'); // Formatting the content
    
                setGeneratedContent(formattedContent); // Setting the generated content
                setTranslatedContent(''); // Resetting translated content
            } else {
                setError('Failed to generate content. No content received.'); // Setting error if no content is received
            }
        } catch (error) {
            console.error('Error generating content:', error); // Logging error
            setError('Failed to generate content. Please try again.'); // Setting error message for UI
        } finally {
            setLoading(false); // Setting loading state to false
        }
    };

    // Generate a .docx file from content with proper formatting
    const generateDocx = (content: string, fileName: string) => {
        const lines = content.split('\n'); // Splitting content into lines
        const docContent = lines.map(line => {
            const parts = line.split('**'); // Splitting line by '**' for bold formatting
            const textRuns = parts.map((part, index) => {
                if (index % 2 === 1) {
                    return new TextRun({ text: part, bold: true }); // Creating bold text run
                } else {
                    return new TextRun(part); // Creating regular text run
                }
            });
            return new Paragraph({ children: textRuns }); // Creating paragraph with text runs
        });
    
        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: docContent, // Adding content to the document
                },
            ],
        });
    
        Packer.toBlob(doc).then(blob => {
            saveAs(blob, `${fileName}.docx`); // Saving the document as a .docx file
        });
    };

    // Handle download button clicks
    const handleDownload = (type: string) => () => {
        try {
            if (type === 'generated') {
                if (!generatedContent) {
                    throw new Error('No generated content available.'); // Throwing error if no generated content is available
                }
                generateDocx(generatedContent, 'Generated_Content'); // Generating .docx file for generated content
            } else if (type === 'translated') {
                if (!translatedContent) {
                    throw new Error('No translated content available.'); // Throwing error if no translated content is available
                }
                generateDocx(translatedContent, 'Translated_Content'); // Generating .docx file for translated content
            } else {
                throw new Error('Invalid download type.'); // Throwing error for invalid download type
            }
        } catch (error) {
            // setError(error.message); // Setting error message for UI (commented out)
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full max-w-3xl mx-auto p-8 rounded-lg">
                    <h1 className="text-center text-3xl mt-5 font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>Summarize Document</h1>
                    <form className="w-full max-w-3xl mx-auto p-8" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="flex flex-col">
                                <label className="mb-2 font-bold text-black">Document Context</label>
                                <select
                                    name="documentContext"
                                    value={formData.documentContext}
                                    onChange={handleChange}
                                    className="p-3 border rounded shadow-sm text-black"
                                >
                                    <option value="Research Paper">Research Paper</option>
                                    <option value="Article">Article</option>
                                    <option value="Report">Report</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 font-bold text-black">Main Subject</label>
                                <select
                                    name="mainSubject"
                                    value={formData.mainSubject}
                                    onChange={handleChange}
                                    className="p-3 border rounded shadow-sm text-black"
                                >
                                    <option value="Technology">Technology</option>
                                    <option value="Science">Science</option>
                                    <option value="Health">Health</option>
                                    <option value="Business">Business</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="flex flex-col">
                                <label className="mb-2 font-bold text-black">Purpose of the Summary</label>
                                <select
                                    name="purpose"
                                    value={formData.purpose}
                                    onChange={handleChange}
                                    className="p-3 border rounded shadow-sm text-black"
                                >
                                    <option value="General Overview">General Overview</option>
                                    <option value="In-depth Analysis">In-depth Analysis</option>
                                    <option value="Executive Summary">Executive Summary</option>
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 font-bold text-black">Length and Detail</label>
                                <select
                                    name="lengthDetail"
                                    value={formData.lengthDetail}
                                    onChange={handleChange}
                                    className="p-3 border rounded shadow-sm text-black"
                                >
                                    <option value="High-level Overview">High-level Overview</option>
                                    <option value="Detailed Summary">Detailed Summary</option>
                                    <option value="Brief Summary">Brief Summary</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="flex flex-col">
                                <label className="mb-2 font-bold text-black">Important Elements to Include</label>
                                <textarea
                                    name="importantElements"
                                    value={formData.importantElements}
                                    onChange={handleChange}
                                    className="p-3 border rounded shadow-sm text-black"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 font-bold text-black">Audience</label>
                                <input
                                    type="text"
                                    name="audience"
                                    value={formData.audience}
                                    onChange={handleChange}
                                    className="p-3 border rounded shadow-sm text-black"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="flex flex-col">
                                <label className="mb-2 font-bold text-black">Tone</label>
                                <input
                                    type="text"
                                    name="tone"
                                    value={formData.tone}
                                    onChange={handleChange}
                                    className="p-3 border rounded shadow-sm text-black"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 font-bold text-black">Format</label>
                                <input
                                    type="text"
                                    name="format"
                                    value={formData.format}
                                    onChange={handleChange}
                                    className="p-3 border rounded shadow-sm text-black"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 mb-6">
                            <div className="flex flex-col">
                                <label className="mb-2 font-bold text-black">Additional Instructions</label>
                                <textarea
                                    name="additionalInstructions"
                                    value={formData.additionalInstructions}
                                    onChange={handleChange}
                                    className="p-3 border rounded shadow-sm text-black"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 mb-6">
                            <div className="flex flex-col">
                                <label className="mb-2 font-bold text-black">Upload Document</label>
                                <input
                                    type="file"
                                    name="uploadFile"
                                    onChange={handleFileChange}
                                    className="p-3 border rounded shadow-sm text-black"
                                />
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <button type="submit" className="w-full p-3 bg-blue-500 text-white font-bold rounded shadow-sm" disabled={loading}>
                                {loading ? "Generating..." : "Summarize"}
                            </button>
                        </div>
                    </form>
                    {error && <div className="mt-4 text-red-500">{error}</div>}
                    {generatedContent && (
                        <div className="mt-4 p-4">
                            <h2 className="text-2xl font-bold mb-2">Generated Content</h2>
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
                        <div className="mt-4 p-4">
                            <h2 className="text-2xl font-bold mb-2">Translated Content</h2>
                            <pre className="whitespace-pre-wrap">{translatedContent}</pre>
                            <button
                                onClick={handleDownload('translated')}
                                className="w-full p-3 bg-green-500 text-white font-bold rounded shadow-sm mt-4"
                            >
                                Download Translated Content
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default SummarizeService;
