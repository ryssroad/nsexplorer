// pages/_app.tsx
import React from 'react';
import type { AppProps } from 'next/app';
import Layout from '@/app/layout';
import Navbar from '@/components/Navbar';
import "@/styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
