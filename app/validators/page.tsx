"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface Validator {
  address: string
  voting_power: string
}

interface ChainStatus {
  epoch: number;
  active_validators: number;
}

const ValidatorsPage: React.FC = () => {
  const [chainStatus, setChainStatus] = useState<ChainStatus>({ epoch: 0, active_validators: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [validators, setValidators] = useState<Validator[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState<number>(0);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilter(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchTotalValidators = async () => {
      const statusResponse = await fetch(
        `${process.env.NEXT_PUBLIC_INDEXER_API_URL}/chain/status`
      );
      const statusData = await statusResponse.json();
      return statusData.staking_info.active_validators;
    };

    const fetchChainStatus = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_INDEXER_API_URL}/chain/status`);
      const data = await response.json();
      setChainStatus({
        epoch: data.epoch,
        active_validators: data.staking_info.active_validators,
      });
    };

    const fetchValidators = async (totalValidators: number) => {
      const pagesRequired = Math.ceil(totalValidators / 100);
      let allValidators: Validator[] = [];

      for (let i = 1; i <= pagesRequired; i++) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_VALIDATORS_API_URL}/validators?page=${i}&per_page=100`
        );
        const data = await response.json();
        allValidators = [...allValidators, ...data.result.validators];
      }

      setValidators(allValidators);
      setTotalPages(Math.ceil(allValidators.length / pageSize));
      setIsLoading(false);
    };

    setIsLoading(true);

    fetchTotalValidators().then((totalValidators) => {
      fetchValidators(totalValidators);
    });
    fetchChainStatus();
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredValidators.length / pageSize));
  }, [filter, pageSize, validators]);

  const filteredValidators = validators.filter(validator => validator.address.includes(filter));
  const currentValidators = filteredValidators.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
    <div className="mb-4">
      <Label htmlFor="filter" className="block mb-2 text-sm font-medium text-gray-900">
        Filter by address
      </Label>
      <Input
        id="filter"
        type="text"
        value={filter}
        onChange={handleFilterChange}
        placeholder="Enter address..."
      />
    </div>
    {isLoading ? (
      <div>
        {/* Skeleton loading indicator for Table Caption */}
        <div className="pb-4">
          <Skeleton style={{ height: 20, width: 400 }} />
        </div>
        {/* Skeleton loading indicator for Table */}
        <Table>
          <TableHeader>
            <TableRow>
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
              <TableRow key={index}>
                <TableCell>
                  <Skeleton style={{ height: 20, width: 200 }} />
                </TableCell>
                <TableCell>
                  <Skeleton style={{ height: 20, width: 200 }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Pagination Skeleton */}
        <div>
          <Skeleton style={{ height: 20, width: 200 }} />
        </div>
      </div>
    ) : (
      <div>
        <Table>
          <TableCaption className="pb-4">
            Validators Overview - Epoch: {chainStatus.epoch}, Active Validators: {chainStatus.active_validators}
          </TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>Voting Power</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentValidators.map((validator, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Link href={`/validators/${validator.address}`} className="text-gray-400 hover:text-gray-600 visited:text-blue-600">
                    {validator.address}
                  </Link>
                </TableCell>
                <TableCell>
                  {(Number(validator.voting_power) / 1000000).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination>
          <PaginationContent>
            <PaginationPrevious
              onClick={goToPreviousPage}
              className="cursor-pointer"
            />
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => setCurrentPage(index + 1)}
                  isActive={currentPage === index + 1}
                  className="cursor-pointer"
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationNext onClick={goToNextPage} className="cursor-pointer" />
          </PaginationContent>
        </Pagination>
      </div>
    )}
  </div>
  );
};

export default ValidatorsPage;
