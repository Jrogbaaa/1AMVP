"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { Logo } from "@/components/Logo";

interface SignInFormProps {
  callbackUrl?: string;
}

export const SignInForm = ({ callbackUrl = "/feed" }: SignInFormProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Get email from form data directly (more reliable than React state)
    const formData = new FormData(e.currentTarget);
    const emailValue = (formData.get("email") as string)?.trim() || email.trim();
    
    if (!emailValue) {
      setError("Please enter your email address");
      return;
    }
    
    setIsLoading(true);
    setError("");

    try {
      // Use redirect: false to handle the response ourselves
      const result = await signIn("email", {
        email: emailValue,
        name: emailValue.split("@")[0], // Default name from email
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError("Failed to sign in. Please try again.");
        setIsLoading(false);
        return;
      }

      // Sync user to Convex database
      try {
        await fetch("/api/auth/sync-user", { method: "POST" });
      } catch (syncError) {
        // Non-critical - the useUserSync hook will also try to sync
        console.warn("Initial sync failed, will retry:", syncError);
      }

      // Redirect to callback URL
      window.location.href = callbackUrl;
    } catch (err) {
      setError("Failed to sign in. Please try again.");
      console.error("Sign in error:", err);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <Logo variant="full" className="h-12 w-auto" />
      </div>

      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to 1Another
        </h1>
        <p className="text-gray-600">
          Sign in to access your personalized health content
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Benefits list */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <span>Save your progress across devices</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <span>Get personalized health reminders</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <span>Connect with your healthcare providers</span>
        </div>
      </div>

      {/* Email sign-in form */}
      <form onSubmit={handleEmailSignIn} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={isLoading}
            autoFocus
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-emerald-500 to-sky-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-sky-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <Mail className="w-5 h-5" />
              Continue with Email
            </>
          )}
        </button>
      </form>

      {/* Privacy note */}
      <p className="mt-6 text-xs text-center text-gray-500">
        By continuing, you agree to receive personalized health content.
        <br />
        Your data is encrypted and HIPAA-compliant.
      </p>

      {/* Browse without signing in */}
      <div className="mt-6 text-center">
        <a
          href="/feed"
          className="text-sm text-sky-600 hover:text-sky-700 font-medium hover:underline"
        >
          Browse content without signing in →
        </a>
      </div>
    </div>
  );
};
