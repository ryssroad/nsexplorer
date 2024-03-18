"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

import { Skeleton } from "@/components/ui/skeleton"
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
  block_id: string
  height: string
  time: string
  proposer_address: string
  tx_count: number
}

const BlocksPage: React.FC = () => {
  const [blocks, setBlocks] = useState<BlockInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBlocksData = async () => {
      setIsLoading(true)
      try {
        // Получаем данные последнего блока
        const lastBlockResponse = await fetch(
          `${process.env.NEXT_PUBLIC_INDEXER_API_URL}/block/last`
        )
        const lastBlockData = await lastBlockResponse.json()
        const lastBlockHeight = parseInt(lastBlockData.header.height)

        // Создаем массив промисов для получения данных предыдущих блоков
        const blockFetchPromises = []
        for (let i = 0; i < 10; i++) {
          blockFetchPromises.push(
            fetch(
              `${process.env.NEXT_PUBLIC_INDEXER_API_URL}/block/height/${lastBlockHeight - i}`
            )
          )
        }
        // Разрешаем все промисы и обрабатываем ответы
        const blockResponses = await Promise.all(blockFetchPromises)
        const blockDataPromises = blockResponses.map((response) =>
          response.json()
        )
        const blocksData = await Promise.all(blockDataPromises)

        // Формируем массив с информацией о блоках
        const blocksInfo = blocksData.map((data, index) => ({
          block_id: data.block_id,
          height: data.header.height,
          time: data.header.time,
          proposer_address: data.header.proposer_address,
          tx_count: data.tx_hashes.length,
        }))

        setBlocks(blocksInfo)
      } catch (error) {
        console.error("Could not fetch blocks:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlocksData()
  }, [])

  if (isLoading) {
    return (
      <div className="pt-14">
        <Skeleton className="mb-4 w-full h-6 rounded" />
        <Skeleton className="mb-4 w-full h-6 rounded" />
        <Skeleton className="mb-4 w-full h-6 rounded" />
      </div>
    )
  }

  return (
    <Table>
      <TableCaption>A summary of the last 10 blocks.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Height</TableHead>
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
                className="text-gray-400 hover:text-gray-600 visited:text-blue-600"
              >
                {block.height}
              </Link>
            </TableCell>
            <TableCell>{block.block_id}</TableCell>
            <TableCell>
              {formatDistanceToNow(new Date(block.time), { addSuffix: true })}
            </TableCell>
            <TableCell>{block.tx_count}</TableCell>
            <TableCell>
              <Link
                href={`/validators/${block.proposer_address}`}
                className="text-gray-400 hover:text-gray-600 visited:text-blue-600"
              >
                {block.proposer_address}
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default BlocksPage
