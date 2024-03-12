export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "namEx",
  description:
    "Exerimental Namada SE explorer",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Blocks",
      href: "/blocks",
    },
    {
      title: "Transactions",
      href: "/txs",
    },
    {
      title: "Proposals",
      href: "/govs",
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
}
