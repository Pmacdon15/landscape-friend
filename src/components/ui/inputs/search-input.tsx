'use client';

import { useSearchInput } from '@/lib/hooks/hooks';
import { X } from 'lucide-react';

export function SearchInput() {
  const { searchTerm, setSearchTerm } = useSearchInput();

  return (
    <div className="relative sm:w-1/2 md:w-2/6">
      <input
        name="search"
        className="w-full border rounded-sm p-2 pr-8"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
