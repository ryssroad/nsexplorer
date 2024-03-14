"use client";
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';


interface BlockInfo {
  height: string;
  blockId: string;
  time: string;
  proposerAddress: string;
  txCount: string;

}

const BlocksPage: React.FC = () => {
  const [blocks, setBlocks] = useState<BlockInfo[]>([]);

  useEffect(() => {
    const fetchLastTenBlocks = async () => {
      try {
        // Получаем информацию о последнем блоке
        const lastBlockResponse = await fetch(`${process.env.NEXT_PUBLIC_INDEXER_API_URL}/block/last`);
        if (!lastBlockResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const lastBlockData = await lastBlockResponse.json();
        let lastHeight = lastBlockData.header.height;

        // Получаем информацию о предыдущих 9 блоках
        const blocksInfo: BlockInfo[] = [];
        for (let i = 0; i < 10; i++) {
          const blockResponse = await fetch(`${process.env.NEXT_PUBLIC_INDEXER_API_URL}/block/height/${lastHeight}`);
          if (!blockResponse.ok) {
            throw new Error(`Failed to fetch block at height ${lastHeight}`);
          }
          const blockData = await blockResponse.json();
          blocksInfo.push({
            height: blockData.header.height,
            blockId: blockData.block_id,
            time: blockData.header.time,
            proposerAddress: blockData.header.proposer_address,
            txCount: blockData.tx_hashes.length,
          });
          lastHeight--; // уменьшаем высоту для получения предыдущего блока
        }
        setBlocks(blocksInfo);
      } catch (error) {
        console.error("Could not fetch blocks:", error);
      }
    };

    fetchLastTenBlocks();
  }, []);

  return (
    // <Card>
    //   <CardHeader>
    //     <CardTitle>Last 10 Blocks</CardTitle>
    //     <CardDescription>Details of the last 10 blocks in the blockchain.</CardDescription>
    //   </CardHeader>
    //   <CardContent>
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
                href={`/block/${block.height}`}
                className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
              >
                {block.height}
              </Link>
            </TableCell>
                <TableCell>{block.blockId}</TableCell>
                <TableCell>{formatDistanceToNow(new Date(block.time), { addSuffix: true })}</TableCell>
                <TableCell>{block.txCount}</TableCell>
                <TableCell>{block.proposerAddress}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      // </CardContent>
      /* <CardFooter>
        <p>This is a summary of the blockchain's most recent blocks.</p>
      </CardFooter> */
    // </Card>
  );
};

export default BlocksPage;
