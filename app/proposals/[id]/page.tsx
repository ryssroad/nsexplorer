"use client";
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// Интерфейсы для предложения и его содержимого
interface ProposalContent {
  abstract: string;
  authors: string;
  created: string;
  details: string;
  discussionsTo: string;
  license: string;
  motivation: string;
  requires?: string;
  title: string;
}

interface Proposal {
  id: number;
  content: ProposalContent;
  author: string;
  type: string;
  votingStartEpoch: number;
  votingEndEpoch: number;
  graceEpoch: number;
}

const ProposalDetailsPage: React.FC = () => {
  const pathname = usePathname();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const proposalId = pathname.split('/').pop();

  useEffect(() => {
    if (proposalId) {
      const fetchProposalDetails = async () => {
        try {
          const response = await fetch(`https://nam-dex.systemd.run/proposals/${proposalId}/info`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data: Proposal = await response.json();
          setProposal(data);
        } catch (error) {
          console.error('Error fetching proposal:', error);
        }
      };

      fetchProposalDetails();
    }
  }, [proposalId]);

  if (!proposal) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{proposal.content.title}</h1>
      <p><strong>Abstract:</strong> {proposal.content.abstract}</p>
      {/* ... Добавьте больше деталей предложения по вашему усмотрению */}
    </div>
  );
};

export default ProposalDetailsPage;