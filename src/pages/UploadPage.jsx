import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/layout/Container';
import ImageUploader from '../components/upload/ImageUploader';
import Button from '../components/common/Button';
import useAppStore from '../store/useAppStore';

const UploadPage = () => {
    const navigate = useNavigate();
    const images = useAppStore((s) => s.uploadedImages);
    const setImages = useAppStore((s) => s.setUploadedImages);
    const setCurrentStep = useAppStore((s) => s.setCurrentStep);

    useEffect(() => {
        setCurrentStep(1);
    }, [setCurrentStep]);

    const handleNext = () => {
        if (images.length > 0) {
            navigate('/customize');
        }
    };

    return (
        <Container>
            <div className="max-w-4xl mx-auto fade-in">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-text-primary mb-2">
                        Upload Car Images
                    </h2>
                    <p className="text-text-secondary">
                        Upload 1–5 images of your car from different angles for the best results.
                    </p>
                </div>

                <ImageUploader images={images} onImagesChange={setImages} />

                {images.length > 0 && (
                    <div className="mt-8 flex justify-end fade-in">
                        <Button onClick={handleNext}>
                            Next: Choose Color & Finish →
                        </Button>
                    </div>
                )}
            </div>
        </Container>
    );
};

export default UploadPage;
