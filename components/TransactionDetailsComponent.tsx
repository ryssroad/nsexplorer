import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TransactionProps {
  hash: string;
  block_id: string;
  tx_type: string;
  return_code?: number | null;
  // Additional properties as needed...
}

interface TransactionDetailsComponentProps {
  transaction: TransactionProps;
  rawTransactionData: string; // JSON string of the full transaction data
}

const TransactionDetailsComponent: React.FC<TransactionDetailsComponentProps> = ({ transaction, rawTransactionData }) => {
  const getStatus = (returnCode: number | null | undefined) => {
    return returnCode === null || returnCode === 0 || returnCode === undefined ? 'Success' : 'Failed';
  };

  const status = getStatus(transaction.return_code);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Transaction Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Transaction Hash: {transaction.hash}</p>
          <p>Block Height: {transaction.block_id}</p>
          <p>Transaction Type: {transaction.tx_type}</p>
          <p>Status: {status}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Raw Data</CardTitle>
        </CardHeader>
        <CardContent>
          <pre>{rawTransactionData}</pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionDetailsComponent;