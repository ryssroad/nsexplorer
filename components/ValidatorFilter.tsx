import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const [searchTerm, setSearchTerm] = useState('');
const filteredValidators = validators.filter(validator => 
    validator.address.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
const ValidatorFilter = ({ onSearchChange }) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="addressSearch">Filter by address</Label>
      <Input
        type="text"
        id="addressSearch"
        placeholder="Enter validator address"
        onChange={e => onSearchChange(e.target.value)}
      />
    </div>
  );
};