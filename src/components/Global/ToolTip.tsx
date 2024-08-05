import React, { useState } from 'react';
import { FiInfo } from 'react-icons/fi';

const TooltipIcon: React.FC = () => {
    const [visible, setVisible] = useState(false);

    const handleMouseEnter = () => {
        setVisible(true);
    };

    const handleMouseLeave = () => {
        setVisible(false);
    };

    return (
        <div className="relative inline-block"> 
            <FiInfo
                className="text-gray-700 dark:text-gray-300"
                size={18}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
            {visible && (
                <div
                    id="tooltip-default"
                    role="tooltip"
                    className="absolute z-10 inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-100 tooltip dark:bg-gray-700"
                    style={{ bottom: '100%', left: '50%', transform: 'translateX(-50%)', width: '250px' }}
                >
                    <p>Password should have at least one uppercase letter, one lowercase letter, one special character, and be at least 8 characters long.</p>
                    <div className="tooltip-arrow" data-popper-arrow />
                </div>
            )}
        </div>
    );
};

export default TooltipIcon;
