"use client";

import React, { useEffect, useState } from "react"
import { Table, TableBody, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProposalsTable from "@/components/ProposalsTable"

// Импорт компонента пагинации

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

const ProposalsPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [epoch, setEpoch] = useState<number>(0)
//   const [currentPage, setCurrentPage] = useState(1) // Текущая страница для пагинации
  const [currentOngoingPage, setCurrentOngoingPage] = useState(1)
  const [currentUpcomingPage, setCurrentUpcomingPage] = useState(1)
  const [currentEndedPage, setCurrentEndedPage] = useState(1)
  const itemsPerPage = 10 // Количество элементов на странице

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const epochResponse = await fetch(
          "https://nam-dex.systemd.run/chain/epoch/last"
        )
        const epochData = await epochResponse.json()
        setEpoch(epochData.epoch)

        const proposalsResponse = await fetch(
          "https://nam-dex.systemd.run/proposals/list"
        )
        const proposalsData = await proposalsResponse.json()
        setProposals(proposalsData.proposals)
      } catch (error) {
        console.error("Ошибка загрузки данных:", error)
      } finally {
        setIsLoading(false) // Загрузка завершена
      }
    }
    fetchData()
  }, [])

  console.log(proposals);
  const ongoingProposals = Array.isArray(proposals) ? proposals.filter(
    p => p.voting_start_epoch <= epoch && p.voting_end_epoch >= epoch
  ) : [];

  const paginatedOngoingProposals = ongoingProposals.slice(
    (currentOngoingPage - 1) * itemsPerPage,
    currentOngoingPage * itemsPerPage
  )

  const upcomingProposals = proposals && proposals.filter(
    (p) => p.voting_start_epoch > epoch
  );

  const paginatedUpcomingProposals = upcomingProposals.slice(
    (currentUpcomingPage - 1) * itemsPerPage,
    currentUpcomingPage * itemsPerPage
  )

  const endedProposals = proposals.filter((p) => p.voting_end_epoch < epoch)
  const paginatedEndedProposals = endedProposals.slice(
    (currentEndedPage - 1) * itemsPerPage,
    currentEndedPage * itemsPerPage
  )

  const totalProps = proposals.length
  const upcomingProps = upcomingProposals.length
  const ongoingProps = ongoingProposals.length

  // Функции для управления пагинацией
