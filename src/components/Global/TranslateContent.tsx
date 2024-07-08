import { useState } from "react";
import axios, { AxiosError } from 'axios';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

interface TranslateComponentProps {
  generatedContent: string;
  setTranslatedContent: (content: string) => void;
  setError: (error: string) => void;
}

const TranslateComponent: React.FC<TranslateComponentProps> = ({ generatedContent, setTranslatedContent, setError }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { accessToken } = authContext;

  const handleTranslate = async () => {
    try {
      const response = await axios.post<{ translated_content: string }>('http://127.0.0.1:8000/translate_content/', {
        generated_content: generatedContent,
        language: selectedLanguage,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.data && response.data.translated_content) {
        setTranslatedContent(response.data.translated_content);
      } else {
        setError('Translation error occurred');
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
        }
      } else {
        console.log(error);
      }
      setError('Translation error occurred');
    }
  };

  return (
    <div className="flex items-center mt-4">
      <select
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(e.target.value)}
        className="p-3 border rounded shadow-sm text-black mr-4"
      >
        <option value="English">English</option>
        <option value="Hindi">Hindi</option>
        <option value="Telugu">Telugu</option>
        <option value="Marathi">Marathi</option>
        <option value="Kannada">Kannada</option>
        <option value="Bengali">Bengali</option>

      
        {/* <option value="Marathi">Kannada</option>

        <option value="Marathi">Bengali</option> */}

        {/* Add more languages as needed */}
      </select>
      <button
        onClick={handleTranslate}
        className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Translate
      </button>
    </div>
  );
};

export default TranslateComponent;
