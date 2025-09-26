import { Static, Type } from "@sinclair/typebox";
import { Nullable } from "./utils";

export const Token = Type.Object({
  id: Type.String(),
  address: Type.String(),
  symbol: Type.String(),
  name: Type.String(),
  decimals: Type.Number(),
  isNative: Type.Boolean(),
  chainId: Type.String(),
  isProtected: Type.Boolean(),
  lastUpdateAuthor: Nullable(Type.String()),
  priority: Type.Number(),
  lastPriceUpdate: Nullable(Type.Date()),
  price: Type.BigInt(),
});

export type Token = Static<typeof Token>;
