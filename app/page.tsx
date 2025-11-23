import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string; d?: string }>;
}) {
  // Await searchParams in Next.js 15
  const params = await searchParams;
  
  // If magic link params exist, redirect to feed
  if (params.p && params.d) {
    redirect(`/feed?p=${params.p}&d=${params.d}`);
  }

  // Demo magic link for testing (simulates what a patient receives)
  const demoMagicLink = "/feed?p=650e8400-e29b-41d4-a716-446655440001&d=550e8400-e29b-41d4-a716-446655440001";

  // Landing page for direct visits
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            Welcome to 1Another
          </h1>
          <p className="text-2xl text-gray-600 font-light">
            Your doctor's personalized follow-up portal
          </p>
        </div>

        {/* Demo Access Section */}
        <div className="mb-10 p-8 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-2xl shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-3xl">🧪</span>
            <h2 className="text-xl font-bold text-yellow-900">
              DEMO MODE - Test Patient Experience
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Link
              href={demoMagicLink}
              className="group relative overflow-hidden px-6 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg hover:shadow-2xl hover:scale-105 duration-200"
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl">🔗</span>
                <span className="text-lg">Click Magic Link</span>
                <span className="text-xs text-primary-100">See the TikTok-style feed</span>
              </div>
            </Link>
            
            <Link
              href="/discover"
              className="group px-6 py-4 bg-white text-primary-600 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-md hover:shadow-xl border-2 border-primary-600 hover:scale-105 duration-200"
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl">🔍</span>
                <span className="text-lg">Discover</span>
                <span className="text-xs text-gray-500">Find doctors</span>
              </div>
            </Link>
            
            <Link
              href="/my-health"
              className="group px-6 py-4 bg-white text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-md hover:shadow-xl border-2 border-gray-300 hover:scale-105 duration-200"
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl">❤️</span>
                <span className="text-lg">My Health</span>
                <span className="text-xs text-gray-500">Health profile</span>
              </div>
            </Link>
          </div>
          
          <div className="text-center px-4 py-3 bg-yellow-100 rounded-lg border border-yellow-300">
            <p className="text-sm font-medium text-yellow-900">
              👨‍⚕️ Patient: <strong>Dave Thompson</strong> | Doctor: <strong>Dr. Sarah Johnson</strong>
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-gray-100">
          <div className="flex items-center justify-center gap-4 mb-6">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <div className="text-left">
              <p className="text-green-800 font-bold text-xl">
                HIPAA-Compliant & Secure
              </p>
              <p className="text-green-600 text-sm">
                Your data is private between you and your doctor
              </p>
            </div>
          </div>
          <p className="text-gray-600 text-center text-lg">
            To access your personalized content, please use the secure link provided by your doctor.
          </p>
        </div>

        {/* Features Grid */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            What you'll find here:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <div>
                <p className="text-gray-900 font-bold text-lg mb-1">
                  Personalized follow-up videos
                </p>
                <p className="text-gray-600 text-sm">
                  Watch custom messages from your doctor about your care
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <div>
                <p className="text-gray-900 font-bold text-lg mb-1">
                  Educational content
                </p>
                <p className="text-gray-600 text-sm">
                  Learn about your health with curated videos
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <div>
                <p className="text-gray-900 font-bold text-lg mb-1">
                  Easy scheduling
                </p>
                <p className="text-gray-600 text-sm">
                  Book follow-up appointments with one click
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl font-bold">4</span>
              </div>
              <div>
                <p className="text-gray-900 font-bold text-lg mb-1">
                  Direct messaging
                </p>
                <p className="text-gray-600 text-sm">
                  Chat with your care team anytime
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

