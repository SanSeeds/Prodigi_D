function Footer(){
    return(
        <footer className="bg-transparent mt-auto">
            <div className="w-full mx-auto max-w-screen-2xl p-4 md:flex md:items-center md:justify-between">
            <span className="text-sm text-gray-500 sm:text-center dark:text-black "> <a href="https://www.linkedin.com/company/esprit-analytique/mycompany/" target="_blank" className="hover:underline">Esprit Analytique</a> | <a href="mailto:contact@espritanalytique.com" className="hover:underline">Contact Us</a></span>
            <ul className="flex flex-wrap items-center mt-3 text-sm text-gray-500  dark:text-gray-400 sm:mt-0">
                <li>
                    <span className="me-4 md:me-6 dark:text-black">Copyright © 2024 EspritAnalytique - <a href="/"> Privacy </a>| Terms | Support </span>
                </li>
            </ul>
            </div>
        </footer>

    )
}

export default Footer