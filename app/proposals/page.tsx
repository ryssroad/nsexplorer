"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProposalsTable from "@/components/ProposalsTable";

interface ProposalContent {
  abstract: string;
  authors: string;
  created: string;
  details: string;
  "discussions-to": string;
  license: string;
  motivation: string;
  title: string;
}

interface Proposal {
  id: number;
  content: ProposalContent;
  author: string;
  type: any;
  voting_start_epoch: number;
  voting_end_epoch: number;
  grace_epoch: number;
}

const ProposalsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [epoch, setEpoch] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const epochResponse = await fetch("https://nam-dex.systemd.run/chain/epoch/last");
        const epochData = await epochResponse.json();
        setEpoch(epochData.epoch);

        const proposalsResponse = await fetch("https://nam-dex.systemd.run/proposals/list");
        const proposalsData = await proposalsResponse.json();
        setProposals(proposalsData.proposals);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setIsLoading(false); // Загрузка завершена
      }
    };
    fetchData();
  }, []);

  const ongoingProposals = proposals.filter(
    (p) => p.voting_start_epoch <= epoch && p.voting_end_epoch >= epoch
  );

  const upcomingProposals = proposals.filter(
    (p) => p.voting_start_epoch > epoch
  );

  const endedProposals = proposals.filter((p) => p.voting_end_epoch < epoch);

  const totalProps = proposals.length;
  const upcomingProps = upcomingProposals.length;
  const ongoingProps = ongoingProposals.length;

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
        <Tabs defaultValue="current" className="w-full">
          <TabsList>
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="ended">Ended</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            <ProposalsTable proposals={ongoingProposals} caption="Current Proposals" />
          </TabsContent>

          <TabsContent value="upcoming">
            <ProposalsTable proposals={upcomingProposals} caption="Upcoming Proposals" />
          </TabsContent>

          <TabsContent value="ended">
            <ProposalsTable proposals={endedProposals} caption="Ended Proposals" />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ProposalsPage;
