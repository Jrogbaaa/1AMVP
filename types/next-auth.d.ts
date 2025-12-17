import { DefaultSession } from "next-auth";

// Role type - must match auth.ts
type UserRole = "patient" | "doctor" | "admin";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      healthProvider?: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    healthProvider?: string;
    role?: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    healthProvider?: string;
    role?: UserRole;
  }
}
