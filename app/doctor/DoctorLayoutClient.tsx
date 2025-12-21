"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useUserSync } from "@/hooks/useUserSync";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Film,
  Send,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  Sparkles,
  UserPlus,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Onboarding",
    href: "/doctor/onboarding",
    icon: <UserPlus className="w-5 h-5" />,
  },
  {
    label: "Send Content",
    href: "/doctor/send",
    icon: <Send className="w-5 h-5" />,
  },
  {
    label: "Dashboard",
    href: "/doctor",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: "AI Studio",
    href: "/doctor/create-chapters",
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    label: "Patients",
    href: "/doctor/patients",
    icon: <Users className="w-5 h-5" />,
    badge: 24,
  },
  {
    label: "Messages",
    href: "/doctor/messages",
    icon: <MessageSquare className="w-5 h-5" />,
    badge: 5,
  },
  {
    label: "Video Library",
    href: "/doctor/chapters",
    icon: <Film className="w-5 h-5" />,
  },
];

export function DoctorLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isSyncing, isSynced } = useUserSync();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Redirect if not a doctor
  useEffect(() => {
    if (isSynced && user && user.role !== "doctor" && user.role !== "admin") {
      router.push("/feed");
    }
  }, [isSynced, user, router]);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth" });
  };

  // Current doctor data from session
  const currentDoctor = {
    name: user?.name ? `Dr. ${user.name.split(" ").slice(-1)[0]}` : "Doctor",
    fullName: user?.name || "Doctor",
    specialty: user?.doctorProfile?.specialty || "Healthcare Provider",
    clinic: user?.doctorProfile?.clinicName || "1Another Health",
    avatarUrl: user?.doctorProfile?.avatarUrl || user?.avatarUrl || "/images/doctors/doctor-jack.jpg",
    email: user?.email || "",
  };

  // Show loading state while syncing
  if (isSyncing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-4">
          <button
            onClick={handleToggleSidebar}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex flex-col items-center">
            <Image
              src="/images/1another-logo.png?v=2"
              alt="1Another"
              width={120}
              height={36}
              className="h-7 w-auto"
              unoptimized
            />
            <span className="text-[#00BCD4] font-semibold text-[9px] tracking-wide">
              Intelligent Health
            </span>
          </div>

          <button
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative"
            aria-label="Notifications"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={handleCloseSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-100">
          <Link href="/doctor" className="flex flex-col items-center">
            <Image
              src="/images/1another-logo.png?v=2"
              alt="1Another"
              width={140}
              height={42}
              className="h-10 w-auto"
              unoptimized
            />
            <span className="text-[#00BCD4] font-semibold text-xs tracking-wide">
              Intelligent Health
            </span>
          </Link>
          <button
            onClick={handleCloseSidebar}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Doctor Info */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl">
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-sky-200 bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
              {currentDoctor.avatarUrl && currentDoctor.avatarUrl !== "/images/doctors/doctor-jack.jpg" ? (
                <Image
                  src={currentDoctor.avatarUrl}
                  alt={currentDoctor.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-lg">
                  {currentDoctor.fullName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                {currentDoctor.name}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {currentDoctor.specialty}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleCloseSidebar}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                  isActive
                    ? "bg-sky-600 text-white shadow-md shadow-sky-200"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span
                    className={cn(
                      "ml-auto px-2 py-0.5 text-xs font-bold rounded-full",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-sky-100 text-sky-700"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <Link
            href="/doctor/settings"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen pt-16 lg:pt-0">
        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between h-16 px-8 bg-white border-b border-gray-200">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Doctor Portal
            </h1>
            <p className="text-sm text-gray-500">
              Manage your patients and content
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-gray-100 bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                  {currentDoctor.avatarUrl && currentDoctor.avatarUrl !== "/images/doctors/doctor-jack.jpg" ? (
                    <Image
                      src={currentDoctor.avatarUrl}
                      alt={currentDoctor.name}
                      width={36}
                      height={36}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-sm">
                      {currentDoctor.fullName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="text-left hidden xl:block">
                  <p className="text-sm font-medium text-gray-900">
                    {currentDoctor.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentDoctor.clinic}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">
                        {currentDoctor.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {currentDoctor.specialty}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {currentDoctor.email}
                      </p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/doctor/settings"
                        className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleSignOut();
                        }}
                        className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
