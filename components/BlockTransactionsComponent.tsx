// components/BlockTransactionsComponent.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { TransactionType } from "@/app/types/transaction";

type BlockTransactionsProps = {
    transactions: TransactionType[];
};

const BlockTransactionsComponent: React.FC<BlockTransactionsProps> = ({ transactions }) => {
  if (transactions.length === 0) return <p>No transactions for this block.</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Block Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {transactions.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell>{transaction.tx_type}</TableCell>
                <TableCell>{transaction.hash_id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BlockTransactionsComponent;
