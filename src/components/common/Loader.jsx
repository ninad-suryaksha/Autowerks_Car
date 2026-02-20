import React from 'react';

/**
 * Loading spinner with size variants and optional text
 */
const Loader = ({ size = 'md', text = 'Loading...' }) => {
    const sizes = {
        sm: 'w-6 h-6 border-2',
        md: 'w-10 h-10 border-3',
        lg: 'w-16 h-16 border-4',
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div
                className={`${sizes[size]} border-primary border-t-transparent rounded-full spinner`}
            />
            {text && <p className="text-text-secondary text-sm">{text}</p>}
        </div>
    );
};

export default Loader;
