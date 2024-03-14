"use client";
import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";
import TransactionDetailsComponent from '@/components/TransactionDetailsComponent';

const TransactionDetailsPage: React.FC = () => {
  const pathname = usePathname();
  const [searchParams] = useSearchParams();
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  interface TransactionData {
    hash: string;
    block_id: string;
    tx_type: string;
    return_code?: number | null;
    // include other properties that the transaction might have
  }  

  
  useEffect(() => {
    // Extract tx_hash from the pathname, replace 'tx' with the actual path segment if different
    const txHash = pathname.split('/')[2];
    
    const fetchTransaction = async () => {
      if (!txHash) {
        setError('Transaction hash is missing from the URL.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_INDEXER_API_URL}/tx/${txHash}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTransactionData(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [pathname, searchParams]);

  if (loading) {
    return (
      <div className="p-5 space-y-4">
        <Skeleton className="w-full h-44" />
        <Skeleton className="w-full h-44" />
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      {transactionData && (
        <TransactionDetailsComponent
          transaction={transactionData}
          rawTransactionData={JSON.stringify(transactionData, null, 2)}
        />
      )}
    </div>
  );
};

export default TransactionDetailsPage;
