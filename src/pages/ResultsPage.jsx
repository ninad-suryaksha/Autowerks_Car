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
import { buildFourImagePrompts, buildVideoPrompt } from '../services/prompts/promptBuilder';
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
    const [activeTab, setActiveTab] = useState('images'); // 'images' or 'video'

    // Simulated progress hooks
    const simulatedImageProgress = useSimulatedProgress(isGeneratingImages, 30);
    const simulatedVideoProgress = useSimulatedProgress(isGeneratingVideo, 30);

    useEffect(() => {
        setCurrentStep(3);
        if (!selectedColor || uploadedImages.length === 0) {
            navigate('/upload');
        }
    }, [setCurrentStep, selectedColor, uploadedImages, navigate]);

    // Handle switching to video and starting generation
    const switchToVideoAndGenerate = async () => {
        setActiveTab('video');
        if (!generatedVideo && !isGeneratingVideo) {
            handleGenerateVideo();
        }
    };

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

            // Build prompts for 4 views
            const prompts = buildFourImagePrompts(selectedColor, selectedFinish);

            // Generate images
            const results = await generateImages(processed, prompts, setImageProgress);
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
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 mt-4">
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary mb-2">
                            Your Customized Car
                        </h2>
                        <div className="flex items-center gap-3">
                            <div
                                className="w-6 h-6 rounded-md border border-gray-200"
                                style={{ backgroundColor: selectedColor.colorHex }}
                            />
                            <p className="text-text-secondary font-medium">
                                {selectedColor.colorName} {selectedFinish ? `• ${selectedFinish} finish` : ''}
                            </p>
                        </div>
                    </div>

                    {/* Tab Switcher */}
                    {generatedImages.length > 0 && (
                        <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
                            <button
                                onClick={() => setActiveTab('images')}
                                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'images'
                                    ? 'bg-white text-primary shadow-sm'
                                    : 'text-text-secondary hover:text-text-primary'
                                    }`}
                            >
                                Generated Images
                            </button>
                            <button
                                onClick={() => setActiveTab('video')}
                                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'video'
                                    ? 'bg-white text-primary shadow-sm'
                                    : 'text-text-secondary hover:text-text-primary'
                                    }`}
                            >
                                360° Video
                            </button>
                        </div>
                    )}
                </div>

                {/* Error */}
                {error && <ErrorMessage message={error} onDismiss={clearError} />}

                {/* Main Content Area */}
                <div className="min-h-[400px]">
                    {/* Image Generation Loading */}
                    {isGeneratingImages && activeTab === 'images' && (
                        <div className="card p-12 mb-6 flex flex-col items-center justify-center">
                            <div className="text-center mb-8">
                                <Loader text="Generating your customized images..." />
                            </div>
                            <div className="w-full max-w-md">
                                <ProgressBar
                                    progress={simulatedImageProgress}
                                    label="Generating images"
                                />
                                <p className="text-xs text-text-secondary text-center mt-4">
                                    Crafting high-quality renders using ShopOS Pro...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Generated Images View */}
                    {generatedImages.length > 0 && activeTab === 'images' && (
                        <div className="space-y-8 fade-in">
                            <ImageGallery
                                images={generatedImages}
                                originalImages={uploadedImages}
                            />

                            {/* Video CTA Card */}
                            {!generatedVideo && !isGeneratingVideo && (
                                <div className="card p-8 bg-gradient-to-br from-white to-gray-50 border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="text-center md:text-left">
                                        <h3 className="text-xl font-bold text-text-primary mb-2">
                                            Ready for the full experience?
                                        </h3>
                                        <p className="text-text-secondary">
                                            Generate an immersive 8-second 360° turntable video of your car.
                                        </p>
                                    </div>
                                    <Button
                                        onClick={switchToVideoAndGenerate}
                                        className="whitespace-nowrap shadow-lg shadow-primary/20"
                                    >
                                        Generate 360° Video 🎥
                                    </Button>
                                </div>
                            )}

                            {/* Video Ready Shortcut */}
                            {generatedVideo && (
                                <div className="card p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-emerald-100 bg-emerald-50/30">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                                            ✓
                                        </div>
                                        <div>
                                            <p className="font-semibold text-text-primary">360° Video is ready!</p>
                                            <p className="text-sm text-text-secondary">Your cinematic turntable is now available.</p>
                                        </div>
                                    </div>
                                    <Button variant="secondary" onClick={() => setActiveTab('video')}>
                                        Watch Video
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Video Generation View */}
                    {activeTab === 'video' && (
                        <div className="fade-in">
                            {!generatedVideo && !isGeneratingVideo && (
                                <div className="card p-12 text-center flex flex-col items-center max-w-2xl mx-auto">
                                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-3xl mb-6">
                                        🎥
                                    </div>
                                    <h3 className="text-2xl font-bold text-text-primary mb-3">
                                        360° Showcase Video
                                    </h3>
                                    <p className="text-text-secondary mb-8 max-w-md">
                                        Transform your customized images into a cinematic turntable video.
                                        Powered by ShopOS Pro for studio-quality results.
                                    </p>
                                    <Button onClick={handleGenerateVideo} className="px-12 py-4 text-lg">
                                        Start Video Generation
                                    </Button>
                                </div>
                            )}

                            {isGeneratingVideo && (
                                <div className="card p-12 flex flex-col items-center justify-center max-w-2xl mx-auto">
                                    <div className="text-center mb-8">
                                        <Loader text="Directing your 360° masterpiece..." />
                                    </div>
                                    <div className="w-full">
                                        <ProgressBar
                                            progress={simulatedVideoProgress}
                                            label="Processing Cinematic Render"
                                        />
                                        <div className="flex items-center justify-between mt-6 text-xs text-text-secondary">
                                            <span>Building Scene</span>
                                            <span>Animating Camera</span>
                                            <span>Final Render</span>
                                        </div>
                                        <p className="text-xs text-text-secondary text-center mt-8 italic">
                                            "Good things take time. This usually takes 2–5 minutes."
                                        </p>
                                    </div>
                                </div>
                            )}

                            {generatedVideo && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-bold text-text-primary">
                                            360° Cinematic Showcase
                                        </h3>
                                        <Button
                                            variant="secondary"
                                            onClick={() => setActiveTab('images')}
                                            className="px-4 py-2 min-h-[40px] text-sm"
                                        >
                                            View Images
                                        </Button>
                                    </div>
                                    <VideoPlayer videoUrl={generatedVideo} />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {(generatedImages.length > 0 || error) && (
                    <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
                        <Button variant="secondary" onClick={() => navigate('/customize')}>
                            ← Back to Customization
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
