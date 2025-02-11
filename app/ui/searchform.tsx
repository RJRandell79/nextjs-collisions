'use client';

import { useState } from 'react';
import { SearchFormProps } from '../lib/definitions';

const SearchForm = ({ onSearch } : SearchFormProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const handleSearch = (event: React.FormEvent) => {
        event.preventDefault();
        onSearch(searchTerm);
    };
    
    return (
        <form onSubmit={handleSearch} className="flex gap-2 sapce-x-2">
            <label htmlFor="search" className="sr-only">Search for a location</label>
            <input
                type="search"
                placeholder="Search for a location"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="rounded-lg p-2"
            />
            <button type="submit" className="bg-blue-500 text-white rounded-lg p-2">Search</button>
        </form>
    );
};

export default SearchForm;