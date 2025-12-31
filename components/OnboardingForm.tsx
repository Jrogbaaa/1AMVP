"use client";

import { useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
import {
  Mail,
  Loader2,
  CheckCircle,
  User,
  Building2,
  ArrowRight,
  ArrowLeft,
  Search,
  Stethoscope,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";

interface HealthProvider {
  id: string;
  name: string;
  logo?: string;
}

const HEALTH_PROVIDERS: HealthProvider[] = [
  { id: "kaiser", name: "Kaiser Permanente" },
  { id: "united", name: "United Healthcare" },
  { id: "blue-cross", name: "Blue Cross Blue Shield" },
  { id: "aetna", name: "Aetna" },
  { id: "cigna", name: "Cigna" },
  { id: "humana", name: "Humana" },
  { id: "anthem", name: "Anthem" },
  { id: "other", name: "Other" },
];

type OnboardingStep = "email" | "name" | "provider";

interface OnboardingFormProps {
  callbackUrl?: string;
  isDoctorLogin?: boolean;
}

export const OnboardingForm = ({ 
  callbackUrl = "/feed", 
  isDoctorLogin = false 
}: OnboardingFormProps) => {
  
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [healthProvider, setHealthProvider] = useState("");
  const [providerSearch, setProviderSearch] = useState("");
  const [showProviderDropdown, setShowProviderDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const providerInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter providers based on search
  const filteredProviders = HEALTH_PROVIDERS.filter((provider) =>
    provider.name.toLowerCase().includes(providerSearch.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        providerInputRef.current &&
        !providerInputRef.current.contains(event.target as Node)
      ) {
        setShowProviderDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setCurrentStep("name");
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCurrentStep("provider");
  };

  const handleProviderSelect = (provider: HealthProvider) => {
    setHealthProvider(provider.name);
    setProviderSearch(provider.name);
    setShowProviderDropdown(false);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!healthProvider.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      // Sign in with NextAuth - user data will be persisted to Convex
      // via the useUserSync hook that runs after login
      const result = await signIn("email", {
        email,
        name,
        healthProvider,
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
      setError("Failed to complete signup. Please try again.");
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    if (currentStep === "name") {
      setCurrentStep("email");
    } else if (currentStep === "provider") {
      setCurrentStep("name");
    }
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case "email":
        return 1;
      case "name":
        return 2;
      case "provider":
        return 3;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <Logo variant="full" className="h-12 w-auto" />
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              step === getStepNumber()
                ? "bg-sky-600 w-8"
                : step < getStepNumber()
                  ? "bg-sky-400"
                  : "bg-gray-200"
            )}
            aria-label={`Step ${step} of 3`}
          />
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Step 1: Email */}
      {currentStep === "email" && (
        <div className="animate-fade-in">
          {/* Doctor Login Badge */}
          {isDoctorLogin && (
            <div className="mb-4 flex items-center justify-center gap-2 px-4 py-2 bg-sky-50 border border-sky-200 rounded-lg">
              <Stethoscope className="w-4 h-4 text-sky-600" />
              <span className="text-sm font-medium text-sky-700">Doctor Portal Login</span>
            </div>
          )}
          
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isDoctorLogin ? "Doctor Portal Access" : "Welcome to 1Another"}
            </h1>
            <p className="text-gray-600">
              {isDoctorLogin 
                ? "Sign in with your @1another.com email" 
                : "Sign in to access your personalized health content"}
            </p>
          </div>

          {/* Benefits list */}
          <div className="mb-6 space-y-2">
            {isDoctorLogin ? (
              <>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>Manage your patient content</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>Send personalized health videos</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>Track patient engagement</span>
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoFocus
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!email.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <p className="mt-6 text-xs text-center text-gray-500">
            {isDoctorLogin 
              ? "Enter any email to access the doctor portal demo."
              : (
                <>
                  By continuing, you agree to receive personalized health content.
                  <br />
                  Your data is encrypted and HIPAA-compliant.
                </>
              )}
          </p>

          {!isDoctorLogin && (
            <div className="mt-6 text-center">
              <a
                href="/feed"
                className="text-sm text-sky-600 hover:text-sky-700 font-medium hover:underline"
              >
                Browse content without signing in →
              </a>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Name */}
      {currentStep === "name" && (
        <div className="animate-fade-in">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
            type="button"
            aria-label="Go back to email step"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              What's your name?
            </h1>
            <p className="text-gray-600">
              Help us personalize your experience
            </p>
          </div>

          <form onSubmit={handleNameSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Smith"
                  required
                  autoFocus
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Step 3: Health Provider */}
      {currentStep === "provider" && (
        <div className="animate-fade-in">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
            type="button"
            aria-label="Go back to name step"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Who's your health provider?
            </h1>
            <p className="text-gray-600">
              This helps us connect you with relevant care
            </p>
          </div>

          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <div className="relative">
              <label
                htmlFor="provider"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Health insurance provider
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={providerInputRef}
                  id="provider"
                  type="text"
                  value={providerSearch}
                  onChange={(e) => {
                    setProviderSearch(e.target.value);
                    setHealthProvider(e.target.value);
                    setShowProviderDropdown(true);
                  }}
                  onFocus={() => setShowProviderDropdown(true)}
                  placeholder="Search for your provider..."
                  required
                  autoFocus
                  autoComplete="off"
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                  aria-expanded={showProviderDropdown}
                  aria-haspopup="listbox"
                  aria-autocomplete="list"
                />
              </div>

              {/* Provider dropdown */}
              {showProviderDropdown && filteredProviders.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                  role="listbox"
                >
                  {filteredProviders.map((provider) => (
                    <button
                      key={provider.id}
                      type="button"
                      onClick={() => handleProviderSelect(provider)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-sky-50 transition-colors",
                        healthProvider === provider.name && "bg-sky-50"
                      )}
                      role="option"
                      aria-selected={healthProvider === provider.name}
                    >
                      <Building2 className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-900">{provider.name}</span>
                      {healthProvider === provider.name && (
                        <CheckCircle className="w-5 h-5 text-sky-600 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Popular providers quick select */}
            <div className="pt-2">
              <p className="text-xs text-gray-500 mb-2">Popular providers:</p>
              <div className="flex flex-wrap gap-2">
                {HEALTH_PROVIDERS.slice(0, 4).map((provider) => (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => handleProviderSelect(provider)}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-full border transition-all",
                      healthProvider === provider.name
                        ? "border-sky-600 bg-sky-50 text-sky-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    )}
                  >
                    {provider.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!healthProvider.trim() || isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating your account...
                </>
              ) : (
                <>
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-xs text-center text-gray-500">
            Your insurance information is kept private and secure.
          </p>
        </div>
      )}
    </div>
  );
};
