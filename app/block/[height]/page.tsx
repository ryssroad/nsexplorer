"use client"

import React, { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import BlockDetailsComponent from "@/components/BlockDetailsComponent"
import BlockTransactionsComponent from "@/components/BlockTransactionsComponent"
import ValidatorsComponent from "@/components/ValidatorsComponent"
import { BlockDetails } from "@/app/types/blockDetails"
import { TransactionType } from "@/app/types/transaction"
import { Validator } from "@/app/types/validator"

const BlockDetailsPage: React.FC = () => {
  const pathname = usePathname()
  const [blockDetails, setBlockDetails] = useState<BlockDetails | null>(null)
  const [transactions, setTransactions] = useState<TransactionType[]>([])
  const [validators, setValidators] = useState<Validator[]>([])
  const [isLoading, setIsLoading] = useState(true) // Start with loading state true
  const [error, setError] = useState<string | null>(null)
  const heightMatch = pathname.match(/\/block\/(\d+)/)
  const height = heightMatch ? heightMatch[1] : null

  useEffect(() => {
    const fetchAndSetData = async () => {
      if (height) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_INDEXER_API_URL}/block/height/${height}`
          )
          const data = await response.json()

          if (data) {
            setBlockDetails(data)
            setTransactions(data.tx_hashes)
            const validatorsResponse = await fetch(
              `${process.env.NEXT_PUBLIC_VALIDATORS_API_URL}/validators?height=${height}&per_page=10`
            )
            const validatorsData = await validatorsResponse.json()
            setValidators(validatorsData.result.validators)
          } else {
            throw new Error("Data not found for the given block height.")
          }
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message)
            console.error("Fetch error:", err.message)
          } else {
            setError("An unexpected error occurred")
            console.error("Fetch error:", err)
          }
        } finally {
          setIsLoading(false)
        }
      } else {
        setError("Block height not found in the URL.")
        setIsLoading(false)
      }
    }

    fetchAndSetData()
  }, [pathname])

  if (isLoading) {
    return (
      <div className="p-5 space-y-5">
        
        <Skeleton className="w-full h-44 my-2" />
        <div className="flex flex-wrap -mx-2">
        <Skeleton className="w-full lg:w-1/2 h-44 px-28" />
        <Skeleton className="w-full lg:w-1/2 h-44 px-28" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // if (error) {
  //   return <p>Error: {error}</p>
  // }

  return (
    <div className="p-5 space-y-5">
      <div className="flex flex-wrap -mx-2">
      <div className="w-full lg:w-1/2 px-2">
      {blockDetails && <BlockDetailsComponent blockDetails={blockDetails} />}
      </div>
        {/* <div className="w-full lg:w-1/2 px-2">
          {validators && validators.length > 0 && (
            <ValidatorsComponent validators={validators} height={height!} />
          )}
        // </div> */}
        <div className="w-full lg:w-1/2 px-2">
          {transactions && transactions.length > 0 && (
            <BlockTransactionsComponent transactions={transactions} />
          )}
        </div>
      </div>
    </div>

  )
}

export default BlockDetailsPage
