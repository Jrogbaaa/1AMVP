import { httpRouter } from "convex/server";

const http = httpRouter();

// Auth is now handled by NextAuth.js
// See /app/api/auth/[...nextauth]/route.ts

export default http;

