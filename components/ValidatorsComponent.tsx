// components/ValidatorsComponent.tsx

import React, { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Validator } from "@/app/types/validator";
import { Separator } from "@/components/ui/separator"

type ValidatorsProps = {
  validators: Validator[];
  height: string;
};

const ValidatorsComponent: React.FC<ValidatorsProps> = ({ validators, height }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Signatures</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {validators.map((validator, index) => (
              <TableRow key={index}>
                <TableCell>{validator.address}</TableCell>
                <TableCell>{validator.voting_power}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <Separator className="my-4" />
      <CardFooter>
        <a href={`${process.env.NEXT_PUBLIC_VALIDATORS_API_URL}/validators?height=${height}&page=1&per_page=100`}
           target="_blank" rel="noopener noreferrer">
          <p className="text-slate-400 hover:text-sky-400"> Only first 10 signatures listed, full list available at this link.</p>
        </a>
      </CardFooter>
    </Card>
  );
};

export default ValidatorsComponent;
