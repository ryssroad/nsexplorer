// components/BlockDetailsComponent.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { BlockDetails } from "@/app/types/blockDetails";

type BlockDetailsProps = {
  blockDetails: BlockDetails | null;
};

const BlockDetailsComponent: React.FC<BlockDetailsProps> = ({ blockDetails }) => {
  if (!blockDetails) return <p>No block details available.</p>;

  // Отформатируем дату и время для отображения
  const formattedTime = new Date(blockDetails.header.time).toLocaleString();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Block Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Height:</TableCell>
              <TableCell>{blockDetails.header.height}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Hash:</TableCell>
              <TableCell>{blockDetails.block_id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Proposer:</TableCell>
              <TableCell>{blockDetails.header.proposer_address}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Time:</TableCell>
              <TableCell>{formattedTime}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BlockDetailsComponent;
