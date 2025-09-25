import { z } from "zod";

// Zod schema for token price update message
export const TokenPriceUpdateMessage = z.object({
  tokenId: z.string().uuid(),
  symbol: z.string().min(1),
  oldPrice: z.string(),
  newPrice: z.string(),
  timestamp: z.date(),
});

// Type derived from the schema
export type TokenPriceUpdateMessage = z.infer<typeof TokenPriceUpdateMessage>;

export type TokenPriceUpdateMessageCreate = Omit<
  TokenPriceUpdateMessage,
  "timestamp"
> & {
  timestamp?: Date;
};
