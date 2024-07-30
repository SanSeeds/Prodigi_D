import { useContext, useEffect, useState } from 'react';
import Logo from '../../assets/logo2.png'; // Importing the logo image
import '../../App.css'; // Importing global CSS file
import { Link } from 'react-router-dom'; // Import Link component from react-router-dom for navigation
import config from '../../config'; // Ensure config file is correctly imported
import { AuthContext } from './AuthContext';
import { FaHome, FaUser, FaSignOutAlt } from 'react-icons/fa'; // Import icons from react-icons

const apiUrl = config.apiUrl;

const Navbar = () => {
  const [userFirstName, setUserFirstName] = useState<string | null>(null); // State to store user's first name
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for managing menu toggle
  const authContext = useContext(AuthContext); // Using useContext to get the authContext value

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider"); // Throwing an error if AuthContext is not provided
  }

  const { user, logout } = authContext; // Destructuring user and logout from authContext

  // Fetch user details from API when the component mounts
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${apiUrl}/profile/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // Fetch token from local storage
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserFirstName(data.user.first_name); // Set user's first name
        } else {
          console.error('Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen); // Toggling the menu state
  };

  return (
    <nav className='pl-7 pr-7'>
      <div className="max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto">
        <Link to="/dashboard" className="inline-block">
          <img src={Logo} className='logo' alt="ProdigiDesk Logo" />
        </Link>
        <button
          onClick={handleMenuToggle}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
        
        <div className={`w-full md:block md:w-auto ${isMenuOpen ? '' : 'hidden'}`} id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-5">
            <li>
              <Link to="/dashboard" className="flex items-center py-2 px-3 text-black rounded md:bg-transparent md:p-0 dark:text-black md:hover:text-blue-700">
                <FaHome className="mr-2" aria-hidden="true" /> {/* Home Icon */}
                <span className="hidden md:inline">Home</span>
              </Link>
            </li>
            <li>
              <Link to="/profile" className="flex items-center py-2 px-3 text-black rounded md:bg-transparent md:p-0 dark:text-black md:hover:text-blue-700">
                <FaUser className="mr-2" aria-hidden="true" /> {/* User Icon */}
                <span className="hidden md:inline">{userFirstName ? userFirstName : user?.email}</span>
              </Link>
            </li>
            <li>
              <button onClick={logout} className="flex items-center py-2 px-3 text-black rounded md:bg-transparent md:p-0 dark:text-black md:hover:text-blue-700">
                <FaSignOutAlt className="mr-2" aria-hidden="true" /> {/* Logout Icon */}
                <span className="hidden md:inline">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
