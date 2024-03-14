"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import FooterComponent from "@/components/FooterComponent"

export default function SearchPage() {
  const [searchInput, setSearchInput] = useState("")
  const router = useRouter()

  const handleSearchSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    const isTxHash = /^[0-9A-Fa-f]{64}$/.test(searchInput)
    const path = isTxHash
      ? `/tx/${searchInput.toLowerCase()}` // Path for transaction details
      : `/block/${encodeURIComponent(searchInput)}`
    router.push(path)
  }

  return (
    <>
    <section className="flex flex-col h-screen items-center justify-center overflow-hidden">
        <div className="w-5/6">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center justify-center space-x-2 py-8"
          >
            <Input
              type="search"
              placeholder="search tx/block"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full"
            />
            <Button variant="outline" size="icon" type="submit">
              <MagnifyingGlassIcon className="h-4 w-4" />
            </Button>
          </form>
          <div className="text-sm text-gray-600">
          <FooterComponent />
        </div>
        </div>
        
    </section>
  </>
  )
}
