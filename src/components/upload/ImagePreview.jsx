import React from 'react';

/**
 * Thumbnail preview card with hover-to-reveal remove button
 */
const ImagePreview = ({ image, onRemove }) => {
    return (
        <div className="relative group rounded-xl overflow-hidden bg-surface aspect-[4/3]">
            <img
                src={image.preview}
                alt="Car preview"
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            <button
                onClick={onRemove}
                className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-text-primary 
                   rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold
                   opacity-0 group-hover:opacity-100 transition-all duration-200
                   hover:bg-error hover:text-white shadow-sm"
                aria-label="Remove image"
            >
                ×
            </button>
        </div>
    );
};

export default ImagePreview;
