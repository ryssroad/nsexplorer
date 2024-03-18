"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import LastBlock from "@/components/LastBlock"

export default function SearchPage() {
  const [searchInput, setSearchInput] = useState("")
  const router = useRouter()

  const handleSearchSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    const isTxHash = /^[0-9A-Fa-f]{64}$/.test(searchInput);
    const isBlockHeight = /^[0-9]+$/.test(searchInput);
    const isValidatorAddress = /^9256[A-Fa-f0-9]{36}$/.test(searchInput);
    let path = "";

    if (isTxHash) {
      path = `/tx/${searchInput.toLowerCase()}`;
    } else if (isBlockHeight) {
      path = `/block/${encodeURIComponent(searchInput)}`;
    } else if (isValidatorAddress) {
      path = `/validators/${searchInput}`;
    } else {
      console.error("Invalid input");
      return;
    }
    router.push(path)
  }

  return (
    <>
    <section className="flex flex-col h-screen items-center justify-center overflow-hidden">
        <div className="w-5/6">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center justify-center space-x-2 py-4"
          >
            <Input
              type="search"
              placeholder="tx hash / block number / val hex address"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full"
            />
            <Button variant="outline" size="icon" type="submit">
              <MagnifyingGlassIcon className="h-4 w-4" />
            </Button>
          </form>
          <div className="text-sm text-gray-600">
          <LastBlock />
        </div>
        </div>
        
    </section>
  </>
  )
}
