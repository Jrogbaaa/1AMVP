"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/Logo";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useUserSync } from "@/hooks/useUserSync";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Film,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  Sparkles,
  Loader2,
  Stethoscope,
  AlertTriangle,
  BookOpen,
  User,
  Wand2,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  hasNotification?: boolean;
  notificationCount?: number;
  isScrollTarget?: boolean; // If true, this is a scroll target on the dashboard
}

// Navigation items - dashboard sections use hash links for scroll-to behavior
// Order matches the main scroll section order on the dashboard
const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "My Dashboard",
    href: "/doctor",
    icon: <LayoutDashboard className="w-5 h-5" />,
    isScrollTarget: true,
  },
  {
    id: "patients",
    label: "My Patients",
    href: "/doctor#patients",
    icon: <Users className="w-5 h-5" />,
    hasNotification: true,
    notificationCount: 2,
    isScrollTarget: true,
  },
  {
    id: "check-ins",
    label: "My Check-ins and Reminders",
    href: "/doctor#check-ins",
    icon: <MessageSquare className="w-5 h-5" />,
    isScrollTarget: true,
  },
  {
    id: "my-videos",
    label: "My Video Library",
    href: "/doctor#my-videos",
    icon: <Film className="w-5 h-5" />,
    isScrollTarget: true,
  },
  {
    id: "browse",
    label: "Browse Videos",
    href: "/doctor#browse",
    icon: <BookOpen className="w-5 h-5" />,
    isScrollTarget: true,
  },
  {
    id: "train-ai",
    label: "Train AI on Me",
    href: "/doctor#train-ai",
    icon: <Wand2 className="w-5 h-5" />,
    isScrollTarget: true,
  },
  {
    id: "profile",
    label: "My Profile",
    href: "/doctor#profile",
    icon: <User className="w-5 h-5" />,
    isScrollTarget: true,
  },
];

