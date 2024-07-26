import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Services.css';

const EmailService: React.FC = () => (
    <div className='pl-5 pr-5'>
        <Link to="/email" className="cards mt-8 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:border-gray-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-black dark:text-black">Email</h5>
            <p className="font-normal text-black dark:text-black">Create and manage your email content.</p>
        </Link>
    </div>
);

const BusinessProposalService: React.FC = () => (
    <div className='pl-5 pr-5'>
        <Link to="/businessproposal" className="cards mt-8 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:border-gray-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-black dark:text-black">Business Proposal</h5>
            <p className="font-normal text-black dark:text-black">Generate business proposals.</p>
        </Link>
    </div>
);

const OfferLetterService: React.FC = () => (
    <div className='pl-5 pr-5'>
        <Link to="/offerletter" className="cards mt-8 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:border-gray-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-black dark:text-black">Offer Letter</h5>
            <p className="font-normal text-black dark:text-black">Create offer letters for new hires.</p>
        </Link>
    </div>
);

const SalesScriptService: React.FC = () => (
    <div className='pl-5 pr-5'>
        <Link to="/sales" className="cards mt-8 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:border-gray-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-black dark:text-black">Sales Script</h5>
            <p className="font-normal text-black dark:text-black">Generate sales scripts for your products.</p>
        </Link>
    </div>
);

const SummarizeService: React.FC = () => (
    <div className='pl-5 pr-5'>
        <Link to="/summarize" className="cards mt-8 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:border-gray-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-black dark:text-black">Summarize</h5>
            <p className="font-normal text-black dark:text-black">Summarize documents quickly.</p>
        </Link>
    </div>
);

const ContentGenerationService: React.FC = () => (
    <div className='pl-5 pr-5'>
        <Link to="/contentgeneration" className="cards mt-8 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:border-gray-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-black dark:text-black">Content Generation</h5>
            <p className="font-normal text-black dark:text-black">Create engaging content for your audience.</p>
        </Link>
    </div>
);

const PPTGeneratorService: React.FC = () => (
    <div className='pl-5 pr-5'>
        <Link to="/pptGeneration" className="cards mt-8 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:border-gray-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-black dark:text-black">PPT Generator</h5>
            <p className="font-normal text-black dark:text-black">Create engaging PPT for your audience.</p>
        </Link>
    </div>
);

const Services: React.FC = () => {
    return (
        <div className="flex justify-center">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <EmailService />
                <BusinessProposalService />
                <SalesScriptService />
                <OfferLetterService />
                <SummarizeService />
                <ContentGenerationService />
                {/* Adding empty divs to center PPTGeneratorService in the third row */}
                <div></div>
                <PPTGeneratorService />
                <div></div>
            </div>
        </div>
    );
};

export default Services;
