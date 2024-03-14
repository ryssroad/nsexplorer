import Link from 'next/link';
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
        <Link href="/blocks" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Blocks</Link>
        <Link href="/transactions" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Transactions</Link>
        <Link href="/proposals" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Proposals</Link>
      </div>
    </nav>
  );
};

export default Navbar;
