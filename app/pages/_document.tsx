// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { cn } from "@/lib/utils"
import { fontSans } from "@/lib/fonts"

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
        </body>
      </Html>
    );
  }
}

export default MyDocument;
