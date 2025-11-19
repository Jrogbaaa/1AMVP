import { SignInForm } from "@/components/SignInForm";
import { Shield } from "lucide-react";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <SignInForm />
        
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
          <Shield className="w-4 h-4 text-sky-600" />
          <span>HIPAA-compliant & encrypted</span>
        </div>
      </div>
    </div>
  );
}
