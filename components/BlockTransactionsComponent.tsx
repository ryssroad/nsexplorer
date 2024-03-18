// components/BlockTransactionsComponent.tsx

import React from "react"
import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { TransactionType } from "@/app/types/transaction"

type BlockTransactionsProps = {
  transactions: TransactionType[]
}

const BlockTransactionsComponent: React.FC<BlockTransactionsProps> = ({
  transactions,
}) => {
  if (transactions.length === 0) return <p>No transactions for this block.</p>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Block Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-full w-full rounded-md border">
          <Table>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{transaction.tx_type}</TableCell>
                  <TableCell>
                    <Link
                      href={`/tx/${transaction.hash_id}`}
                      className="text-gray-400 hover:text-gray-600 visited:text-blue-600"
                      >
                      {transaction.hash_id}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default BlockTransactionsComponent
