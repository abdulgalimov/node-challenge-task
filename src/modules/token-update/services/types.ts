import { Token } from "../../../types";

export type UpdatePriceResponse = {
  newToken: Token;
  oldPrice: bigint;
};
