import { Static, Type } from "@sinclair/typebox";

export const ChainNames = {
  Ethereum: "Ethereum",
  Bitcoin: "Bitcoin",
  Solana: "Solana",
} as const;

export type ChainNames = (typeof ChainNames)[keyof typeof ChainNames];

export const Chain = Type.Object({
  id: Type.String(),
  deId: Type.Number(),
  name: Type.Enum(ChainNames),
  isEnabled: Type.Boolean(),
});

export type Chain = Static<typeof Chain>;
