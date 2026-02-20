import React from 'react';
import ImageCard from './ImageCard';

/**
 * Grid gallery of generated images
 */
const ImageGallery = ({ images, originalImages }) => {
    if (!images || images.length === 0) return null;

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">
                Generated Images
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image, index) => (
                    <ImageCard
                        key={index}
                        image={image}
                        index={index}
                        original={originalImages?.[index]}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageGallery;
