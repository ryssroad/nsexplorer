"use client"

import React, { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
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
  email: string
  description: string
  website: string
  discord_handle: string
  avatar: string
}

interface ValidatorCommission {
  commission_rate: string
  max_commission_change_per_epoch: string
}

interface ValidatorUptime {
  uptime: number
}

interface ValidatorInfo {
  operator_address?: string
  missed_block_counter?: number
  nam_address?: string
  tm_address?: string
  metadata?: ValidatorMetadata
  stake?: string
  commission?: ValidatorCommission
  state?: string
  uptime?: ValidatorUptime
}

interface SigningInfo {
  validator_address: string
  tendermint_address: string
  missed_block_counter: number
}

interface Props {
  params: {
    address: string
  }
}

const ValidatorDetails: React.FC<Props> = ({ params }) => {
  const { address } = params
  const [validator, setValidator] = useState<ValidatorInfo | null>(null)

  // Fetch the signing information
  useEffect(() => {
    const fetchSigningInfo = async () => {
      try {
        console.log("Fetching signing information...")
        const response = await fetch(
          "https://api-namada.cosmostation.io/validator_siging_infos"
        )
        const data: SigningInfo[] = await response.json()
        console.log("Received data:", data)
        const specificSigningInfo = data.find(
          (info) => info.tendermint_address === address
        )
        if (specificSigningInfo) {
          console.log("Specific signing info found:", specificSigningInfo)
          setValidator((current) => ({
            ...current,
            operator_address: specificSigningInfo.validator_address,
            missed_block_counter: specificSigningInfo.missed_block_counter,
          }))
        } else {
          console.log("Validator not found for address:", address)
        }
      } catch (error) {
        console.error("Failed to fetch validator signing info:", error)
      }
    }
    fetchSigningInfo()
  }, [address]) // Depends only on address

  // Fetch the additional validator details
  useEffect(() => {
    const fetchValidatorInfo = async () => {
      if (!validator?.operator_address) {
        return
      }
      try {
        console.log("Fetching additional validator information...")
         const response = await fetch(
          `${process.env.NEXT_PUBLIC_INDEXER_API_URL}/validator/${validator.operator_address}/info`
        )
        const additionalData = await response.json()
        console.log("Received additional data:", additionalData)
        setValidator((current) => ({
          ...current,
          ...additionalData,
          metadata: additionalData.metadata,
          commission: additionalData.commission,
          uptime: additionalData.uptime,
        }))
      } catch (error) {
        console.error("Failed to fetch additional validator info:", error)
      }
    }

    fetchValidatorInfo()
  }, [validator?.operator_address]) // Depends on operator_address

  if (!validator) {
    return (
      <div className="pt-14">
        <Skeleton className="mb-4 w-full h-6 rounded" />
        <Skeleton className="mb-4 w-full h-6 rounded" />
        <Skeleton className="mb-4 w-full h-6 rounded" />
      </div>
    )
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Validator Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            {/* <TableCaption>Validator Details</TableCaption> */}
            {/* <TableHead> */}
            {/* <TableRow> */}
            {/* <TableHeader>Validator Details</TableHeader> */}
            {/* </TableRow> */}
            {/* </TableHead> */}
            <TableBody>
              <TableRow>
                <TableCell>State</TableCell>
                <TableCell style={{ color: validator.state === "consensus" ? "green" : "red" }}>{validator.state}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Uptime</TableCell>
                <TableCell>
                  {((validator.uptime?.uptime ?? 0) * 100).toFixed(2)}%
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>NAM Address</TableCell>
                <TableCell>{validator.nam_address}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>TM Address</TableCell>
                <TableCell>{validator.tm_address}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Stake</TableCell>
                <TableCell>
                  {(Number(validator.stake) / 1000000).toLocaleString()} NAAN
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Commission Rate</TableCell>
                <TableCell>
                  {Math.round(
                    (Number(validator.commission?.commission_rate) ?? 0) * 100
                  )}
                  %
                </TableCell>
              </TableRow>
              {/* <TableRow>
          <TableCell>Max Commission Change Per Epoch</TableCell>
          <TableCell>{Math.round((Number(validator.commission?.max_commission_change_per_epoch) ?? 0) * 100)}%</TableCell>
        </TableRow> */}
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>{validator.metadata?.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Website</TableCell>
                <TableCell>
                  {validator.metadata?.website ? (
                    <a
                      href={validator.metadata.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600 visited:text-blue-600"
                    >
                      {validator.metadata.website}
                    </a>
                  ) : (
                    "Not Provided"
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Discord Handle</TableCell>
                <TableCell>{validator.metadata?.discord_handle}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          {/* Add any additional footer content here if needed */}
        </CardFooter>
      </Card>
    </div>
    // <div className="max-w-4xl mx-auto my-8">

    //   <Card>
    //     <CardHeader className="flex items-center justify-between">
    //       <div>
    //         <CardTitle>Validator Details</CardTitle>
    //         <CardDescription>{address}</CardDescription>
    //       </div>

    //     </CardHeader>
    //     <CardContent className="grid gap-4">
    //     <div className=" flex items-center space-x-4 rounded-md border p-4">
    //     <Avatar>
    //         <AvatarImage src={validator.metadata?.avatar || "https://via.placeholder.com/150"} alt="Validator Avatar" className="w-12 h-12 rounded-full" />
    //         <AvatarFallback className="w-12 h-12 rounded-full bg-gray-200 text-gray-800">AV</AvatarFallback>
    //       </Avatar>
    //     </div>
    //       <Table>
    //         <TableBody>
    //           {/* Table rows */}
    //           <TableRow>
    //             <TableCell>Address</TableCell>
    //             <TableCell>{address}</TableCell>
    //           </TableRow>
    //           <TableRow>
    //             <TableCell>Operator Address</TableCell>
    //             <TableCell>{validator.operator_address || "N/A"}</TableCell>
    //           </TableRow>
    //           {/* Add more rows as needed */}
    //         </TableBody>
    //       </Table>
    //     </CardContent>
    //     <CardFooter>
    //       <p className="text-right text-sm text-gray-600">Additional information or actions</p>
    //     </CardFooter>
    //   </Card>
    // </div>
  )
}

export default ValidatorDetails
