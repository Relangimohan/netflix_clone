/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Header } from '../components/Header'; // Assuming Header is still used for UI
import { HeroBanner } from '../components/HeroBanner';
import { ContentRow } from '../components/ContentRow';
import { mockContent } from '../data/mockData';
import { VideoPlayerModal } from '../components/VideoPlayerModal';


interface ContentItem {
    // _id is optional for static data, but kept for consistency with previous structure
    _id: string;
    title: string;
    posterUrl: string;
    category: string;
    description: string;
    videoUrl: string;
}

interface Genre {
    title: string;
    items: ContentItem[];
}

interface BrowsePageProps {
    onLogout: () => void;
}

interface HeroDataState {
    title: string;
    description: string;
    posterUrl: string;
    videoUrl?: string;
}

// Main Browse Page Component (after login)
export const BrowsePage = ({ onLogout }: BrowsePageProps) => {
    const [masterContentList, setMasterContentList] = useState<ContentItem[]>([]);
    const [filteredContentList, setFilteredContentList] = useState<ContentItem[]>([]);
    const [heroData, setHeroData] = useState<HeroDataState | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    // isSearching state removed as client-side search is synchronous
    const debounceTimeout = useRef<number | null>(null);

    const processContentData = useCallback((data: ContentItem[]) => {
        // Process data to group by category
        const groupedByCategory = data.reduce((acc, item) => {
            const { category } = item;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(item);
            return acc;
        }, {} as Record<string, ContentItem[]>);

        const genresData: Genre[] = Object.keys(groupedByCategory).map(key => ({
            title: key,
            items: groupedByCategory[key],
        }));

        return genresData;
    }, []);

    const fetchContent = useCallback(async () => {
        setLoading(true);
        try {
            // Use static mock data instead of fetching from API
            const data: ContentItem[] = mockContent;

            setMasterContentList(data);
            setFilteredContentList(data);
            
            if (data.length > 0) {
              const randomItem = data[Math.floor(Math.random() * data.length)];
              setHeroData({
                title: randomItem.title,
                description: randomItem.description,
                posterUrl: randomItem.posterUrl,
                videoUrl: randomItem.videoUrl,
              });
            } else {
              setHeroData({
                title: 'Welcome to mana studio',
                description: 'Explore our collection of educational videos.',
                posterUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
              });
            }

        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    const allCategories = useMemo(() => {
        const categories = new Set(masterContentList.map(item => item.category));
        return Array.from(categories).sort();
    }, [masterContentList]);

    // Client-side search function
    const handleClientSearch = (query: string) => {
        if (!query) {
            setFilteredContentList(masterContentList);
            return;
        }

        setError(null);

        try {
            const lowerCaseQuery = query.toLowerCase();
            const filteredContent = masterContentList.filter(item =>
                item.title.toLowerCase().includes(lowerCaseQuery) ||
                item.description.toLowerCase().includes(lowerCaseQuery) ||
                item.category.toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredContentList(filteredContent);
        } catch (e) {
            console.error("Client-side search failed:", e);
            setError("Client-side search failed.");
            setFilteredContentList([]);
        }
    };
    
    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = window.setTimeout(() => { // Debounce for better UX
            handleClientSearch(query);
        }, 500); // 500ms debounce delay
    };

    const handlePosterClick = (videoUrl: string) => {
        setSelectedVideoUrl(videoUrl);
    };
    
    const handlePlayHero = (videoUrl: string) => {
        setSelectedVideoUrl(videoUrl);
    };

    const genresToDisplay = useMemo(() => {
        let content = filteredContentList;
        if (selectedCategory !== 'All') {
            content = content.filter(item => item.category === selectedCategory);
        }
        return processContentData(content);
    }, [filteredContentList, selectedCategory, processContentData]);

    if (loading && masterContentList.length === 0) return <div style={{padding: '20px'}}>Loading...</div>;
    
    return (
        <div className="app-container">
            <Header 
                onLogout={onLogout} 
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                isSearching={false} // No longer performing async search
                categories={allCategories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
            />
            {heroData && <HeroBanner heroData={heroData} onPlay={handlePlayHero} />}
            <main className="browse-content">
                {error && <div style={{padding: '0 0 20px', color: 'orange'}}>{error}</div>}
                {genresToDisplay.length > 0 ? genresToDisplay.map(genre => (
                    <ContentRow 
                        key={genre.title} 
                        title={genre.title} 
                        items={genre.items} 
                        onPosterClick={handlePosterClick}
                    />
                )) : (
                    (searchQuery || selectedCategory !== 'All') && <div>No results found.</div>
                )}
            </main>
            {selectedVideoUrl && (
                <VideoPlayerModal
                    videoUrl={selectedVideoUrl}
                    onClose={() => setSelectedVideoUrl(null)}
                />
            )}
        </div>
    );
};