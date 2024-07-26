import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react';
import Navbar from '../Global/Navbar';
import TranslateComponent from '../Global/TranslateContent';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { useLocation } from 'react-router-dom';

function ContentDisplayPage() {
  const location = useLocation();
  const { generatedContent, translatedContent } = location.state || {};
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const [translatedContentState, setTranslatedContent] = useState(translatedContent || '');
  const [error, setError] = useState('');

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
        generateDocx(generatedContent, 'Generated Content');
      } else if (type === 'translated') {
        if (!translatedContentState) {
          throw new Error('No translated content available.');
        }
        generateDocx(translatedContentState, 'Translated Content');
      } else {
        throw new Error('Invalid download type.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-3xl mx-auto p-8 rounded-lg">
          <h1 className="text-center text-3xl" style={{ fontFamily: "'Poppins', sans-serif" }}>Content Display</h1>
          {generatedContent && (
            <div className="w-full max-w-3xl mx-auto p-8 mt-6 rounded">
              <h2 className="text-xl mb-4">Generated Content:</h2>
              <p className="text-black whitespace-pre-line">
                {generatedContent.split('**').map((part: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined, index: number) => {
                  const key = index;
                  if (index % 2 === 1) {
                    return <strong key={key}>{part}</strong>;
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
          {translatedContentState && (
            <div className="w-full max-w-3xl mx-auto p-8 mt-1 rounded">
              <h2 className="text-xl mb-4">Translated Content:</h2>
              <p className="whitespace-pre-line">{translatedContentState}</p>
              <button
                onClick={handleDownload('translated')}
                className="w-full p-3 bg-green-500 text-white rounded shadow-sm mt-4"
              >
                Download Translated Content
              </button>
            </div>
          )}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </>
  );
}

export default ContentDisplayPage;
