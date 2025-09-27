import { TSchema, Type } from "@sinclair/typebox";

export function Nullable<T extends TSchema>(T: T) {
  return Type.Union([T, Type.Null()]);
}
