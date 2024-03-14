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
  const isTxHash = /^[0-9A-Fa-f]{64}$/.test(searchInput);
  const path = isTxHash
      ? `/tx/${searchInput.toLowerCase()}`  // Path for transaction details
      : `/block/${encodeURIComponent(searchInput)}`;
  router.push(path);
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
