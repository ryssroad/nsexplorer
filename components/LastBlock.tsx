import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface LastBlockInfo {
  height: string;
  txCount: number;
  time: string;
  epoch: number;
}

const LastBlockComponent: React.FC = () => {
  const [lastBlockInfo, setLastBlockInfo] = useState<LastBlockInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLastBlock = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_INDEXER_API_URL}/block/last`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const blockData = await response.json();
        const txCount = blockData.tx_hashes?.length || 0;
        const blockTime = blockData.header?.time;
        const blockHeight = blockData.header?.height;
        const epoch = blockData.epoch;

        if (blockHeight && blockTime) {
          setLastBlockInfo({
            height: blockHeight,
            time: blockTime,
            txCount: txCount,
            epoch: epoch,
          });
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch last block:", error);
        setIsLoading(false);
      }
    };

    fetchLastBlock();
  }, []);

  if (isLoading) {
    return <Skeleton className="w-full h-6 my-2" />;
  }

  const LastBlockTime = ({ lastBlockInfo }: { lastBlockInfo: LastBlockInfo | null }) => {
    if (!lastBlockInfo) return null;

    const blockDate = new Date(lastBlockInfo.time).getTime();
    const now = new Date().getTime();
    const secondsAgo = (now - blockDate) / 1000; // Разница во времени в секундах

    if (secondsAgo < 60) {
      return `${Math.floor(secondsAgo)} seconds ago`;
    }

    return formatDistanceToNow(blockDate, { addSuffix: true });
  };

  return (
    <Table>
      <TableBody>
        <TableRow>
        <TableCell className="text-slate-400 text-right">Epoch:</TableCell>
          <TableCell>{lastBlockInfo?.epoch}</TableCell>
          <TableCell className="text-slate-400 text-right">Last Block Height:</TableCell>
          <TableCell>{lastBlockInfo?.height}</TableCell>
          <TableCell className="text-slate-400 text-right">TX count:</TableCell>
          <TableCell>{lastBlockInfo?.txCount}</TableCell>
          <TableCell className="text-slate-400 text-right">Last Block Time:</TableCell>
          <TableCell>
            {lastBlockInfo && (
              <span>
              {Math.floor((new Date().getTime() - new Date(lastBlockInfo.time).getTime()) / 1000)} seconds ago
            </span>
            )}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default LastBlockComponent;
