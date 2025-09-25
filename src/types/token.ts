import { z } from "zod";

/**
 * Zod schema for token validation
 */
export const TokenData = z.object({
  id: z.string().uuid(),
  address: z.instanceof(Buffer),
  symbol: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  decimals: z.number().int().min(0).max(32767).default(0), // smallint range
  isNative: z.boolean().default(false),
  chainId: z.string().uuid(),
  isProtected: z.boolean().default(false),
  lastUpdateAuthor: z.string().nullable().optional(),
  priority: z.number().int().default(0),
  timestamp: z.date().default(() => new Date()),

  // Denormalized logo data
  logo_Id: z.string().uuid(),
  logo_TokenId: z.string().uuid().nullable().optional(),
  logo_BigRelativePath: z.string(),
  logo_SmallRelativePath: z.string(),
  logo_ThumbRelativePath: z.string(),

  price: z.bigint().nonnegative().default(0n),
  lastPriceUpdate: z.date().default(() => new Date()),
});

/**
 * Type derived from the schema
 */
export type TokenData = z.infer<typeof TokenData>;

export const TokenCreateData = TokenData.omit({ id: true });

export type TokenCreateData = z.infer<typeof TokenCreateData>;
