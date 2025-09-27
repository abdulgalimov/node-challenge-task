import { Static, Type } from "@sinclair/typebox";
import { Nullable } from "../../../types";

// Zod schema for token price update message
export const TokenPriceUpdateMessage = Type.Object({
  tokenId: Type.String(),
  symbol: Type.String(),
  oldPrice: Nullable(Type.String()),
  newPrice: Type.String(),
  timestamp: Type.Date(),
});

// Type derived from the schema
export type TokenPriceUpdateMessage = Static<typeof TokenPriceUpdateMessage>;

export type TokenPriceUpdateMessageCreate = Omit<
  TokenPriceUpdateMessage,
  "timestamp"
> & {
  timestamp?: Date;
};
