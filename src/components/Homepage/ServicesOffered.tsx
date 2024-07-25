import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Services.css';

interface ServiceProps {
    link: string;
    title: string;
    description: string;
}

const ServicesOffered: React.FC<ServiceProps> = ({ link, title, description }) => {
    return (
        <div className='pl-5 pr-5'>
            <Link to={link} className="cards mt-8 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:border-gray-700">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-black dark:text-black">{title}</h5>
                <p className="font-normal text-black dark:text-black">{description}</p>
            </Link>
        </div>
    );
};

const Services: React.FC = () => {
    const services = [
        {
            title: 'Email',
            description: 'Create and manage your email content.',
            link: '/email'
        },
        {
            title: 'Business Proposal',
            description: 'Generate business proposals.',
            link: '/businessproposal'
        },
        {
            title: 'Offer Letter',
            description: 'Create offer letters for new hires.',
            link: '/offerletter'
        },
        {
            title: 'Sales Script',
            description: 'Generate sales scripts for your products.',
            link: '/sales'
        },
        {
            title: 'Summarize',
            description: 'Summarize documents quickly.',
            link: '/summarize'
        },
        {
            title: 'Content Generation',
            description: 'Create engaging content for your audience.',
            link: '/contentgeneration'
        },
        {
            title: 'PPT Generator',
            description: 'Create engaging PPT for your audience.',
            link: '/pptGeneration'
        },

    ];

    return (
        <div className="flex justify-center">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((service, index) => (
                    <ServicesOffered
                        key={index}
                        title={service.title}
                        description={service.description}
                        link={service.link}
                    />
                ))}
            </div>
        </div>
    );
};

export default Services;
