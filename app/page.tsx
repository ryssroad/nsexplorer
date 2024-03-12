"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"


export default function SearchPage() {
  const [searchInput, setSearchInput] = useState('');
  const router = useRouter();

const handleSearchSubmit = (event: { preventDefault: () => void; }) => {
  event.preventDefault();
  // No need to check for router.isReady as this hook behaves differently
  router.push(`/block/${encodeURIComponent(searchInput)}`);
};

  return (
    <section className="h-screen flex items-center justify-center">
      <form onSubmit={handleSearchSubmit} className="flex w-full max-w-xl items-center space-x-2">
        <Input 
          type="search" 
          placeholder="search tx/block" 
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Button variant="outline" size="icon" type="submit">
          <MagnifyingGlassIcon className="h-4 w-4" />
        </Button>
      </form>
    </section>
  )
}
