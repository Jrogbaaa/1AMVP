"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Play, Compass, Heart } from "lucide-react";
import { AuthPrompt } from "@/components/AuthPrompt";

type NavItem = {
  href: string;
  label: string;
  icon: "feed" | "discover" | "health";
  requiresAuth?: boolean;
};

const navItems: NavItem[] = [
  { href: "/feed", label: "My Feed", icon: "feed" },
  { href: "/discover", label: "Discover", icon: "discover" },
  { href: "/my-health", label: "My Health", icon: "health", requiresAuth: true },
];

export const MobileBottomNav = () => {
  const pathname = usePathname();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const isActive = (href: string) => {
    if (href === "/feed") {
      return pathname === "/feed" || pathname === "/";
    }
    return pathname === href || pathname?.startsWith(href + "/");
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: NavItem
  ) => {
    // If item requires auth and user is not authenticated, show auth prompt
    if (item.requiresAuth && !isAuthenticated) {
      e.preventDefault();
      setShowAuthPrompt(true);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLAnchorElement>,
    item: NavItem
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      if (item.requiresAuth && !isAuthenticated) {
        e.preventDefault();
        setShowAuthPrompt(true);
      }
    }
  };

  return (
    <>
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 z-30 safe-area-bottom"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-around py-1.5 px-4">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                onKeyDown={(e) => handleKeyDown(e, item)}
                className={`flex flex-col items-center gap-0.5 min-w-[64px] py-1 transition-all duration-200 ${
                  active
                    ? "text-[#00BFA6]"
                    : "text-[#9CA3AF] hover:text-gray-600"
                }`}
                aria-current={active ? "page" : undefined}
                aria-label={item.label}
                tabIndex={0}
              >
                {item.icon === "feed" && (
                  <Play
                    className="w-5 h-5"
                    fill={active ? "currentColor" : "none"}
                    strokeWidth={active ? 0 : 1.75}
                  />
                )}
                {item.icon === "discover" && (
                  <Compass
                    className="w-5 h-5"
                    fill="none"
                    strokeWidth={active ? 2.25 : 1.75}
                  />
                )}
                {item.icon === "health" && (
                  <Heart
                    className="w-5 h-5"
                    fill={active ? "currentColor" : "none"}
                    strokeWidth={active ? 0 : 1.75}
                  />
                )}
                <span
                  className={`text-[10px] font-medium ${
                    active ? "text-[#00BFA6]" : "text-[#9CA3AF]"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Auth Prompt - Shows when unauthenticated user taps "My Health" */}
      <AuthPrompt
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        trigger="personalized_content"
      />
    </>
  );
};

export default MobileBottomNav;
