import { useState } from 'react';
import Nav from '../components/Global/Nav';


const WelcomePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Nav/>
            <div className={` max-h-screen flex flex-col items-center justify-start ${isModalOpen ? 'blur-sm' : ''}`}>
                <h1 className="text-center text-4xl m-8">Welcome To ProdigiDesk</h1>
                <h1 className="text-3xl font-bold mb-4 text-center">Revolutionize Your Workflow with ProdigiDesk</h1>
                <h2 className="text-xl font-semibold mb-6 mt-4 text-center">Unlock opportunities Like Never Before!</h2>
                <ul className="list-disc list-inside space-y-2 text-left mb-6">
                    <li>Mail Generator for crafting precise email correspondence</li>
                    <li>Summarization tool that condenses uploaded documents</li>
                    <li>Offer Letter Generator to simplify HR processes</li>
                    <li>Sales Script Generator that tailors pitches based on customer segments, industries, and products</li>
                    <li>Supports content creation, aiding in the crafting of engaging blog posts and email newsletters</li>
                    <li>Business proposal generator to create impressive business proposals</li>
                </ul>
                <div className="flex space-x-4 mb-7">
                    <button onClick={openModal} className="px-4 py-2 bg-blue-500 text-white rounded-md">About</button>
                    <a href="/signin"> <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Sign In</button></a>
                    <a href="/translate"> <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Translate</button></a>
                </div>
            </div>

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
};

export default WelcomePage;