// Secondary navigation items (separate pages)
const SECONDARY_NAV_ITEMS: NavItem[] = [
  {
    id: "onboarding",
    label: "Onboarding",
    href: "/doctor/onboarding",
    icon: <Sparkles className="w-5 h-5" />,
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
  const [activeSection, setActiveSection] = useState("dashboard");

  // Check if we're on the main dashboard page
  const isOnDashboard = pathname === "/doctor";

  // Check if user has doctor access
  const hasAccess = !isSynced || !user || user.role === "doctor" || user.role === "admin";

  // Handle scroll spy for active section
  useEffect(() => {
    if (!isOnDashboard) return;

    const handleScroll = () => {
      const sections = NAV_ITEMS.filter(item => item.isScrollTarget).map(item => item.id);
      const scrollPosition = window.scrollY + 150; // Offset for header

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOnDashboard]);

  // Handle nav item click with smooth scroll
  const handleNavClick = useCallback((e: React.MouseEvent, item: NavItem) => {
    if (item.isScrollTarget && isOnDashboard) {
      e.preventDefault();
      const sectionId = item.id;
      const element = document.getElementById(sectionId);
      if (element) {
        const offsetTop = element.offsetTop - 100; // Account for fixed header
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
        setActiveSection(sectionId);
      }
    } else if (item.isScrollTarget && !isOnDashboard) {
      // Navigate to dashboard first, then scroll will happen
      router.push(item.href);
    }
    setIsSidebarOpen(false);
  }, [isOnDashboard, router]);

  // Handle re-login as doctor
  const handleDoctorLogin = async () => {
    await signOut({ redirect: false });
    router.push("/auth?callbackUrl=/doctor");
  };

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

  // Check if nav item is active
  const isNavItemActive = (item: NavItem) => {
    if (item.isScrollTarget && isOnDashboard) {
      return activeSection === item.id;
    }
    return pathname === item.href || pathname.startsWith(item.href + "/");
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

  // Show access denied screen for non-doctors
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Logo variant="full" className="h-10 w-auto" />
            </div>

            {/* Warning Icon */}
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Doctor Portal Access Required
            </h1>
            <p className="text-gray-600 mb-2">
              You&apos;re currently signed in as a patient.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              To access the Doctor Portal, please sign in with an <span className="font-semibold text-sky-600">@1another.com</span>, <span className="font-semibold text-sky-600">@1another.health</span>, or <span className="font-semibold text-sky-600">@1another.ai</span> email address.
            </p>

            {/* Current User Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-500">Currently signed in as:</p>
              <p className="font-medium text-gray-900">{user?.name || user?.email}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleDoctorLogin}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-colors"
              >
                <Stethoscope className="w-5 h-5" />
                Sign in to Doctor Portal
              </button>
              <Link
                href="/feed"
                className="w-full flex items-center justify-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
              >
                Return to Patient Feed
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-50 bg-white">
        <div className="flex items-center justify-between h-16 px-4">
          <button
            onClick={handleToggleSidebar}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex flex-col items-center">
            <Logo variant="withTagline" className="h-10 w-auto" />
          </div>

          <button
            onClick={() => {
              if (isOnDashboard) {
                const element = document.getElementById("patients");
                if (element) {
                  const offsetTop = element.offsetTop - 100;
                  window.scrollTo({ top: offsetTop, behavior: "smooth" });
                }
              } else {
                router.push("/doctor#patients");
              }
            }}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative"
            aria-label="View notifications"
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
          "fixed top-0 left-0 z-50 h-full w-64 bg-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header - Logo with more spacing */}
        <div className="flex items-center justify-center h-20 px-4 relative border-b border-gray-100">
          <Link href="/doctor" className="flex flex-col items-center">
            <Logo variant="withTagline" className="h-14 w-auto" />
          </Link>
          <button
            onClick={handleCloseSidebar}
            className="lg:hidden absolute right-4 p-1.5 text-gray-400 hover:text-gray-600"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Navigation - Dashboard Sections */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="px-3 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Dashboard
          </p>
          {NAV_ITEMS.map((item) => {
            const isActive = isNavItemActive(item);
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all cursor-pointer",
                  isActive
                    ? "bg-sky-600 text-white shadow-md shadow-sky-200"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <div className="flex-shrink-0">
                  {item.icon}
                </div>
                <span className="font-medium flex-1">{item.label}</span>
                {item.notificationCount && item.notificationCount > 0 && (
                  <span
                    className={cn(
                      "px-2 py-0.5 text-xs font-bold rounded-full min-w-[20px] text-center",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-red-500 text-white"
                    )}
                  >
                    {item.notificationCount}
                  </span>
                )}
              </a>
            );
          })}

          {/* Secondary Navigation */}
          <div className="pt-3 mt-3">
            <p className="px-3 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Other
            </p>
            {SECONDARY_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={handleCloseSidebar}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all",
                    isActive
                      ? "bg-sky-600 text-white shadow-md shadow-sky-200"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <div className="flex-shrink-0">
                    {item.icon}
                  </div>
                  <span className="font-medium flex-1">{item.label}</span>
                  {item.notificationCount && item.notificationCount > 0 && (
                    <span
                      className={cn(
                        "px-2 py-0.5 text-xs font-bold rounded-full min-w-[20px] text-center",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-red-500 text-white"
                      )}
                    >
                      {item.notificationCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-end h-16 px-8 bg-white sticky top-0 z-40">
          <div className="flex items-center gap-4">
            {/* Send Button */}
            <Link
              href="/doctor/send"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-emerald-600 text-white text-sm font-semibold rounded-xl hover:from-sky-700 hover:to-emerald-700 transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
              Send
            </Link>

            {/* Notifications - scrolls to My Patients */}
            <button
              onClick={() => {
                if (isOnDashboard) {
                  const element = document.getElementById("patients");
                  if (element) {
                    const offsetTop = element.offsetTop - 100;
                    window.scrollTo({ top: offsetTop, behavior: "smooth" });
                  }
                } else {
                  router.push("/doctor#patients");
                }
              }}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative"
              aria-label="View notifications"
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
