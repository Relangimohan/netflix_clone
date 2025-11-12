/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Header } from '../components/Header';
import { HeroBanner } from '../components/HeroBanner';
import { ContentRow } from '../components/ContentRow';
import { VideoPlayerModal } from '../components/VideoPlayerModal';


interface ContentItem {
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
    const [isSearching, setIsSearching] = useState(false);
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
            const response = await fetch('/api/content');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: ContentItem[] = await response.json();
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

    const handleAiSearch = async (query: string) => {
        if (!query) {
            setFilteredContentList(masterContentList);
            return;
        }

        setIsSearching(true);
        setError(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

            const contentForPrompt = masterContentList.map(item => ({
                title: item.title,
                description: item.description,
                category: item.category,
            }));

            const prompt = `You are a helpful search assistant for a streaming service called 'mana studio'.
A user is searching for: "${query}".
Here is the available content library:
${JSON.stringify(contentForPrompt)}

Based on the user's search query, identify the most relevant items. Consider the title, description, and category.
Return a JSON object with a single key "relevant_titles" which is an array of strings, containing only the titles of the relevant items.
For example: { "relevant_titles": ["Kalki 2898 AD Trailer", "What Is Generative AI?"] }.
If no items are relevant, return an empty array for "relevant_titles".`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            relevant_titles: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.STRING
                                }
                            }
                        }
                    }
                }
            });
            
            const resultText = response.text.trim();
            const result = JSON.parse(resultText);

            if (result && result.relevant_titles) {
                const relevantTitles = new Set(result.relevant_titles);
                const filteredContent = masterContentList.filter(item => relevantTitles.has(item.title));
                setFilteredContentList(filteredContent);
            } else {
                 setFilteredContentList([]);
            }

        } catch (e) {
            console.error("AI search failed:", e);
            setError("AI search failed. Falling back to simple text search.");
            const lowerCaseQuery = query.toLowerCase();
            const filteredContent = masterContentList.filter(item =>
                item.title.toLowerCase().includes(lowerCaseQuery) ||
                item.description.toLowerCase().includes(lowerCaseQuery) ||
                item.category.toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredContentList(filteredContent);
        } finally {
            setIsSearching(false);
        }
    };
    
    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = window.setTimeout(() => {
            handleAiSearch(query);
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
                isSearching={isSearching}
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
                    !isSearching && (searchQuery || selectedCategory !== 'All') && <div>No results found.</div>
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