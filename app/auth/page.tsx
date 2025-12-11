import { OnboardingForm } from "@/components/OnboardingForm";
import { Shield, Stethoscope } from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <OnboardingForm />
        
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
          <Shield className="w-4 h-4 text-sky-600" />
          <span>HIPAA-compliant & encrypted</span>
        </div>

        {/* Doctor Portal Link */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link
            href="/doctor"
            className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-white border-2 border-sky-600 text-sky-600 rounded-xl font-semibold hover:bg-sky-50 transition-all"
          >
            <Stethoscope className="w-5 h-5" />
            <span>Doctor Portal Login</span>
          </Link>
          <p className="mt-2 text-xs text-center text-gray-500">
            For healthcare providers only
          </p>
        </div>
      </div>
    </div>
  );
}
