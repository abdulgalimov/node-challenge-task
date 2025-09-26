import { Static, Type } from "@sinclair/typebox";

export const LogoInfo = Type.Object({
  bigRelativePath: Type.String(),
  smallRelativePath: Type.String(),
  thumbRelativePath: Type.String(),
});

export type LogoInfo = Static<typeof LogoInfo>;

export const Logo = Type.Object({
  id: Type.String(),
  bigRelativePath: Type.String(),
  smallRelativePath: Type.String(),
  thumbRelativePath: Type.String(),
});

export type Logo = Static<typeof Logo>;
