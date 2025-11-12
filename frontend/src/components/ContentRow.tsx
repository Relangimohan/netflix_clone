/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';

interface ContentItem {
    _id: string;
    title: string;
    posterUrl: string;
    videoUrl: string;
}

interface ContentRowProps {
    title: string;
    items: ContentItem[];
    onPosterClick: (videoUrl: string) => void;
}

// A single row of horizontally-scrolling content posters
export const ContentRow: React.FC<ContentRowProps> = ({ title, items, onPosterClick }) => (
    <div className="movie-row">
        <h2>{title}</h2>
        <div className="movie-posters">
            {items.map(item => (
                <div key={item._id} className="poster-container" onClick={() => onPosterClick(item.videoUrl)}>
                    <img src={item.posterUrl} alt={item.title} className="poster-img" />
                </div>
            ))}
        </div>
    </div>
);
