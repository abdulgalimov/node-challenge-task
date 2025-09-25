import { z } from "zod";

/**
 * Zod schema for chain validation
 */
export const ChainData = z.object({
  id: z.string().uuid(),
  deId: z.number(),
  name: z.string(),
  isEnabled: z.boolean().default(true),
});

/**
 * Type derived from the schema
 */
export type ChainData = z.infer<typeof ChainData>;

/**
 * Helper function to validate chain data
 */
export function validateChain(data: Partial<ChainData>): ChainData {
  return ChainData.parse(data);
}
