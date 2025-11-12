/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface HeroData {
    title: string;
    description: string;
    posterUrl: string;
    videoUrl?: string;
}

interface HeroBannerProps {
    heroData: HeroData | null;
    onPlay: (videoUrl: string) => void;
}

// Hero Banner for the main page
export const HeroBanner = ({ heroData, onPlay }: HeroBannerProps) => {
    if (!heroData) {
        return null; // Or a loading skeleton
    }

    const handlePlayClick = () => {
        if (heroData.videoUrl) {
            onPlay(heroData.videoUrl);
        }
    };

    return (
        <div className="hero-banner" style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${heroData.posterUrl})`}}>
             <div className="hero-content">
                <h1 className="hero-title">{heroData.title}</h1>
                <p className="hero-description">{heroData.description}</p>
                <div>
                    <button 
                        className="hero-button play-button" 
                        onClick={handlePlayClick}
                        disabled={!heroData.videoUrl}
                    >
                        Play
                    </button>
                    <button className="hero-button info-button">More Info</button>
                </div>
            </div>
        </div>
    );
};