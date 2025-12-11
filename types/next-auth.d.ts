import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      healthProvider?: string;
    } & DefaultSession["user"];
  }

  interface User {
    healthProvider?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    healthProvider?: string;
  }
}
