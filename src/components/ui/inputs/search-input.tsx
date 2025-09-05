'use client';

import { useSearchInput } from '@/lib/hooks/hooks';
import { X } from 'lucide-react';

export function SearchInput() {
  const { searchTerm, setSearchTerm } = useSearchInput();

  return (
    <div className="flex items-center sm:w-1/2 md:w-2/6 border rounded-sm">
      <input
        name="search"
        className="flex-grow p-2 focus:outline-none"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm('')}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}