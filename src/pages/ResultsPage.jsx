import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/layout/Container';
import ImageGallery from '../components/results/ImageGallery';
import VideoPlayer from '../components/results/VideoPlayer';
import Loader from '../components/common/Loader';
import ProgressBar from '../components/common/ProgressBar';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';
import useAppStore from '../store/useAppStore';
import { processImageForApi } from '../services/utils/imageProcessor';
import { buildImagePrompt, buildVideoPrompt } from '../services/prompts/promptBuilder';
import { generateImages } from '../services/api/nanoBananaService';
import { initiateVideoGeneration, pollVideoStatus } from '../services/api/veoService';
import { classifyError } from '../services/utils/errorHandler';
// Import the simulated progress hook - relative path from pages/ to hooks/
import { useSimulatedProgress } from '../hooks/useSimulatedProgress';

const ResultsPage = () => {
    const navigate = useNavigate();
    const uploadedImages = useAppStore((s) => s.uploadedImages);
    const selectedColor = useAppStore((s) => s.selectedColor);
    const selectedFinish = useAppStore((s) => s.selectedFinish);
    const generatedImages = useAppStore((s) => s.generatedImages);
    const generatedVideo = useAppStore((s) => s.generatedVideo);
    const setGeneratedImages = useAppStore((s) => s.setGeneratedImages);
    const setGeneratedVideo = useAppStore((s) => s.setGeneratedVideo);
    const isGeneratingImages = useAppStore((s) => s.isGeneratingImages);
    const isGeneratingVideo = useAppStore((s) => s.isGeneratingVideo);
    const setImageGenerating = useAppStore((s) => s.setImageGenerating);
    const setVideoGenerating = useAppStore((s) => s.setVideoGenerating);
    const imageProgress = useAppStore((s) => s.imageProgress);
    const videoProgress = useAppStore((s) => s.videoProgress);
    const setImageProgress = useAppStore((s) => s.setImageProgress);
    const setVideoProgress = useAppStore((s) => s.setVideoProgress);
    const error = useAppStore((s) => s.error);
    const setError = useAppStore((s) => s.setError);
    const clearError = useAppStore((s) => s.clearError);
    const setCurrentStep = useAppStore((s) => s.setCurrentStep);
    const resetAll = useAppStore((s) => s.resetAll);

    const [hasStarted, setHasStarted] = useState(false);

    // Simulated progress hooks
    const simulatedImageProgress = useSimulatedProgress(isGeneratingImages, 30);
    const simulatedVideoProgress = useSimulatedProgress(isGeneratingVideo, 30);

    useEffect(() => {
        setCurrentStep(3);
        if (!selectedColor || uploadedImages.length === 0) {
            navigate('/upload');
        }
    }, [setCurrentStep, selectedColor, uploadedImages, navigate]);

    // Auto-start generation on mount
    const startGeneration = useCallback(async () => {
        if (hasStarted || generatedImages.length > 0) return;
        setHasStarted(true);
        clearError();
        setImageGenerating(true);
        setImageProgress(0);

        try {
            // Process images to base64
            const processed = await Promise.all(
                uploadedImages.map((img) => processImageForApi(img.file))
            );

            // Build prompt
            const prompt = buildImagePrompt(selectedColor, selectedFinish);

            // Generate images
            const results = await generateImages(processed, prompt, setImageProgress);
            setGeneratedImages(results);
        } catch (err) {
            const classified = classifyError(err);
            setError(classified.message);
        } finally {
            setImageGenerating(false);
        }
    }, [
        hasStarted,
        generatedImages.length,
        uploadedImages,
        selectedColor,
        selectedFinish,
        clearError,
        setImageGenerating,
        setImageProgress,
        setGeneratedImages,
        setError,
    ]);

    useEffect(() => {
        if (selectedColor && selectedFinish && uploadedImages.length > 0) {
            startGeneration();
        }
    }, [startGeneration, selectedColor, selectedFinish, uploadedImages]);

    const handleGenerateVideo = async () => {
        clearError();
        setVideoGenerating(true);
        setVideoProgress(0);

        try {
            const prompt = buildVideoPrompt(selectedColor, selectedFinish);
            const operationId = await initiateVideoGeneration(generatedImages, prompt);
            const videoUrl = await pollVideoStatus(operationId, setVideoProgress);
            setGeneratedVideo(videoUrl);
        } catch (err) {
            const classified = classifyError(err);
            setError(classified.message);
        } finally {
            setVideoGenerating(false);
        }
    };

    const handleStartOver = () => {
        resetAll();
        navigate('/');
    };

    if (!selectedColor) return null;

    return (
        <Container>
            <div className="max-w-5xl mx-auto fade-in">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-text-primary mb-2">
                        Your Customized Car
                    </h2>
                    <div className="flex items-center gap-3">
                        <div
                            className="w-6 h-6 rounded-md border border-gray-200"
                            style={{ backgroundColor: selectedColor.colorHex }}
                        />
                        <p className="text-text-secondary">
                            {selectedColor.colorName} {selectedFinish ? `• ${selectedFinish} finish` : ''}
                        </p>
                    </div>
                </div>

                {/* Error */}
                {error && <ErrorMessage message={error} onDismiss={clearError} />}

                {/* Image Generation */}
                {isGeneratingImages && (
                    <div className="card p-8 mb-6">
                        <div className="text-center mb-6">
                            <Loader text="Generating your customized images..." />
                        </div>
                        <ProgressBar
                            progress={simulatedImageProgress}
                            label="Generating images"
                        />
                        <p className="text-xs text-text-secondary text-center mt-4">
                            This may take 30–90 seconds per image
                        </p>
                    </div>
                )}

                {/* Generated Images */}
                {generatedImages.length > 0 && (
                    <div className="space-y-6">
                        <ImageGallery
                            images={generatedImages}
                            originalImages={uploadedImages}
                        />

                        {/* Video Generation */}
                        {!generatedVideo && !isGeneratingVideo && (
                            <div className="card p-6 text-center">
                                <h3 className="text-lg font-semibold text-text-primary mb-2">
                                    Want a 360° Showcase Video?
                                </h3>
                                <p className="text-text-secondary text-sm mb-4">
                                    Generate an 8-second turntable video of your customized car
                                </p>
                                <Button onClick={handleGenerateVideo}>
                                    Generate 360° Video 🎬
                                </Button>
                            </div>
                        )}

                        {isGeneratingVideo && (
                            <div className="card p-8">
                                <div className="text-center mb-6">
                                    <Loader text="Generating 360° video..." />
                                </div>
                                <ProgressBar
                                    progress={simulatedVideoProgress}
                                    label="Generating video"
                                />
                                <p className="text-xs text-text-secondary text-center mt-4">
                                    This may take 2–5 minutes
                                </p>
                            </div>
                        )}

                        {generatedVideo && <VideoPlayer videoUrl={generatedVideo} />}
                    </div>
                )}

                {/* Actions */}
                {(generatedImages.length > 0 || error) && (
                    <div className="mt-8 flex items-center justify-between">
                        <Button variant="secondary" onClick={() => navigate('/customize')}>
                            ← Change Color
                        </Button>
                        <Button variant="secondary" onClick={handleStartOver}>
                            Start Over
                        </Button>
                    </div>
                )}
            </div>
        </Container>
    );
};

export default ResultsPage;
