import React from 'react';
import DownloadButton from './DownloadButton';

/**
 * Individual image card with comparison view and download
 */
const ImageCard = ({ image, index, label, original }) => {
    return (
        <div className="card overflow-hidden fade-in bg-white shadow-lg border border-gray-100/50">
            <div className="aspect-video relative overflow-hidden bg-surface group">
                <img
                    src={`data:image/jpeg;base64,${image}`}
                    alt={`${label} of Generated Car`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide uppercase shadow-sm">
                    {label}
                </div>
            </div>
            <div className="p-4 flex items-center justify-between">
                <span className="text-sm font-medium text-text-secondary capitalize">
                    {label.toLowerCase()}
                </span>
                <DownloadButton
                    data={image}
                    filename={`autowerks-car-${index + 1}.jpg`}
                    label="Save"
                />
            </div>
        </div>
    );
};

export default ImageCard;
