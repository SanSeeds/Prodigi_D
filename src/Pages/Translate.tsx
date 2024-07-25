import { useState } from "react";
import Nav from "../components/Global/Nav";
import axios from 'axios';
import config from '../config';

const apiUrl = config.apiUrl;

function Translate() {
  const [inputLanguage, setInputLanguage] = useState('English');
  const [translatedLanguage, setTranslatedLanguage] = useState('English');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [error, setError] = useState('');

  const handleTranslate = async () => {
    try {
      const response = await axios.post(`${apiUrl}/translate/`, {
        input_text: inputText,
        from_language: inputLanguage,
        to_language: translatedLanguage
      });

      const data = response.data;

      if (response.status !== 200) {
        throw new Error(data.error || 'Translation request failed');
      }

      if (data.error) {
        setError(data.error);
        setTranslatedText('');
      } else {
        setTranslatedText(data.translated_text);
        setError('');
      }
    } catch (error) {
      setError('Error during translation. Please try again.');
      setTranslatedText('');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <div className="flex flex-col flex-grow items-center py-4">
        <h2 className="text-3xl text-gray-800">Translate</h2>
        <div className="flex flex-col md:flex-row justify-center items-center w-full max-w-4xl p-8">
          <div className="flex flex-col items-center w-full md:w-1/2 p-4">
            <label className="mb-2 text-gray-600">Input Language</label>
            <select
              value={inputLanguage}
              onChange={(e) => setInputLanguage(e.target.value)}
              className="border rounded-md p-3 mb-4 w-full md:w-64 bg-gray-50 shadow-sm"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Telugu">Telugu</option>
              <option value="Marathi">Marathi</option>
              <option value="Kannada">Kannada</option>
              <option value="Bengali">Bengali</option>
              <option value="Odia">Odia</option>
              <option value="Assamese">Assamese</option>
              <option value="Punjabi">Punjabi</option>
              <option value="Malayalam">Malayalam</option>
              <option value="Gujarati">Gujarati</option>
              <option value="Urdu">Urdu</option>
              <option value="Sanskrit">Sanskrit</option>
              <option value="Nepali">Nepali</option>
              <option value="Bodo">Bodo</option>
              <option value="Maithili">Maithili</option>
              <option value="Sindhi">Sindhi</option>
              <option value="Tamil">Tamil</option>

              

        

              {/* Add more languages as needed */}
            </select>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full md:w-80 h-48 border rounded-md p-3 bg-gray-50 shadow-sm"
              placeholder="Enter text to translate"
            />
          </div>
          <div className="flex flex-col items-center w-full md:w-1/2 p-4">
            <label className="mb-2 text-gray-600">Translated Language</label>
            <select
              value={translatedLanguage}
              onChange={(e) => setTranslatedLanguage(e.target.value)}
              className="border rounded-md p-3 mb-4 w-full md:w-64 bg-gray-50 shadow-sm"
            >
               <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Telugu">Telugu</option>
              <option value="Marathi">Marathi</option>
              <option value="Kannada">Kannada</option>
              <option value="Bengali">Bengali</option>
              <option value="Odia">Odia</option>
              <option value="Assamese">Assamese</option>
              <option value="Punjabi">Punjabi</option>
              <option value="Malayalam">Malayalam</option>
              <option value="Gujarati">Gujarati</option>
              <option value="Urdu">Urdu</option>
              <option value="Sanskrit">Sanskrit</option>
              <option value="Nepali">Nepali</option>
              <option value="Bodo">Bodo</option>
              <option value="Maithili">Maithili</option>
              <option value="Sindhi">Sindhi</option>
              <option value="Tamil">Tamil</option>

   
      
              



              {/* Add more languages as needed */}
            </select>
            <textarea
              value={translatedText}
              readOnly
              className="w-full md:w-80 h-48 border rounded-md p-3 bg-gray-50 shadow-sm"
              placeholder="Translation will appear here"
            />
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          onClick={handleTranslate}
          className="mt-4 px-8 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 shadow-lg transition duration-200"
        >
          Translate
        </button>
      </div>
    </div>
  );
}

export default Translate;
