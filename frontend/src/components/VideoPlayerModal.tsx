/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';

interface VideoPlayerModalProps {
    videoUrl: string;
    onClose: () => void;
}

// Function to convert YouTube URL to an embeddable URL
const getEmbedUrl = (url: string) => {
    let videoId = '';
    // Check for standard, short, and embed URLs
    if (url.includes('youtube.com/watch?v=')) {
        videoId = new URL(url).searchParams.get('v') || '';
    } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('/embed/')[1].split('?')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : '';
};

export const VideoPlayerModal = ({ videoUrl, onClose }: VideoPlayerModalProps) => {
    const embedUrl = getEmbedUrl(videoUrl);

    if (!embedUrl) {
        return (
            <div className="video-modal-overlay" onClick={onClose}>
                <div className="video-modal-content" onClick={e => e.stopPropagation()}>
                    <button className="video-modal-close-btn" onClick={onClose}>&times;</button>
                    <p>Invalid YouTube URL provided.</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="video-modal-overlay" onClick={onClose}>
            <div className="video-modal-content" onClick={e => e.stopPropagation()}>
                <button className="video-modal-close-btn" onClick={onClose} aria-label="Close video player">&times;</button>
                <div className="video-responsive">
                    <iframe
                        src={embedUrl}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    );
};
