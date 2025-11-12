/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';

interface AddContentModalProps {
    onClose: () => void;
    onContentAdded: () => void;
}

export const AddContentModal = ({ onClose, onContentAdded }: AddContentModalProps) => {
    const [title, setTitle] = useState('');
    const [posterUrl, setPosterUrl] = useState('');
    const [category, setCategory] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !posterUrl || !category) {
            setError('All fields are required.');
            return;
        }

        // --- Backend connection disabled for static demo ---
        setError('Adding content is disabled in this demo version.');
        // try {
        //     const response = await fetch('/api/content', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({ title, posterUrl, category }),
        //     });
        //
        //     if (!response.ok) {
        //         throw new Error('Failed to add content');
        //     }
        //
        //     onContentAdded(); // Callback to refresh content list
        //     onClose(); // Close the modal
        // } catch (err) {
        //     setError(err instanceof Error ? err.message : 'An unknown error occurred');
        // }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose} aria-label="Close modal">&times;</button>
                <h2>Add New Content</h2>
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="posterUrl">Poster Image URL</label>
                        <input
                            type="url"
                            id="posterUrl"
                            value={posterUrl}
                            onChange={e => setPosterUrl(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="category">Category</label>
                        <input
                            type="text"
                            id="category"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            placeholder="e.g., Telugu Cinema, Trending Now"
                            required
                        />
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button type="submit">Add Content</button>
                </form>
            </div>
        </div>
    );
};
