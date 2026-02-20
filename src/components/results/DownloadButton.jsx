import React from 'react';

/**
 * Download button that converts base64 to downloadable file
 */
const DownloadButton = ({ data, filename, label = 'Download' }) => {
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = `data:image/jpeg;base64,${data}`;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button
            onClick={handleDownload}
            className="text-primary text-sm font-medium hover:text-primary/70 
                 transition-colors inline-flex items-center gap-1"
        >
            ↓ {label}
        </button>
    );
};

export default DownloadButton;
