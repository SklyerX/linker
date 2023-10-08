import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username?: string | null;
  }
}

declare module "next-auth" {
  interface Session {
    id: string;
    username?: string | null;
  }
}
