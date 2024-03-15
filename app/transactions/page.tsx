"use client";
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface TransactionInfo {
  hash: string;
  header_height: number;
  header_time: string;
  return_code: number;
}

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLastTenTransactions = async () => {
      try {
        const response = await fetch("https://namada-explorer-api.stakepool.dev.br/node/transactions/list/10");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const transactionsInfo: TransactionInfo[] = data.map((transaction: any) => ({
          hash: transaction.hash,
          header_height: transaction.header_height,
          header_time: transaction.header_time,
          return_code: transaction.return_code,
        }));
        setTransactions(transactionsInfo);
        setIsLoading(false);
      } catch (error) {
        console.error("Could not fetch transactions:", error);
        setIsLoading(false);
      }
    };

    fetchLastTenTransactions();
  }, []);

  return isLoading ? (
    <div className='pt-14'>
      <Skeleton className="mb-4 w-full h-6 rounded" />
      <Skeleton className="mb-4 w-full h-6 rounded" />
      <Skeleton className="mb-4 w-full h-6 rounded" />
    </div>
  ) : (
    <Table>
      <TableCaption>A summary of the last 10 transactions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Transaction Hash</TableHead>
          <TableHead>Height</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Result</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">
            <Link href={`/tx/${transaction.hash}`}>
  <a className="text-blue-600 hover:text-blue-800 visited:text-purple-600">{transaction.hash}</a>
</Link>
            </TableCell>
            <TableCell>{transaction.header_height}</TableCell>
            <TableCell>{formatDistanceToNow(new Date(transaction.header_time), { addSuffix: true })}</TableCell>
            <TableCell>{transaction.return_code === 0 ? 'Success' : 'Failed'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TransactionsPage;
