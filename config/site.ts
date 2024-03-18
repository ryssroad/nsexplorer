export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "NSExp",
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
      href: "/transactions",
    },
    {
      title: "Validators",
      href: "/validators",
    },
    {
      title: "Proposals",
      href: "/proposals",
    }
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
}
