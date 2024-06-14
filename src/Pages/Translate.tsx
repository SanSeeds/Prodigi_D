import { useState } from "react";
import Nav from "../components/Global/Nav";

function Translate(){
    const [inputLanguage, setInputLanguage] = useState('English');
    const [translatedLanguage, setTranslatedLanguage] = useState('English');
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
  
    const handleTranslate = () => {
      // Translation logic would go here
      // For now, we'll just copy the input text to the translated text
      setTranslatedText(inputText);
    };
  
    return (
      <>
      <Nav/>
      <div className="flex flex-col items-center mt-12 bg-gray-100 min-h-screen py-10">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Translate</h2>
        <div className="flex flex-col md:flex-row justify-center items-center w-full max-w-4xl bg-white p-8 shadow-lg rounded-lg">
          <div className="flex flex-col items-center w-full md:w-1/2 p-4">
            <label className="mb-2 text-gray-600">Input Language</label>
            <select
              value={inputLanguage}
              onChange={(e) => setInputLanguage(e.target.value)}
              className="border rounded-md p-3 mb-4 w-full md:w-64 bg-gray-50 shadow-sm"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
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
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
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
        <button
          onClick={handleTranslate}
          className="mt-8 px-8 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 shadow-lg transition duration-200"
        >
          Translate
        </button>
      </div>
      </>
    );
};

export default Translate;