//   const handlePrevious = () => setCurrentPage(currentPage - 1)
//   const handleNext = () => setCurrentPage(currentPage + 1)
//   const totalPages = Math.ceil(proposals.length / itemsPerPage)

  return (
    <div>
          <div className="grid grid-cols-4 gap-4 bg-slate-100 p-8 mb-8">
            <div className="text-sm text-muted-foreground">Epoch: {epoch}</div>
            <div className="text-sm text-muted-foreground">
              Total props: {totalProps}
            </div>
            <div className="text-sm text-muted-foreground">
              Upcoming props: {upcomingProps}
            </div>
            <div className="text-sm text-muted-foreground">
              Ongoing props: {ongoingProps}
            </div>
          </div>
          {isLoading ? (
      <div>
        {/* Skeleton loading indicator for Table Caption */}
        <div className="pb-4">
          <Skeleton style={{ height: 20, width: 200 }} />
        </div>
        {/* Skeleton loading indicator for Table */}
        <Table>
          <TableHeader>
            <TableRow key="1">
              <TableHead>
                <Skeleton style={{ height: 20   , width: 50 }} />
              </TableHead>
              <TableHead>
                <Skeleton style={{ height: 20, width: 200 }} />
              </TableHead>
              <TableHead>
                <Skeleton style={{ height: 20, width: 200 }} />
              </TableHead>
              <TableHead>
                <Skeleton style={{ height: 20, width: 200 }} />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                <TableCell>
                  <Skeleton style={{ height: 20, width: 50 }} />
                </TableCell>
                <TableCell>
                  <Skeleton style={{ height: 20, width: 300 }} />
                </TableCell>
                <TableCell>
                  <Skeleton style={{ height: 20, width: 300 }} />
                </TableCell>
                <TableCell>
                  <Skeleton style={{ height: 20, width: 300 }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    ) : (
        <>
          {/* Вкладки с предложениями */}
          <Tabs defaultValue="current" className="w-full">
            <TabsList>
              <TabsTrigger value="current">Current</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="ended">Ended</TabsTrigger>
            </TabsList>

            <TabsContent value="current">
              <ProposalsTable
                proposals={paginatedOngoingProposals} 
                caption="Current Proposals"
              />
              <Pagination className="pb-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentOngoingPage((currentPage) =>
                          Math.max(1, currentPage - 1)
                        )
                      }
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                  {Array.from(
                    {
                      length: Math.ceil(ongoingProposals.length / itemsPerPage),
                    },
                    (_, i) => (
                      <PaginationItem key={`ongoing-${i}`}>
                        <PaginationLink
                          onClick={() => setCurrentOngoingPage(i + 1)}
                          className="cursor-pointer"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentOngoingPage((currentPage) =>
                          Math.min(
                            currentPage + 1,
                            Math.ceil(ongoingProposals.length / itemsPerPage)
                          )
                        )
                      }
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </TabsContent>

            <TabsContent value="upcoming">
              <ProposalsTable
                proposals={paginatedUpcomingProposals} // Используйте непосредственно paginatedUpcomingProposals
                caption="Upcoming Proposals"
              />
              <Pagination className="pb-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentUpcomingPage((currentPage) =>
                          Math.max(1, currentPage - 1)
                        )
                      }
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                  {Array.from(
                    {
                      length: Math.ceil(
                        upcomingProposals.length / itemsPerPage
                      ),
                    },
                    (_, i) => (
                      <PaginationItem key={`upcoming-${i}`}>
                        <PaginationLink
                          onClick={() => setCurrentUpcomingPage(i + 1)}
                          className="cursor-pointer"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentUpcomingPage((currentPage) =>
                          Math.min(
                            currentPage + 1,
                            Math.ceil(upcomingProposals.length / itemsPerPage)
                          )
                        )
                      }
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </TabsContent>

            <TabsContent value="ended">
              <ProposalsTable
                proposals={paginatedEndedProposals}
                caption="Ended Proposals"
              />
              <Pagination className="pb-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentEndedPage((currentPage) =>
                          Math.max(1, currentPage - 1)
                        )
                      }
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                  {Array.from(
                    { length: Math.ceil(endedProposals.length / itemsPerPage) },
                    (_, i) => {
                      const page = i + 1
                      // Показывать начальные страницы, текущую страницу и конечные страницы
                      const isPageVisible =
                        page === 1 ||
                        page ===
                          Math.ceil(endedProposals.length / itemsPerPage) ||
                        (page >= currentEndedPage - 2 &&
                          page <= currentEndedPage + 2)

                      // Многоточие перед текущей страницей, если есть скрытые страницы перед ней
                      const showPreviousEllipsis =
                        currentEndedPage > 4 && i === 2
                      // Многоточие после текущей страницы, если есть скрытые страницы после неё
                      const showNextEllipsis =
                        currentEndedPage <
                          Math.ceil(endedProposals.length / itemsPerPage) - 3 &&
                        i ===
                          Math.ceil(endedProposals.length / itemsPerPage) - 3

                      return (
                        <>
                          {showPreviousEllipsis && (
                            <PaginationItem key="ellipsis-prev">
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}
                          {isPageVisible && (
                            <PaginationItem key={`ended-${i}`}>
                              <PaginationLink
                                onClick={() => setCurrentEndedPage(page)}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          )}
                          {showNextEllipsis && (
                            <PaginationItem key="ellipsis-next">
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}
                        </>
                      )
                    }
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentEndedPage((currentPage) =>
                          Math.min(
                            currentPage + 1,
                            Math.ceil(endedProposals.length / itemsPerPage)
                          )
                        )
                      }
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

export default ProposalsPage
