import { useState, useContext, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../components/Global/Navbar";
import TranslateComponent from "../components/Global/TranslateContent";
import { AuthContext } from '../components/Global/AuthContext';
import CryptoJS from 'crypto-js';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import config from '../config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiUrl = config.apiUrl;

const ENCRYPTION_IV = CryptoJS.enc.Base64.parse("3G1Nd0j0l5BdPmJh01NrYg==");
const ENCRYPTION_SECRET_KEY = CryptoJS.enc.Base64.parse("XGp3hFq56Vdse3sLTtXyQQ==");

function SummarizeService() {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

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
        document: null as File | null,
        documentContent: '' // State for document content
    });

    const [generatedContent, setGeneratedContent] = useState('');
    const [translatedContent, setTranslatedContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('AuthContext must be used within an AuthProvider');
    }

    const { accessToken } = authContext;

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                setFormData({ ...formData, document: file, documentContent: reader.result as string });
            };
            reader.readAsText(file);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

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
                document_content: formData.documentContent // Add document content to payload
            });

            const encryptedPayload = CryptoJS.AES.encrypt(payload, ENCRYPTION_SECRET_KEY, { iv: ENCRYPTION_IV }).toString();

            const form = new FormData();
            form.append('encrypted_content', encryptedPayload);

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
                    throw new Error('Decryption failed');
                }

                const parsedContent = JSON.parse(decryptedText);
                const formattedContent = parsedContent.generated_content.replace(/\[|\]/g, '').replace(/\n/g, '\n');
                toast.success('Document Summarized successfully!');

                setGeneratedContent(formattedContent);
                setTranslatedContent('');
            } else {
                setError('Failed to generate content. No content received.');
            }
        } catch (error) {
            console.error('Error generating content:', error);
            setError('Failed to generate content. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const generateDocx = (content: string, fileName: string) => {
        const lines = content.split('\n');
        const docContent = lines.map(line => {
            const parts = line.split('**');
            const textRuns = parts.map((part, index) => {
                if (index % 2 === 1) {
                    return new TextRun({ text: part, bold: true });
                } else {
                    return new TextRun(part);
                }
            });
            return new Paragraph({ children: textRuns });
        });

        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: docContent,
                },
            ],
        });

        Packer.toBlob(doc).then(blob => {
            saveAs(blob, `${fileName}.docx`);
        });
    };

    const handleDownload = (type: string) => () => {
        try {
            if (type === 'generated') {
                if (!generatedContent) {
                    throw new Error('No generated content available.');
                }
                generateDocx(generatedContent, 'Generated_Content');
            } else if (type === 'translated') {
                if (!translatedContent) {
                    throw new Error('No translated content available.');
                }
                generateDocx(translatedContent, 'Translated_Content');
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
                    <h1 className="text-center text-3xl" style={{ fontFamily: "'Poppins', sans-serif" }}>Summarize Document</h1>
                    <form className="w-full max-w-3xl mx-auto p-8" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="flex flex-col">
                                <label className="mb-2 text-black">Document Context</label>
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
                                <label className="mb-2 text-black">Main Subject</label>
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
                                <label className="mb-2 text-black">Purpose of the Summary</label>
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
                                <label className="mb-2 text-black">Length and Detail</label>
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
                                <label className="mb-2 text-black">Important Elements to Include</label>
                                <textarea
                                    name="importantElements"
                                    value={formData.importantElements}
                                    onChange={handleChange}
                                    className="p-3 border rounded shadow-sm text-black"
                                    placeholder='Enter impornant elements to include'

                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="mb-2 text-black">Audience</label>
                                    <input
                                        type="text"
                                        name="audience"
                                        value={formData.audience}
                                        onChange={handleChange}
                                        className="p-3 border rounded shadow-sm text-black"
                                        placeholder='Enter your audience'

                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="flex flex-col">
                                    <label className="mb-2 text-black">Tone</label>
                                    <input
                                        type="text"
                                        name="tone"
                                        value={formData.tone}
                                        onChange={handleChange}
                                        className="p-3 border rounded shadow-sm text-black"
                                        placeholder='Enter Tone'

                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="mb-2 text-black">Format</label>
                                    <input
                                        type="text"
                                        name="format"
                                        value={formData.format}
                                        onChange={handleChange}
                                        className="p-3 border rounded shadow-sm text-black"
                                        placeholder='Enter Format'

                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-6 mb-6">
                                <div className="flex flex-col">
                                    <label className="mb-2 text-black">Additional Instructions</label>
                                    <textarea
                                        name="additionalInstructions"
                                        value={formData.additionalInstructions}
                                        onChange={handleChange}
                                        className="p-3 border rounded shadow-sm text-black"
                                        placeholder='Enter Additional Instructions'

                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-6 mb-6">
                                <div className="flex flex-col">
                                    <label className="mb-2 text-black">Upload Document</label>
                                    <input
                                        type="file"
                                        name="document"
                                        onChange={handleFileChange}
                                        className="p-3 border rounded shadow-sm text-black"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <button type="submit"           
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"

                                    disabled={loading}>
                                    {loading ? "Generating..." : "Summarize"}
                                </button>
                            </div>
                        </form>
                        {error && <div className="mt-4 text-red-500">{error}</div>}
                        {generatedContent && (
                            <div className="mt-4 p-4">
                                <h2 className="text-2xl mb-2">Generated Content</h2>
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
                                    className="w-full p-3 bg-green-500 text-white rounded shadow-sm mt-4"
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
                                <h2 className="text-2xl mb-2">Translated Content</h2>
                                <pre className="whitespace-pre-wrap">{translatedContent}</pre>
                                <button
                                    onClick={handleDownload('translated')}
                                    className="w-full p-3 bg-green-500 text-white rounded shadow-sm mt-4"
                                >
                                    Download Translated Content
                                </button>
                            </div>
                        )}
                              <ToastContainer   position="bottom-right" autoClose={5000} />

                    </div>
                </div>
            </>
        );
    }
    
    export default SummarizeService;
    
