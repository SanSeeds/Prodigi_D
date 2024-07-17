import { useState } from "react"; // Import useState hook from React
import axios, { AxiosError } from 'axios'; // Import axios and AxiosError from axios
import { useContext } from 'react'; // Import useContext hook from React
import { AuthContext } from './AuthContext'; // Import AuthContext from AuthContext file
import config from './../../config';

const apiUrl = config.apiUrl;

interface TranslateComponentProps { // Define interface for component props
  generatedContent: string; // String prop for generated content
  setTranslatedContent: (content: string) => void; // Function prop to set translated content
  setError: (error: string) => void; // Function prop to set error message
}

const TranslateComponent: React.FC<TranslateComponentProps> = ({ generatedContent, setTranslatedContent, setError }) => {
  // Define the TranslateComponent as a functional component with specified props

  const [selectedLanguage, setSelectedLanguage] = useState('English'); // Initialize state for selected language with default value 'English'
  const authContext = useContext(AuthContext); // Use AuthContext to get authentication context

  if (!authContext) { // Check if authContext is not available
    throw new Error("AuthContext must be used within an AuthProvider"); // Throw error if authContext is missing
  }

  const { accessToken } = authContext; // Destructure accessToken from authContext

  const handleTranslate = async () => { // Define asynchronous function to handle translation
    try {
      const response = await axios.post<{ translated_content: string }>(`${apiUrl}/translate_content/`, {
        // Send POST request to translation API endpoint
        generated_content: generatedContent, // Include generated content in request body
        language: selectedLanguage, // Include selected language in request body
      }, {
        headers: {
          'Content-Type': 'application/json', // Set content type header
          'Authorization': `Bearer ${accessToken}`, // Set authorization header with access token
        },
      });

      if (response.data && response.data.translated_content) { // Check if response contains translated content
        setTranslatedContent(response.data.translated_content); // Set translated content using prop function
      } else {
        setError('Translation error occurred'); // Set error message if translation fails
      }
    } catch (error) { // Catch any errors during the request
      if (axios.isAxiosError(error)) { // Check if error is an AxiosError
        const axiosError = error as AxiosError; // Cast error to AxiosError
        if (axiosError.response) { // Check if error has a response
          console.error('Error response data:', axiosError.response.data); // Log response data
          console.error('Error response status:', axiosError.response.status); // Log response status
          console.error('Error response headers:', axiosError.response.headers); // Log response headers
        } else if (axiosError.request) { // Check if error has a request but no response
          console.error('Error request:', axiosError.request); // Log request
        }
      } else {
        console.log(error); // Log non-Axios errors
      }
      setError('Translation error occurred'); // Set error message if request fails
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
