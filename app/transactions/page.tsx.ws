"use client"

import React, { useEffect, useState } from "react"

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

interface TransactionData {
  hash: string
  height: string
  status: "success" | "failed"
}

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ws = new WebSocket("wss://nam-rpc.systemd.run/websocket")

    ws.onopen = () => {
      console.log("WebSocket соединение установлено")
      ws.send(
        JSON.stringify({
          jsonrpc: "2.0",
          method: "subscribe",
          id: "0",
          params: {
            query: "tm.event = 'Tx'",
          },
        })
      )
    }

    ws.onmessage = (event) => {
      console.log("Получено сообщение:", event.data)
      const data = JSON.parse(event.data)

      const txEvents = data?.result?.events
      const txHashArray = txEvents ? txEvents["tx.hash"] : undefined
      const txHeightArray = txEvents ? txEvents["tx.height"] : undefined

      const txHash = txHashArray ? txHashArray[0] : "Unknown Hash"
      const txHeight = txHeightArray ? txHeightArray[0] : "Unknown Height"

      if (
        data?.result?.data?.value?.TxResult &&
        txHash !== "Unknown Hash" &&
        txHeight !== "Unknown Height"
      ) {
        const newTransaction = {
          hash: txHash,
          height: txHeight,
          status: "success", // Адаптируйте логику определения статуса, если нужно
        }

        setTransactions((prev) => [newTransaction, ...prev])
      }
      setLoading(false)
    }

    ws.onerror = (error) => {
      console.error("WebSocket ошибка:", error)
      setLoading(false)
    }

    ws.onclose = () => {
      console.log("WebSocket соединение закрыто")
      setLoading(false)
    }

    return () => {
      ws.close()
    }
  }, [])

  if (loading) {
    return <Skeleton className="w-full h-6 my-2" />
  }

  return (
    <Table>
      <TableCaption>last 10 txs onchain</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Transaction Hash</TableHead>
          <TableHead>Height</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.slice(0, 10).map((tx, index) => (
          <TableRow key={index}>
            <TableCell>{tx.hash}</TableCell>
            <TableCell>{tx.height}</TableCell>
            <TableCell>{tx.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default TransactionsPage
