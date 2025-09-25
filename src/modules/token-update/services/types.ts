import { TokenData } from "../../../types";

export type UpdatePriceResponse = {
  newToken: TokenData;
  oldPrice: bigint;
};
