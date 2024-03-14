"use client"

import React, { useEffect, useState } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
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
      const txResult = data?.result?.data?.value?.TxResult
      const txHash = data?.result?.events["tx.hash"][0] // Извлекаем хеш транзакции
      const txHeight = data?.result?.events["tx.height"][0]

      if (txResult && txHash && txHeight) {
        const newTransaction: TransactionData = {
          hash: txHash, // Используем извлеченный хеш
          height: txHeight, // Используем извлеченную высоту блока
          status:
            txResult.result !== null && txResult.result !== 0
              ? "success"
              : "failed", // Статус транзакции
        }
        setTransactions((prev) => [...prev, newTransaction])
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
      <TableHeader>
        <TableRow>
          <TableHead>Transaction Hash</TableHead>
          <TableHead>Height</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx, index) => (
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
