import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Role type for the application
export type UserRole = "patient" | "doctor" | "admin";

// Doctor email domains - users with these domains are treated as doctors
const DOCTOR_EMAIL_DOMAINS = ["1another.com", "1another.health"];

// Admin emails - specific emails that have admin access
const ADMIN_EMAILS = ["admin@1another.com"];

/**
 * Determine user role based on email
 * - Admin: Specific admin emails
 * - Doctor: Email domain matches doctor domains
 * - Patient: Everyone else
 */
const determineRole = (email: string): UserRole => {
  const lowerEmail = email.toLowerCase();
  
  // Check for admin first
  if (ADMIN_EMAILS.includes(lowerEmail)) {
    return "admin";
  }
  
  // Check if email domain matches doctor domains
  const domain = lowerEmail.split("@")[1];
  if (domain && DOCTOR_EMAIL_DOMAINS.includes(domain)) {
    return "doctor";
  }
  
  // Default to patient
  return "patient";
};

// Email sign-in provider with onboarding data
// In development, allows any email to sign in
// In production, you'd want to add a proper database adapter
const providers = [
  Credentials({
    id: "email",
    name: "Email",
    credentials: {
      email: { label: "Email", type: "email" },
      name: { label: "Name", type: "text" },
      healthProvider: { label: "Health Provider", type: "text" },
    },
    async authorize(credentials) {
      if (credentials?.email && typeof credentials.email === "string") {
        const email = credentials.email;
        const name = credentials.name && typeof credentials.name === "string" 
          ? credentials.name 
          : email.split("@")[0];
        const healthProvider = credentials.healthProvider && typeof credentials.healthProvider === "string"
          ? credentials.healthProvider
          : undefined;
        
        // Determine role based on email
        const role = determineRole(email);
        
        return {
          id: email,
          email: email,
          name: name,
          healthProvider: healthProvider,
          role: role,
        };
      }
      return null;
    },
  }),
];

// Production-safe cookie name
const useSecureCookies = process.env.NODE_ENV === "production";
const cookiePrefix = useSecureCookies ? "__Secure-" : "";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  pages: {
    signIn: "/auth",
    verifyRequest: "/auth/verify",
    error: "/auth/error",
  },
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
    async jwt({ token, user }) {
      if (user) {
        token.healthProvider = user.healthProvider;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.healthProvider = token.healthProvider as string | undefined;
        session.user.role = (token.role as UserRole) || "patient";
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8, // 8 hours
  },
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    callbackUrl: {
      name: `${cookiePrefix}next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    csrfToken: {
      name: `${useSecureCookies ? "__Host-" : ""}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
  },
  debug: process.env.NODE_ENV === "development",
  trustHost: true,
});
