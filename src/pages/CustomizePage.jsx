import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import Container from '../components/layout/Container';
import CustomizationPanel from '../components/customization/CustomizationPanel';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';
import useAppStore from '../store/useAppStore';

const CustomizePage = () => {
    const navigate = useNavigate();
    const uploadedImages = useAppStore((s) => s.uploadedImages);
    const selectedColor = useAppStore((s) => s.selectedColor);
    const selectedFinish = useAppStore((s) => s.selectedFinish);
    const setSelectedColor = useAppStore((s) => s.setSelectedColor);
    const setSelectedFinish = useAppStore((s) => s.setSelectedFinish);
    const setCurrentStep = useAppStore((s) => s.setCurrentStep);
    const removeUploadedImage = useAppStore((s) => s.removeUploadedImage);

    useEffect(() => {
        setCurrentStep(2);
        // Redirect if no images uploaded
        if (uploadedImages.length === 0) {
            navigate('/upload');
        }
    }, [setCurrentStep, uploadedImages.length, navigate]);

    const canProceed = !!selectedColor;

    const handleGenerate = () => {
        if (canProceed) {
            navigate('/results');
        }
    };

    if (uploadedImages.length === 0) return null;

    return (
        <Container>
            <div className="max-w-4xl mx-auto fade-in">
                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-text-primary mb-1">
                        Customize Color & Finish
                    </h2>
                    <p className="text-text-secondary">
                        Select your desired color and finish type for the {uploadedImages.length} uploaded
                        image{uploadedImages.length > 1 ? 's' : ''}.
                    </p>
                </div>

                {/* Uploaded images mini preview */}
                <div className="flex gap-3 mb-6 overflow-x-auto pb-2 pt-2 px-1">
                    {uploadedImages.map((img) => (
                        <div key={img.id} className="relative group shrink-0">
                            <img
                                src={img.preview}
                                alt="Car"
                                className="w-24 h-24 object-cover rounded-2xl border border-gray-200 shadow-sm group-hover:shadow-md transition-all"
                            />
                            <button
                                onClick={() => removeUploadedImage(img.id)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600 focus:opacity-100"
                                aria-label="Remove image"
                                title="Remove image"
                                type="button"
                            >
                                <X size={14} strokeWidth={3} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Selection Summary */}
                <div className="mb-6 flex flex-wrap items-center gap-6 p-4 bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] fade-in">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-xl shadow-inner">
                            🖼️
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Selected Config</p>
                            <h3 className="text-lg font-bold text-gray-900 leading-tight">Your Custom Build</h3>
                        </div>
                    </div>

                    <div className="h-10 w-px bg-gray-100 hidden md:block" />

                    <div className="flex items-center gap-3">
                        <div
                            className={`w-10 h-10 rounded-full border-2 border-white shadow-md transition-all duration-500  ${selectedColor ? 'scale-110' : 'bg-gray-100 scale-100 opacity-50'}`}
                            style={{ backgroundColor: selectedColor?.colorHex || '#f3f4f6' }}
                        />
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Color</p>
                            <p className={`font-semibold text-sm ${selectedColor ? 'text-gray-900' : 'text-gray-300'}`}>
                                {selectedColor ? selectedColor.colorName : 'None Selected'}
                            </p>
                        </div>
                    </div>

                    <div className="h-10 w-px bg-gray-100 hidden md:block" />

                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${selectedFinish ? 'bg-blue-50 text-blue-600 scale-110 shadow-sm' : 'bg-gray-100 text-gray-300 scale-100 opacity-50'}`}>
                            {selectedFinish ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <span className="text-lg">✨</span>
                            )}
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Finish</p>
                            <p className={`font-semibold text-sm capitalize ${selectedFinish ? 'text-gray-900' : 'text-gray-300'}`}>
                                {selectedFinish ? `${selectedFinish} Finish` : 'None Selected'}
                            </p>
                        </div>
                    </div>
                </div>

                <CustomizationPanel
                    selectedColor={selectedColor}
                    selectedFinish={selectedFinish}
                    onColorChange={setSelectedColor}
                    onFinishChange={setSelectedFinish}
                />

                <div className="mt-6 flex items-center justify-between">
                    <Button variant="secondary" onClick={() => navigate('/upload')}>
                        ← Back
                    </Button>
                    <Button onClick={handleGenerate} disabled={!canProceed}>
                        Generate Images ✨
                    </Button>
                </div>
            </div>
        </Container>
    );
};

export default CustomizePage;
