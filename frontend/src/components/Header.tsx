/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { TypingLogo } from './TypingLogo';
import { CategoryFilter } from './CategoryFilter';

interface HeaderProps {
    onLogout: () => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    isSearching: boolean;
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

// Header Component
export const Header = ({ 
    onLogout, 
    searchQuery, 
    onSearchChange, 
    isSearching,
    categories,
    selectedCategory,
    onCategoryChange 
}: HeaderProps) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
            <TypingLogo text="mana studio" />
            <div className="header-right">
                <CategoryFilter 
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={onCategoryChange}
                />
                <div className="search-container">
                    <input
                        type="search"
                        className="search-input"
                        placeholder="Search with AI..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        aria-label="Search content with AI"
                    />
                    {isSearching && <div className="search-spinner" aria-label="Searching"></div>}
                </div>
                <button className="sign-out-btn" onClick={onLogout}>
                  Sign Out
                </button>
            </div>
        </header>
    );
};