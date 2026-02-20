import React, { useState, useRef } from 'react';
import { Plus, ArrowUp, X, UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore';

const Home = () => {
    const [selectedImages, setSelectedImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const setUploadedImages = useAppStore((state) => state.setUploadedImages);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files || e.dataTransfer.files);
        if (files.length > 0) {
            // Combine with existing images and limit to 5
            const combinedFiles = [...selectedImages.map(img => img.file), ...files].slice(0, 5);

            const newImages = combinedFiles.map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }));

            setSelectedImages(newImages);
        }

        // Reset so same file can be selected again if removed
        if (e.target && e.target.value) {
            e.target.value = '';
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            const combinedFiles = [...selectedImages.map(img => img.file), ...files].slice(0, 5);
            const newImages = combinedFiles.map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }));
            setSelectedImages(newImages);
        }
    };

    const handleRemoveImage = (index) => {
        const newImages = [...selectedImages];
        URL.revokeObjectURL(newImages[index].preview);
        newImages.splice(index, 1);
        setSelectedImages(newImages);
    };

    const handleNextStep = () => {
        if (selectedImages.length > 0) {
            const imagesToStore = selectedImages.map((img, index) => ({
                id: `img-${Date.now()}-${index}`,
                file: img.file,
                preview: img.preview
            }));
            setUploadedImages(imagesToStore);
            navigate('/customize');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[75vh] relative fade-in px-4">
            <div className="w-full max-w-4xl flex flex-col mt-[-5vh]">
                {/* Header Area */}
                <div className="mb-6 self-start pl-2">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                        Upload Car Images
                    </h1>
                    <p className="text-gray-500 text-[15px]">
                        Upload 1–5 images of your car from different angles for the best results.
                    </p>
                </div>

                {/* Upload Area */}
                <div
                    className={`w-full border-[1.5px] border-dashed ${isDragging ? 'border-gray-400 bg-gray-50/80' : 'border-gray-200 hover:border-gray-300'} rounded-2xl py-24 px-8 flex flex-col items-center justify-center transition-all cursor-pointer`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/jpeg, image/png, image/webp"
                        multiple
                        onChange={handleFileUpload}
                    />

                    {selectedImages.length === 0 ? (
                        <>
                            <div className="text-[44px] mb-3 select-none leading-none">
                                📷
                            </div>
                            <h3 className="text-[17px] font-semibold text-gray-900 mb-1.5">Drag & drop car images</h3>
                            <p className="text-gray-400 text-[15px] mb-6">or click to browse files</p>
                            <p className="text-[13px] text-gray-400 font-medium">JPG, PNG, or WEBP • Up to 5 images • 10 MB per file</p>
                        </>
                    ) : (
                        <div className="w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                            <div className="flex flex-wrap gap-5 justify-center mb-10 w-full max-w-3xl">
                                {selectedImages.map((img, index) => (
                                    <div key={index} className="relative group">
                                        <div className="h-32 w-48 rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center">
                                            <img
                                                src={img.preview}
                                                alt={`Preview ${index}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveImage(index);
                                            }}
                                            className="absolute -top-2.5 -right-2.5 bg-white text-gray-400 border border-gray-100 rounded-full p-1.5 hover:bg-black hover:text-white transition-colors shadow-sm z-10"
                                            title="Remove image"
                                        >
                                            <X size={14} strokeWidth={3} />
                                        </button>
                                    </div>
                                ))}
                                {selectedImages.length < 5 && (
                                    <div
                                        className="h-32 w-48 rounded-xl border-[1.5px] border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-400 transition-all cursor-pointer bg-white"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            fileInputRef.current?.click();
                                        }}
                                    >
                                        <UploadCloud size={24} className="mb-2" />
                                        <span className="text-[13px] font-medium">Add more</span>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleNextStep}
                                className="px-8 py-3.5 bg-black text-white rounded-full text-[15px] font-medium hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg flex items-center justify-center min-w-[200px]"
                            >
                                Continue
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom pill indicator (UI polish) */}
            <div className="fixed bottom-1 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-gray-300 rounded-full opacity-50"></div>
        </div>
    );
};

export default Home;
