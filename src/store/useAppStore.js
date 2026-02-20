import { create } from 'zustand';

/**
 * Global application store using Zustand
 * Manages: uploaded images, color/finish selections, generated results, loading/error states
 */
const useAppStore = create((set, get) => ({
    // === Upload State ===
    uploadedImages: [],
    setUploadedImages: (images) => set({ uploadedImages: images }),
    clearUploadedImages: () => set({ uploadedImages: [] }),
    removeUploadedImage: (id) =>
        set((state) => {
            const removed = state.uploadedImages.find((img) => img.id === id);
            if (removed?.preview) URL.revokeObjectURL(removed.preview);
            return {
                uploadedImages: state.uploadedImages.filter((img) => img.id !== id),
            };
        }),

    // === Customization State ===
    selectedColor: null,
    selectedFinish: null,
    setSelectedColor: (color) => set({ selectedColor: color }),
    setSelectedFinish: (finish) => set({ selectedFinish: finish }),

    // === Generation State ===
    generatedImages: [],
    generatedVideo: null,
    setGeneratedImages: (images) => set({ generatedImages: images }),
    setGeneratedVideo: (video) => set({ generatedVideo: video }),

    // === Loading State ===
    isGeneratingImages: false,
    isGeneratingVideo: false,
    imageProgress: 0,
    videoProgress: 0,
    setImageGenerating: (loading) => set({ isGeneratingImages: loading }),
    setVideoGenerating: (loading) => set({ isGeneratingVideo: loading }),
    setImageProgress: (progress) => set({ imageProgress: progress }),
    setVideoProgress: (progress) => set({ videoProgress: progress }),

    // === Error State ===
    error: null,
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    // === Step Navigation ===
    currentStep: 1,
    setCurrentStep: (step) => set({ currentStep: step }),

    // === Reset ===
    resetAll: () =>
        set({
            uploadedImages: [],
            selectedColor: null,
            selectedFinish: null,
            generatedImages: [],
            generatedVideo: null,
            isGeneratingImages: false,
            isGeneratingVideo: false,
            imageProgress: 0,
            videoProgress: 0,
            error: null,
            currentStep: 1,
        }),
}));

export default useAppStore;
