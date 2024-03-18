import React, { useEffect, useState } from "react"
import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

interface TransactionProps {
  hash: string
  block_id: string
  tx_type: string
  return_code?: number | null
  // Additional properties as needed...
}

interface TransactionDetailsComponentProps {
  transaction: TransactionProps
  rawTransactionData: string // JSON string of the full transaction data
}

const TransactionDetailsComponent: React.FC<
  TransactionDetailsComponentProps
> = ({ transaction, rawTransactionData }) => {
  const [blockHeight, setBlockHeight] = useState(null)
  const getStatus = (returnCode: number | null | undefined) => {
    return returnCode === null || returnCode === 0 || returnCode === undefined
      ? "Success"
      : "Failed"
  }

  const status = getStatus(transaction.return_code)

  useEffect(() => {
    async function fetchBlockHeight() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_INDEXER_API_URL}/block/hash/${transaction.block_id}`
        )
        if (!response.ok) {
          throw new Error("Block height not found")
        }
        const data = await response.json()
        setBlockHeight(data.header.height) // Assuming the API response returns an object with a height field
      } catch (error) {
        console.error("Error fetching block height:", error)
      }
    }

    if (transaction.block_id) {
      fetchBlockHeight()
    }
  }, [transaction.block_id])

  return (
    <div className="p-5 space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Transaction Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="text-slate-400">
                  Transaction Hash:
                </TableCell>
                <TableCell>{transaction.hash}</TableCell>
                <TableCell className="text-slate-400">
                  Transaction Type:
                </TableCell>
                <TableCell>{transaction.tx_type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-slate-400">Block Height:</TableCell>
                <TableCell>
                  {blockHeight ? (
                    <Link
                      href={`/block/${blockHeight}`}
                      className="text-gray-400 hover:text-gray-600 visited:text-blue-600"
                      >
                      {blockHeight}
                    </Link>
                  ) : (
                    "Loading..."
                  )}
                </TableCell>
                <TableCell className="text-slate-400">Status:</TableCell>
                <TableCell
                  className={
                    status === "Failed" ? "text-red-600" : "text-green-600"
                  }
                >
                  {status}
                </TableCell>
              </TableRow>
              <TableRow></TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Raw Data</CardTitle>
        </CardHeader>
        <CardContent className="text-wrap">
          <ScrollArea className="h-72 w-full rounded-md border">
            <div className="p-4 text-sm">
              <pre className="text-zinc-500 whitespace-pre-wrap break-all">
                {rawTransactionData}
              </pre>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

export default TransactionDetailsComponent
