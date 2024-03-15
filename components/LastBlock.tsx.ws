import React, { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"

import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

interface LastBlockInfo {
  height: string
  time: string
  txCount: number
}

const LastBlockComponent: React.FC = () => {
  const [lastBlockInfo, setLastBlockInfo] = useState<LastBlockInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const LastBlockTime = ({
    lastBlockInfo,
  }: {
    lastBlockInfo: LastBlockInfo | null
  }) => {
    if (!lastBlockInfo) return null

    const blockDate = new Date(lastBlockInfo.time).getTime()
    const now = new Date().getTime()
    const secondsAgo = (now - blockDate) / 1000 // Разница во времени в секундах

    if (secondsAgo < 60) {
      return `${Math.floor(secondsAgo)} seconds ago`
    }

    return formatDistanceToNow(blockDate, { addSuffix: true })
  }

  useEffect(() => {
    const wsUrl =
      process.env.NEXT_PUBLIC_VALIDATORS_API_URL?.replace(
        /^http(s)?/,
        (match, p1) => `ws${p1 || ""}`
      ) + "/websocket"
    // const wsUrl = process.env.NEXT_PUBLIC_VALIDATORS_API_URL?.replace(/^http/, 'wss') + '/websocket' || 'wss://default-url.com/websocket';

    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log("WebSocket соединение установлено")
      ws.send(
        JSON.stringify({
          jsonrpc: "2.0",
          method: "subscribe",
          id: "0",
          params: {
            query: "tm.event = 'NewBlock'",
          },
        })
      )
    }

    ws.onmessage = (event) => {
      console.log("Получено сообщение:", event.data)
      const data = JSON.parse(event.data)
      const blockData = data?.result?.data?.value?.block
      const txCount = blockData?.data?.txs?.length || 0
      const blockTime = blockData?.header?.time
      const blockHeight = blockData?.header?.height

      if (blockHeight && blockTime) {
        setLastBlockInfo({
          height: blockHeight,
          time: blockTime,
          txCount: txCount,
        })
        setIsLoading(false)
      }
    }

    ws.onerror = (error) => {
      console.error("WebSocket ошибка:", error)
      setIsLoading(false)
    }

    return () => {
      ws.close()
    }
  }, [])

  if (isLoading) {
    return <Skeleton className="w-full h-6 my-2" />
  }

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className="text-slate-400 text-right">
            Last Block Height:
          </TableCell>
          <TableCell>{lastBlockInfo?.height}</TableCell>
          <TableCell className="text-slate-400 text-right">TX count:</TableCell>
          <TableCell>{lastBlockInfo?.txCount}</TableCell>
          <TableCell className="text-slate-400 text-right">
            Last Block Time:
          </TableCell>
          <TableCell>
            <LastBlockTime lastBlockInfo={lastBlockInfo} />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export default LastBlockComponent
