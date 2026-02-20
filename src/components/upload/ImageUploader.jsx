import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import ImagePreview from './ImagePreview';
import { validateFile, validateFileCount } from '../../services/utils/fileValidator';
import { MAX_IMAGES } from '../../config/constants';

/**
 * Main image upload component with drag-and-drop support
 */
const ImageUploader = ({ images, onImagesChange }) => {
    const [errors, setErrors] = useState([]);

    const onDrop = useCallback(
        (acceptedFiles) => {
            setErrors([]);

            const countResult = validateFileCount(images.length, acceptedFiles.length);
            if (!countResult.isValid) {
                setErrors([countResult.error]);
                return;
            }

            const validFiles = [];
            const fileErrors = [];

            acceptedFiles.forEach((file) => {
                const result = validateFile(file);
                if (result.isValid) {
                    validFiles.push({
                        file,
                        preview: URL.createObjectURL(file),
                        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                    });
                } else {
                    fileErrors.push(...result.errors);
                }
            });

            if (fileErrors.length > 0) {
                setErrors(fileErrors);
            }

            if (validFiles.length > 0) {
                onImagesChange([...images, ...validFiles]);
            }
        },
        [images, onImagesChange]
    );

    const removeImage = useCallback(
        (id) => {
            const updated = images.filter((img) => img.id !== id);
            // Revoke object URL for removed image to avoid memory leaks
            const removed = images.find((img) => img.id === id);
            if (removed?.preview) URL.revokeObjectURL(removed.preview);
            onImagesChange(updated);
        },
        [images, onImagesChange]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/webp': ['.webp'],
        },
        multiple: true,
        maxFiles: MAX_IMAGES - images.length,
    });

    return (
        <div className="space-y-6">
            {/* Drop Zone */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-12 md:p-16 text-center 
                   cursor-pointer transition-all duration-200
                   ${isDragActive
                        ? 'border-primary bg-primary/5 scale-[1.01]'
                        : 'border-gray-200 hover:border-primary/40 hover:bg-surface'
                    }`}
            >
                <input {...getInputProps()} />
                <div className="space-y-3">
                    <div className="text-5xl">
                        {isDragActive ? '📥' : '📷'}
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-text-primary">
                            {isDragActive ? 'Drop images here' : 'Drag & drop car images'}
                        </p>
                        <p className="text-text-secondary mt-1">
                            or click to browse files
                        </p>
                    </div>
                    <p className="text-xs text-text-secondary">
                        JPG, PNG, or WEBP • Up to {MAX_IMAGES} images • 10 MB per file
                    </p>
                </div>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-1">
                    {errors.map((err, i) => (
                        <p key={i} className="text-error text-sm">
                            ⚠️ {err}
                        </p>
                    ))}
                </div>
            )}

            {/* Previews */}
            {images.length > 0 && (
                <div>
                    <p className="text-sm font-medium text-text-secondary mb-3">
                        Uploaded ({images.length}/{MAX_IMAGES})
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {images.map((image) => (
                            <ImagePreview
                                key={image.id}
                                image={image}
                                onRemove={() => removeImage(image.id)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
