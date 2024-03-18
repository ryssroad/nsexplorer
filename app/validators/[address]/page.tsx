"use client"

import React, { useEffect, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ValidatorMetadata {
  email: string;
  description: string;
  website: string;
  discord_handle: string;
  avatar: string;
}

interface ValidatorCommission {
  commission_rate: string;
  max_commission_change_per_epoch: string;
}

interface ValidatorUptime {
  uptime: number;
}

interface ValidatorInfo {
  operator_address?: string;
  missed_block_counter?: number;
  nam_address?: string;
  tm_address?: string;
  metadata?: ValidatorMetadata;
  stake?: string;
  commission?: ValidatorCommission;
  state?: string;
  uptime?: ValidatorUptime;
}

interface SigningInfo {
  validator_address: string;
  tendermint_address: string;
  missed_block_counter: number;
}

interface Props {
  params: {
    address: string;
  };
}

const ValidatorDetails: React.FC<Props> = ({ params }) => {
  const { address } = params;
  const [validator, setValidator] = useState<ValidatorInfo | null>(null);

  // Fetch the signing information
  useEffect(() => {
    const fetchSigningInfo = async () => {
      try {
        console.log("Fetching signing information...");
        const response = await fetch("https://api-namada.cosmostation.io/validator_siging_infos");
        const data: SigningInfo[] = await response.json();
        console.log("Received data:", data);
        const specificSigningInfo = data.find(info => info.tendermint_address === address);
        if (specificSigningInfo) {
          console.log("Specific signing info found:", specificSigningInfo);
          setValidator(current => ({
            ...current,
            operator_address: specificSigningInfo.validator_address,
            missed_block_counter: specificSigningInfo.missed_block_counter,
          }));
        } else {
          console.log("Validator not found for address:", address);
        }
      } catch (error) {
        console.error("Failed to fetch validator signing info:", error);
      }
    };
    fetchSigningInfo();
  }, [address]); // Depends only on address

  // Fetch the additional validator details
  useEffect(() => {
    const fetchValidatorInfo = async () => {
      if (!validator?.operator_address) {
        return;
      }
      try {
        console.log("Fetching additional validator information...");
        const response = await fetch(`https://namdex.ixtab.xyz/validator/${validator.operator_address}/info`);
        const additionalData = await response.json();
        console.log("Received additional data:", additionalData);
        setValidator(current => ({
          ...current,
          ...additionalData,
          metadata: additionalData.metadata,
          commission: additionalData.commission,
          uptime: additionalData.uptime,
        }));
      } catch (error) {
        console.error("Failed to fetch additional validator info:", error);
      }
    };

    fetchValidatorInfo();
  }, [validator?.operator_address]); // Depends on operator_address

  if (!validator) {
    return <div>Loading or no validator found...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto my-8">
      <Card className="shadow-xl rounded-lg overflow-hidden">
        <CardHeader className="p-4">
          <CardTitle className=" text-">Validator Overview</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between items-center p-4">
          <div>
          <Avatar>
            <AvatarImage src={validator.metadata?.avatar || "https://via.placeholder.com/150"} alt="Validator Avatar" className="w-12 h-12 rounded-full" />
            <AvatarFallback className="w-20 h-20 rounded-md bg-gray-200 text-gray-800">AV</AvatarFallback>
          </Avatar>
          </div>
          <p>
            <div className="text-sm text-gray-400">Validator Address</div>
            <div className="text-base">{address}</div>
          </p>
          <p>
            <div className="text-sm text-gray-400">Account Address</div>
            <div className="text-base">{validator.operator_address || "N/A"}</div>
            </p>
        </CardContent>
      </Card>
      <div className="w-full min-h-screen">
  <div className="max-w-screen-md px-10 py-6 mx-4 mt-20 bg-white rounded-lg shadow md:mx-auto border-1">
    <div className="flex flex-col items-start w-full m-auto sm:flex-row">
      <div className="flex mx-auto sm:mr-10 sm:m-0">
        <div className="items-center justify-center w-20 h-20 m-auto mr-4 sm:w-32 sm:h-32">
          <img alt="profil"
            src="https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8bWFufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
            className="object-cover w-20 h-20 mx-auto rounded-full sm:w-32 sm:h-32" />
        </div>
      </div>
      <div className="flex flex-col pt-4 mx-auto my-auto sm:pt-0 sm:mx-0">
        <div className="flex flex-col mx-auto sm:flex-row sm:mx-0 ">
          <h2 className="flex pr-4 text-xl font-light text-gray-900 sm:text-3xl">AlexNoah7</h2>
          <div className="flex">
            <a
              className="flex items-center px-1 text-sm font-medium text-gray-900 bg-transparent border border-gray-600 rounded outline-none sm:ml-2 hover:bg-blue-600 hover:text-white focus:outline-none hover:border-blue-700">Edit
              profile</a>
            <a className="p-1 ml-2 text-gray-700 border-transparent rounded-full cursor-pointer hover:text-blue-600 focus:outline-none focus:text-gray-600"
              aria-label="Notifications">
              <svg className="w-4 h-4 sm:w-8 sm:h-8" fill="none" stroke-linecap="round" stroke-linejoin="round"
                stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 space-x-2">
          <div className="flex"><span className="mr-1 font-semibold">55 </span> Post</div>
          <div className="flex"><span className="mr-1 font-semibold">10k </span> Follower</div>
          <div className="flex"><span className="mr-1 font-semibold">20</span> Following</div>
        </div>
      </div>
    </div>
    <div className="w-full pt-5">
      <h1 className="text-lg font-semibold text-gray-800 sm:text-xl">Alexander Noah</h1>
      <p className="text-sm text-gray-500 md:text-base">Fotografer</p>
      <p className="text-sm text-gray-800 md:text-base">Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Cupiditate, quam?</p>
    </div>
  </div>
</div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Validator Details</CardTitle>
            <CardDescription>{address}</CardDescription>
          </div>
          
        </CardHeader>
        <CardContent className="grid gap-4">
        <div className=" flex items-center space-x-4 rounded-md border p-4">
        <Avatar>
            <AvatarImage src={validator.metadata?.avatar || "https://via.placeholder.com/150"} alt="Validator Avatar" className="w-12 h-12 rounded-full" />
            <AvatarFallback className="w-12 h-12 rounded-full bg-gray-200 text-gray-800">AV</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Push Notifications
            </p>
            <p className="text-sm text-muted-foreground">
              Send notifications to device.
            </p>
          </div>
        </div>
          <Table>
            <TableBody>
              {/* Table rows */}
              <TableRow>
                <TableCell>Address</TableCell>
                <TableCell>{address}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Operator Address</TableCell>
                <TableCell>{validator.operator_address || "N/A"}</TableCell>
              </TableRow>
              {/* Add more rows as needed */}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <p className="text-right text-sm text-gray-600">Additional information or actions</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ValidatorDetails
