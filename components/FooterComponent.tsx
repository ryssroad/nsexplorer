import React, { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

interface LastBlockInfo {
  height: string
  time: string
  txCount: number;
}

const FooterComponent: React.FC = () => {
  const [lastBlockInfo, setLastBlockInfo] = useState<LastBlockInfo | null>(null)

  useEffect(() => {
    const fetchLastBlockInfo = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_INDEXER_API_URL}/block/last`
        )
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const { block_id, header, tx_hashes } = await response.json()
        setLastBlockInfo({
          height: header.height,
          time: header.time,
          txCount: tx_hashes.length,
        })
      } catch (error) {
        console.error("Could not fetch last block info:", error)
      }
    }

    fetchLastBlockInfo()
  }, [])

  if (!lastBlockInfo) {
    return <footer>Loading last block information...</footer>
  }

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className="text-slate-400 text-right">Last Block Height:</TableCell>
          <TableCell className="text-start">{lastBlockInfo.height}</TableCell>

          <TableCell className="text-slate-400 text-right">TX count:</TableCell>
          <TableCell className="text-start">{lastBlockInfo.txCount}</TableCell>

          <TableCell className="text-slate-400 text-right">Last Block Time:</TableCell>
          <TableCell>
            {formatDistanceToNow(new Date(lastBlockInfo.time), {
              addSuffix: true,
            })}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export default FooterComponent
