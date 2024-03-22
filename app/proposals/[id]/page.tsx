"use client"

import { log } from "console"
import React, { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

interface ProposalContent {
  abstract: string
  authors: string
  created: string
  details: string
  "discussions-to": string
  license: string
  motivation: string
  requires?: string
  title: string
}

interface Proposal {
  id: number
  content: ProposalContent
  author: string
  type: { [key: string]: any[] } // Обновлено для поддержки разнообразных структур данных
  voting_start_epoch: number
  voting_end_epoch: number
  grace_epoch: number
}

const ProposalDetailsPage: React.FC = () => {
  const pathname = usePathname()
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const proposalId = pathname.split("/").pop()

  useEffect(() => {
    if (proposalId) {
      const fetchProposalDetails = async () => {
        try {
          const response = await fetch(
            `https://nam-dex.systemd.run/proposals/${proposalId}/info`
          )
          if (!response.ok) {
            throw new Error("Network response was not ok")
          }
          const data: Proposal = await response.json()
          setProposal(data)
          console.log(data)
        } catch (error) {
          console.error("Error fetching proposal:", error)
        }
      }

      fetchProposalDetails()
    }
  }, [proposalId])

  if (!proposal) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="grid grid-flow-col gap-4 bg-slate-100 p-8 mb-8 justify-items-start">
        <div className="text-sm text-muted-foreground">Voting Start Epoch:</div><div className="text-green-600 text-sm"> {proposal.voting_start_epoch}</div>
        <div className="text-sm text-muted-foreground">Voting End Epoch:</div><div className="text-red-600 text-sm"> {proposal.voting_end_epoch}</div>
        <div className="text-sm text-muted-foreground">Grace Epoch:</div><div className="text-sm">{proposal.grace_epoch}</div>
      </div>
    <Table>
      <TableBody>
        {/* Динамически создаем строки таблицы на основе данных предложения */}
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>{proposal.content.title}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Abstract</TableCell>
          <TableCell>{proposal.content.abstract}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Authors</TableCell>
          <TableCell>{proposal.content.authors}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Created</TableCell>
          <TableCell>{proposal.content.created}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Details</TableCell>
          <TableCell>{proposal.content.details}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Discussions to</TableCell>
          <TableCell>
            <a
              href={proposal.content["discussions-to"]}
              target="_blank"
              rel="noopener noreferrer"
            >
              {proposal.content["discussions-to"]}
            </a>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>License</TableCell>
          <TableCell>{proposal.content.license}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Motivation</TableCell>
          <TableCell>{proposal.content.motivation}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Requires</TableCell>
          <TableCell>{proposal.content.requires || "N/A"}</TableCell>
        </TableRow>

        {/* Дополнительно: Визуализация типа предложения */}
        <TableRow>
          <TableCell>Type</TableCell>
          <TableCell>{JSON.stringify(proposal.type)}</TableCell>
        </TableRow>
      </TableBody>
      {/* <TableBody>
        <TableRow>
          <TableCell className="text-slate-400 text-right">
            Voting Start Epoch
          </TableCell>
          <TableCell>{proposal.voting_start_epoch}</TableCell>
          <TableCell className="text-slate-400 text-right">
            Voting End Epoch
          </TableCell>
          <TableCell>{proposal.voting_end_epoch}</TableCell>
          <TableCell className="text-slate-400 text-right">
            Grace Epoch
          </TableCell>
          <TableCell>{proposal.grace_epoch}</TableCell>
        </TableRow>
      </TableBody> */}
    </Table>
    </div>
  )
}

export default ProposalDetailsPage
