import { FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-transparent mt-auto">
      <div className="w-full mx-auto max-w-screen-2xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm text-gray-500 sm:text-center dark:text-black flex items-center">         
           <a href="/dashboard" className="hover:underline"> Esprit Analytique &nbsp;</a>
            | &nbsp; <a href="mailto:contact@espritanalytique.com" className="hover:underline">Contact Us</a> &nbsp;|&nbsp; <a
            href="https://www.linkedin.com/company/esprit-analytique/mycompany/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-center"
          ><FaLinkedin className="mr-2" /></a> 
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <span className="me-4 md:me-6 dark:text-black">
              Copyright © 2024 Esprit Analytique - &nbsp;
              <a href="/privacypage" className="hover:underline">Privacy</a> | <a href="/termscondition" className="hover:underline">Terms</a> | Support
            </span>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
