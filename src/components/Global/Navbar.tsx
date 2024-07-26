import { AuthContext } from './AuthContext'; // Importing AuthContext from the AuthContext file
import Logo from '../../assets/logo.png'; // Importing the logo image
import '../../App.css'; // Importing global CSS file
import { useContext, useState } from 'react'; // Importing useContext and useState hooks from React
import { Link } from 'react-router-dom'; // Import Link component from react-router-dom for navigation

const Navbar = () => {
  const authContext = useContext(AuthContext); // Using useContext to get the authContext value

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider"); // Throwing an error if AuthContext is not provided
  }

  const { user, logout } = authContext; // Destructuring user and logout from authContext

  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for managing menu toggle

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen); // Toggling the menu state
  };

  return (
    <nav className='pl-7 pr-7'>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/dashboard" className="inline-block">
          <img src={Logo} style={{height: '55px', width: '80px'}} alt="ProdigiDesk Logo" />
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
              <Link to="/dashboard" className="block py-2 px-3 text-black rounded md:bg-transparent md:p-0 dark:text-black md:hover:text-blue-700" aria-current="page">Home</Link>
            </li>
            <li>
              <Link to="/profile" className="block py-2 px-3 text-black rounded md:bg-transparent md:p-0 dark:text-black md:hover:text-blue-700" aria-current="page">{user ? user.email : 'Profile'}</Link>
            </li>
            <li>
              <button onClick={logout} className="block py-2 px-3 text-black rounded md:bg-transparent md:p-0 dark:text-black md:hover:text-blue-700">Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
