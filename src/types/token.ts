import { z } from "zod";

/**
 * Zod schema for token validation
 */
export const TokenData = z.object({
  id: z.string().uuid().optional(), // Optional for new tokens
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

/**
 * Helper function to validate token data
 */
export function validateToken(data: Partial<TokenData>): TokenData {
  return TokenData.parse(data);
}

/**
 * Helper function to validate partial token data (for updates)
 */
export function validatePartialToken(
  data: Partial<TokenData>
): Partial<TokenData> {
  return TokenData.partial().parse(data);
}
