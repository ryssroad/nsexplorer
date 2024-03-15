"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface BlockInfo {
  height: string
  time: string
  txCount: number
  proposerAddress: string
}

const BlocksPage: React.FC = () => {
  const [blocks, setBlocks] = useState<BlockInfo[]>([])

  useEffect(() => {
    const ws = new WebSocket("wss://nam-rpc.systemd.run/websocket")

    ws.onopen = () => {
      console.log("WebSocket соединение установлено")
      ws.send(
        JSON.stringify({
          jsonrpc: "2.0",
          method: "subscribe",
          params: {
            query: "tm.event = 'NewBlockHeader'",
          },
          id: "latestBlocks",
        })
      )
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      const value = data?.result?.data?.value

      if (value) {
        const newBlock: BlockInfo = {
          height: value.header.height,
          time: value.header.time,
          txCount: parseInt(value.num_txs, 10) || 0,
          proposerAddress: value.header.proposer_address,
        }

        setBlocks((prevBlocks) => [newBlock, ...prevBlocks].slice(0, 10))
      }
    }

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error)
    }

    return () => {
      ws.close()
    }
  }, [])

  return (
    <Table>
      <TableCaption>A summary of the last 10 blocks.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Height</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>TX Count</TableHead>
          <TableHead>Proposer Address</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {blocks.map((block, index) => (
          <TableRow key={index}>
            <TableCell>
              <Link
                href={`/block/${block.height}`}
                passHref
                className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
              >
                {block.height}
              </Link>
            </TableCell>
            <TableCell>
              {formatDistanceToNow(new Date(block.time), { addSuffix: true })}
            </TableCell>
            <TableCell>{block.txCount}</TableCell>
            <TableCell>{block.proposerAddress}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default BlocksPage
