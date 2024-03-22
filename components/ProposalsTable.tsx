"use client"

import React, { Dispatch, SetStateAction } from "react"
import Link from "next/link"

import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ProposalContent {
  abstract: string
  authors: string
  created: string
  details: string
  "discussions-to": string
  license: string
  motivation: string
  title: string
}

interface Proposal {
  id: number
  content: ProposalContent
  author: string
  type: any
  voting_start_epoch: number
  voting_end_epoch: number
  grace_epoch: number
}

interface ProposalsTableProps {
  proposals: Proposal[]
  caption: string
  currentPage?: number
  setCurrentPage?: Dispatch<SetStateAction<number>>
}

const ProposalsTable: React.FC<ProposalsTableProps> = ({
  proposals,
  caption,
}) => {
  return (
    <div className="pb-4">
      <ScrollArea className="h-[700px] w-full rounded-md border p-4">
        <Table>
          <TableCaption>{caption}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Abstract</TableHead>
              <TableHead>Author</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proposals.map((proposal) => (
              <TableRow key={proposal.id}>
                <TableCell>
                  <Link
                    href={`/proposals/${proposal.id}`}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    {proposal.id}
                  </Link>
                </TableCell>
                <TableCell className="truncate max-w-xs">
                  {proposal.content.title}
                </TableCell>
                <TableCell className="truncate max-w-xs">
                  {proposal.content.abstract}
                </TableCell>
                <TableCell>{proposal.author}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}

export default ProposalsTable
