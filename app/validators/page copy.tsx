"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Validator {
  address: string;
  pub_key: {
    type: string;
    value: string;
  };
  voting_power: number;
  proposer_priority: string;
  voting_percentage: number;
  moniker: string;
  operator_address: string;
}

const ValidatorsPage: React.FC = () => {
  const [validators, setValidators] = useState<Validator[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchValidators = async () => {
      const response = await fetch(
        "https://namada-explorer-api.stakepool.dev.br/node/validators/list"
      );
      const data = await response.json();
      setValidators(data.currentValidatorsList);
    };

    fetchValidators();
  }, []);

  const pageSize = 10;
  const pageCount = Math.ceil(validators.length / pageSize);
  const filteredValidators = validators.filter((validator) =>
    validator.address.toLowerCase().includes(filter.toLowerCase())
  );

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedValidators = filteredValidators.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
        <div className="static top-0 right-0 w-full max-w-sm flex justify-items-end pr-4 pt-4 pb-4">
        <Label htmlFor="filter" className="sr-only">
          Filter
        </Label>
        <input
          type="text"
          id="filter"
          placeholder="Address hex filter"
          value={filter}
          onChange={handleFilterChange}
          className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none"
        />
      </div>
      <Table>
        <TableCaption>Validators</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Moniker</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Voting Power</TableHead>
            <TableHead>Voting Percentage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedValidators.map((validator) => (
            <TableRow key={validator.address}>
              <TableCell>{validator.moniker ? validator.moniker : '---'}</TableCell>
              <TableCell>
                <Link
                  className="text-gray-400 hover:text-gray-600 visited:text-blue-600"
                  href={`/validators/${validator.address}`}
                  >
                  {validator.address}
                </Link>
              </TableCell>
              <TableCell>
                {(validator.voting_power / 1000000).toLocaleString()} NAAN
              </TableCell>
              <TableCell>{validator.voting_percentage.toFixed(2)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => goToPage(currentPage - 1)} className="cursor-pointer"/>
            </PaginationItem>
            {[...Array(pageCount)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => goToPage(index + 1)}
                  isActive={currentPage === index + 1}
                  className="cursor-pointer"
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext onClick={() => goToPage(currentPage + 1)} className="cursor-pointer"/>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ValidatorsPage;
