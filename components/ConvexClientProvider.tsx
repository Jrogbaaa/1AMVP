"use client";

import { SessionProvider } from "next-auth/react";
import { ConvexReactClient } from "convex/react";
import { ConvexProvider } from "convex/react";
import { ReactNode } from "react";

// Only create Convex client if URL is provided (handles CI/build without env vars)
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export const ConvexClientProvider = ({ children }: { children: ReactNode }) => {
  // If no Convex client (missing URL), just provide session without Convex
  if (!convex) {
    return <SessionProvider>{children}</SessionProvider>;
  }

  return (
    <SessionProvider>
      <ConvexProvider client={convex}>
        {children}
      </ConvexProvider>
    </SessionProvider>
  );
};

