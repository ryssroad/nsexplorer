"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TransactionInfo {
  hash_id: string;
  tx_type: string;
  header_height: number;
  time: string;
}

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLastBlockTransactions = async () => {
      setIsLoading(true);
      try {
        // Замените URL на актуальный endpoint для получения данных последнего блока
        const response = await fetch("https://nam-dex.systemd.run/block/last");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const { tx_hashes, header } = await response.json();

        // Формируем данные транзакций на основе ответа о последнем блоке
        const transactionsInfo = tx_hashes.map((tx: any) => ({
          hash_id: tx.hash_id,
          tx_type: tx.tx_type,
          header_height: header.height,
          time: header.time,
        }));

        setTransactions(transactionsInfo);
        setIsLoading(false);
      } catch (error) {
        console.error("Could not fetch transactions:", error);
        setIsLoading(false);
      }
    };

    fetchLastBlockTransactions();
  }, []);


  return isLoading ? (
    <div className="pt-14">
      <div className="pt-14">
        <Skeleton className="mb-4 w-full h-6 rounded" />
        <Skeleton className="mb-4 w-full h-6 rounded" />
        <Skeleton className="mb-4 w-full h-6 rounded" />
      </div>
    </div>
  ) : transactions.length === 0 ? (
    <p>No transactions in block</p>
  ) : (
    <Table>
      <TableCaption>A summary of the last block transactions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Transaction Hash</TableHead>
          <TableHead>Height</TableHead>
          <TableHead>Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction, index) => (
          <TableRow key={index}>
            <TableCell>{transaction.tx_type}</TableCell>
            <TableCell className="font-medium">
              <Link
                href={`/tx/${transaction.hash_id}`}
                className="text-gray-400 hover:text-gray-600 visited:text-blue-600"
              >
                {transaction.hash_id}
              </Link>
            </TableCell>
            <TableCell>{transaction.header_height}</TableCell>
            <TableCell>
              {formatDistanceToNow(new Date(transaction.time), {
                addSuffix: true,
                includeSeconds: true,
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TransactionsPage;
