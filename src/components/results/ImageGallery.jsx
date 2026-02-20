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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {images.map((image, index) => {
                    const viewLabels = ['Front View', 'Left Profile', 'Right Profile', 'Rear View'];
                    const viewLabel = viewLabels[index] || `View ${index + 1}`;
                    return (
                        <ImageCard
                            key={index}
                            image={image}
                            index={index}
                            label={viewLabel}
                            original={originalImages?.[index]}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default ImageGallery;
