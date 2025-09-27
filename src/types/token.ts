import { Static, Type } from "@sinclair/typebox";
import { Nullable } from "./utils";

export const Token = Type.Object({
  id: Type.String(),
  address: Type.String(),
  symbol: Type.String(),
  name: Type.String(),
  decimals: Type.Number(),
  isNative: Type.Boolean(),
  isProtected: Type.Boolean(),
  priority: Type.Number(),
  logoId: Type.String(),
  chainId: Type.String(),
  priceId: Nullable(Type.String()),
});

export type Token = Static<typeof Token>;
