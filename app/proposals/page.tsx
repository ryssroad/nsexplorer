"use client"

import ProposalsTable from "@/components/ProposalsTable";
import React, { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton"

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
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [epoch, setEpoch] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const epochResponse = await fetch("https://nam-dex.systemd.run/chain/epoch/last");
      const epochData = await epochResponse.json();
      setEpoch(epochData.epoch);

      const proposalsResponse = await fetch("https://nam-dex.systemd.run/proposals/list");
      const proposalsData = await proposalsResponse.json();
      setProposals(proposalsData.proposals);
    };

    fetchData();
  }, []);

  const ongoingProposals = proposals.filter(p => p.voting_start_epoch <= epoch && p.voting_end_epoch >= epoch);
  const upcomingProposals = proposals.filter(p => p.voting_start_epoch > epoch);
  const endedProposals = proposals.filter(p => p.voting_end_epoch < epoch);

  const total_props = proposals.length;
  const upcoming_props = proposals.filter(p => p.voting_start_epoch > epoch).length;
  const ongoing_props = proposals.filter(p => p.voting_start_epoch <= epoch && p.voting_end_epoch >= epoch).length;

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 bg-slate-100 p-8 mb-8">
        <div className="text-sm text-muted-foreground">Epoch: {epoch}</div>
        <div className="text-sm text-muted-foreground">Total props: {total_props}</div>
        <div className="text-sm text-muted-foreground">Upcoming props: {upcoming_props}</div>
        <div className="text-sm text-muted-foreground">Ongoing props: {ongoing_props}</div>
      </div>
      <div>
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
    </div>
    </div>
  )
}

export default ProposalsPage
