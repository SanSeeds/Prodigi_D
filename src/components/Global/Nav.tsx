import { useState } from 'react';
import Logo from '../../assets/img2.png';
import '../../styles/Nav.css';
import { FaSignInAlt, FaInfoCircle, FaLanguage } from 'react-icons/fa'; // Import icons from react-icons

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setIsMenuOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <nav className='pl-7 pr-7'>
        <div className="max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto">
          <a href="/">
            <img src={Logo} className="logo" alt="ProdigiDesk Logo" />
          </a>
          <button
            onClick={toggleMenu}
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
            <ul className="font-medium flex flex-col p-4 md:p-0 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-5">
              <li>
                <a href="/signin" className="flex items-center py-2 px-3 text-black rounded md:bg-transparent md:p-0 dark:text-black md:hover:text-blue-700" aria-current="page" id='nav-text'>
                  <FaSignInAlt className="mr-2" aria-hidden="true" />
                  <span className="md:inline hidden">Sign In</span>
                </a>
              </li>
              <li>
                <button id="about-btn" onClick={openModal} className="flex items-center py-2 px-3 text-black rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-black md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-black md:dark:hover:bg-transparent">
                  <FaInfoCircle className="mr-2" aria-hidden="true" />
                  <span className="md:inline hidden">About</span>
                </button>
              </li>
              <li>
                <a href="/translate" id='nav-text' className="flex items-center py-2 px-3 text-black rounded md:bg-transparent md:p-0 dark:text-black md:hover:text-blue-700" aria-current="page">
                  <FaLanguage className="mr-2" aria-hidden="true" />
                  <span className="md:inline hidden">Translate</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded-md shadow-lg max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">About ProdigiDesk</h2>
            <p className="mb-4">
              ProdigiDesk is a versatile tool designed to streamline office operations and enhance productivity through automation. It uses Generative AI to build applications such as E-Mail generator, Document summarizer, Offer Letter generator, Sales script generator, content generator - aids in crafting of engaging blog posts and email newsletters, and Business proposal generator to create impressive business proposals.
            </p>
            <p className="mb-4">
              This tool will benefit micro-, small-, and medium-sized enterprises as it enhances their productivity and eliminates the language barriers toward winning new business, so the companies can unlock greater opportunities.
            </p>
            <p className="mb-4">
              It ensures that the product is in compliance with data security laws; we don't store any information fed into the tool while using it. We don't use your private data for model training.
            </p>
            <button onClick={closeModal} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Nav;
