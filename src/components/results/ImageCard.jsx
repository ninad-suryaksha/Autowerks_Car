import React from 'react';
import DownloadButton from './DownloadButton';

/**
 * Individual image card with comparison view and download
 */
const ImageCard = ({ image, index, original }) => {
    return (
        <div className="card overflow-hidden fade-in">
            <div className="aspect-video relative overflow-hidden bg-surface">
                <img
                    src={`data:image/jpeg;base64,${image}`}
                    alt={`Generated car view ${index + 1}`}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-4 flex items-center justify-between">
                <span className="text-sm text-text-secondary">
                    View {index + 1}
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
