import { Static, Type } from "@sinclair/typebox";

export const LogoInfo = Type.Object({
  bigRelativePath: Type.String(),
  smallRelativePath: Type.String(),
  thumbRelativePath: Type.String(),
});

export type LogoInfo = Static<typeof LogoInfo>;
