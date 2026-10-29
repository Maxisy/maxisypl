export const EMAIL = "maxisy@maxisy.pl";

export const socials = [
  { label: "GitHub", href: "https://github.com/Maxisy" },
  { label: "X", href: "https://twitter.com/maxisyit" },
  { label: "Email", href: `mailto:${EMAIL}` },
] as const;

export const ribbon = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind",
  "Node.js",
  "Python",
  "Java",
  "Solana",
  "Discord bots",
  "Vercel",
  "Scripts",
] as const;

export const projects = [
  {
    id: "surfaces",
    index: "01",
    title: "Product surfaces",
    era: "Now",
    summary:
      "Sites and web apps in React and Next.js. Tailwind as a system, not a skin. Shipped on Vercel.",
    details: [
      "Type, motion, and layout treated as engineering — the part people actually feel.",
      "Component systems that survive a redesign, not a one-off landing page.",
      "Restrained animation, a real hierarchy, and a mobile layout that isn’t an afterthought.",
    ],
    stack: ["React", "Next.js", "TypeScript", "Tailwind", "Vercel"],
  },
  {
    id: "chain",
    index: "02",
    title: "Solana drops & programs",
    era: "2021 —",
    summary:
      "Airdrops, holder snapshots, metadata, mint flows, and the pages that launched them.",
    details: [
      "SOL and NFT airdrops, snapshots, and metadata generated as a pipeline — not a spreadsheet.",
      "NFTs composed from layers, minted on Solana, with a launch page in front.",
      "Custom programs and client flows shaped around the collection.",
    ],
    stack: ["Solana", "TypeScript", "Web3.js", "Metadata"],
  },
  {
    id: "bots",
    index: "03",
    title: "Discord & community bots",
    era: "2021 —",
    summary:
      "Bots that run the unglamorous half of a community: raids, wallets, roles, verification.",
    details: [
      "A Twitter raid-to-earn bot and a wallet submission flow.",
      "Role and verification tooling so a server doesn’t live in one moderator’s notes.",
      "Node services wired to whatever the product was doing on-chain.",
    ],
    stack: ["Node.js", "TypeScript", "discord.js"],
  },
  {
    id: "scripts",
    index: "04",
    title: "Scripts for the boring part",
    era: "2017 —",
    summary:
      "Python, Java, and Node for the jobs that should never be done by hand.",
    details: [
      "Airdrop runners, snapshot pipelines, and metadata batches.",
      "Marketplace scripts, including a Magic Eden sniper.",
      "Repeatable, logged, and deliberately boring — so the interface can be the opposite.",
    ],
    stack: ["Python", "Java", "Node.js"],
  },
] as const;

export type ProjectId = (typeof projects)[number]["id"];

export const collaborations = [
  { name: "Alpha Pharaohs", href: "https://twitter.com/AlphaPharaohs" },
  { name: "Clarity DAO", href: "https://twitter.com/ClarityDAO" },
  { name: "BLXCKOUT", href: "https://twitter.com/blxckout_nft" },
  { name: "Mythical Town", href: "https://twitter.com/MythicalTownNFT" },
  { name: "SOL Revenue Share", href: "https://twitter.com/SOL_Scripts" },
] as const;

export const chapters = [
  {
    year: "2017",
    title: "Java",
    body: "Where it started. Systems that have to keep working after the interesting part is over. Still the instinct I trust when something needs to be correct more than clever.",
  },
  {
    year: "2020",
    title: "Python",
    body: "Scripts, automation, and the moment I stopped doing repetitive work by hand. Most of the tooling since then begins as a script that earned the right to become a product.",
  },
  {
    year: "2021",
    title: "Solana & Discord",
    body: "Blockchain, learned by shipping. Airdrops, snapshots, mint pages, custom programs, and the bots that kept communities standing. Collections I worked with include Alpha Pharaohs, Clarity DAO, BLXCKOUT, Mythical Town, and SOL Revenue Share.",
  },
  {
    year: "Now",
    title: "The interface",
    body: "React, Next.js, TypeScript, Tailwind, Vercel. The same practice, pointed at the surface people actually touch. The chain work didn’t go away. The websites finally match it.",
  },
] as const;

export const stackItems = [
  {
    name: "React",
    group: "Interface",
    line: "Component architecture and state, built so a third redesign doesn’t require a rewrite.",
  },
  {
    name: "Next.js",
    group: "Interface",
    line: "Product surfaces with routing and a deploy story. Not a folder of components hoping someone else will ship them.",
  },
  {
    name: "TypeScript",
    group: "Interface",
    line: "The default language across the interface, the API, and the scripts. Edge cases show up in the editor.",
  },
  {
    name: "Tailwind",
    group: "Interface",
    line: "Tokens, rhythm, and components that agree with each other. A system, not a pile of one-off classes.",
  },
  {
    name: "Node.js",
    group: "Runtime",
    line: "APIs, bots, and workers. The glue between a product and everything it has to talk to.",
  },
  {
    name: "Python",
    group: "Runtime",
    line: "Since 2020. Snapshots, automation, and scripts that replace a week of clicking.",
  },
  {
    name: "Java",
    group: "Runtime",
    line: "Since 2017. The language I learned in order to build software that has to keep working.",
  },
  {
    name: "Solana",
    group: "Chain",
    line: "Airdrops, metadata, mint flows, custom programs, and apps that actually talk to the chain.",
  },
  {
    name: "Discord",
    group: "Community",
    line: "Bots for raids, wallet gates, roles, and the daily operations of a server.",
  },
  {
    name: "Vercel",
    group: "Ship",
    line: "Where the interface ships. Previews, production, and a URL that isn’t apologizing.",
  },
] as const;

export const stackGroups = ["All", "Interface", "Runtime", "Chain", "Community", "Ship"] as const;

export const projectKinds = [
  "Website",
  "Web app",
  "Solana",
  "Discord bot",
  "Script / automation",
  "Not sure yet",
] as const;
