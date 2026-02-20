import React from 'react';

/**
 * Video player with controls and download
 */
const VideoPlayer = ({ videoUrl }) => {
    if (!videoUrl) return null;

    return (
        <div className="card overflow-hidden fade-in">
            <div className="aspect-video bg-black">
                <video
                    src={videoUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-contain"
                >
                    Your browser does not support video playback.
                </video>
            </div>
            <div className="p-4 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-text-primary">360° Showcase</h3>
                    <p className="text-xs text-text-secondary">8-second turntable video</p>
                </div>
                <a
                    href={videoUrl}
                    download="autowerks-360-video.mp4"
                    className="btn-secondary text-sm px-4 py-2"
                >
                    ↓ Download Video
                </a>
            </div>
        </div>
    );
};

export default VideoPlayer;
