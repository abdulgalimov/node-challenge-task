export const ChainNames = {
  Ethereum: "Ethereum",
  Bitcoin: "Bitcoin",
  Solana: "Solana",
} as const;

export type ChainNames = (typeof ChainNames)[keyof typeof ChainNames];
