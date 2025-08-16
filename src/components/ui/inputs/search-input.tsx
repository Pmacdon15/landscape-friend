'use client';

import { useSearchInput } from '@/hooks/hooks';

export function SearchInput() {
  const { searchTerm, setSearchTerm } = useSearchInput();

  return (
    <input
      name="search"
      className="border rounded-sm p-1 sm:w-1/2 md:w-2/6"
      placeholder="Search"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}
