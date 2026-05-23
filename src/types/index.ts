import type { JwtPayload } from "jsonwebtoken";

export const user_role = {
  contributor: "contributor",
  maintainer: "maintainer",
} as const;

export type ROLES = keyof typeof user_role;

export interface CustomJwtPayload extends JwtPayload {
  id: number;
  name: string;
  email: string;
  role: ROLES;
}