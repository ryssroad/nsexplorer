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

interface BlockInfo {
  block_id: string;
  header_height: number;
  header_time: string;
  header_proposer_address: string;
  transactions_count: string;
}

const BlocksPage: React.FC = () => {
  const [blocks, setBlocks] = useState<BlockInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLastTenBlocks = async () => {
      try {
        const response = await fetch("https://namada-explorer-api.stakepool.dev.br/node/blocks/list/10");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const blocksInfo: BlockInfo[] = data.map((block: any) => ({
          block_id: block.block_id,
          header_height: block.header_height,
          header_time: block.header_time,
          header_proposer_address: block.header_proposer_address,
          transactions_count: block.transactions_count,
        }));
        setBlocks(blocksInfo);
        setIsLoading(false);
      } catch (error) {
        console.error("Could not fetch blocks:", error);
        setIsLoading(false);
      }
    };

    fetchLastTenBlocks();
  }, []);

  return isLoading ? (
    <div className='pt-14'>
      <Skeleton className="mb-4 w-full h-6 rounded" />
      <Skeleton className="mb-4 w-full h-6 rounded" />
      <Skeleton className="mb-4 w-full h-6 rounded" />
    </div>
  ) : (
    <Table>
      <TableCaption>A summary of the last 10 blocks.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Height</TableHead>
          <TableHead>Block ID</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>TX Count</TableHead>
          <TableHead>Proposer Address</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {blocks.map((block, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">
              <Link
                href={`/block/${block.header_height}`}
                className="text-gray-400 hover:text-gray-600 visited:text-blue-600"
                >
                {block.header_height}
              </Link>
            </TableCell>
            <TableCell>{block.block_id}</TableCell>
            <TableCell>{formatDistanceToNow(new Date(block.header_time), { addSuffix: true })}</TableCell>
            <TableCell>{block.transactions_count}</TableCell>
            <TableCell>{block.header_proposer_address}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BlocksPage;
