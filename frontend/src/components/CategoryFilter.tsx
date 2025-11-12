/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface CategoryFilterProps {
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

export const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) => {
    return (
        <div className="category-filter-container">
            <select
                className="category-filter-select"
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                aria-label="Filter by category"
            >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
        </div>
    );
};
