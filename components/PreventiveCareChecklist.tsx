"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  ExternalLink,
  MapPin,
  Navigation,
  Phone,
  Sparkles,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  generateScreeningRecommendations,
  groupScreeningsByStatus,
  type PreventiveCareProfile,
  type ScreeningItem,
  type ScreeningStatus,
} from "@/lib/preventive-care-logic";

interface PreventiveCareChecklistProps {
  profile: PreventiveCareProfile;
  onSchedule?: (screeningId: string, locationId?: string) => void;
}

// Health center type
interface HealthCenter {
  id: string;
  name: string;
  type: "pcp" | "lab" | "imaging" | "clinic" | "hospital" | "pharmacy" | "telehealth";
  address: string;
  distance: string;
  phone?: string;
  nextAvailable?: string;
  acceptsInsurance?: boolean;
}

// Mock function to get nearby health centers based on zip code and screening type
const getNearbyHealthCenters = (
  zipCode: string | undefined,
  screeningId: string,
  insurancePlan?: string
): HealthCenter[] => {
  // In production, this would call a real API
  // For now, we return mock data based on screening type
  
  const baseDistance = zipCode ? parseFloat(zipCode.slice(0, 2)) % 3 : 1;
  
  const centersByScreening: Record<string, HealthCenter[]> = {
    blood_pressure: [
      {
        id: "pcp-1",
        name: "Your Primary Care Provider",
        type: "pcp",
        address: "Next available appointment",
        distance: "—",
        nextAvailable: "Thursday 4:30pm",
        acceptsInsurance: true,
      },
      {
        id: "cvs-1",
        name: "CVS MinuteClinic",
        type: "pharmacy",
        address: `${(baseDistance * 0.4).toFixed(1)} miles away`,
        distance: `${(baseDistance * 0.4).toFixed(1)} mi`,
        nextAvailable: "Walk-in available",
        acceptsInsurance: true,
      },
      {
        id: "walgreens-1",
        name: "Walgreens Health Hub",
        type: "pharmacy",
        address: `${(baseDistance * 0.7).toFixed(1)} miles away`,
        distance: `${(baseDistance * 0.7).toFixed(1)} mi`,
        nextAvailable: "Walk-in available",
        acceptsInsurance: true,
      },
    ],
    cholesterol: [
      {
        id: "labcorp-1",
        name: "LabCorp",
        type: "lab",
        address: `${(baseDistance * 0.6).toFixed(1)} miles away`,
        distance: `${(baseDistance * 0.6).toFixed(1)} mi`,
        nextAvailable: "Walk-in or appointment",
        acceptsInsurance: true,
      },
      {
        id: "quest-1",
        name: "Quest Diagnostics",
        type: "lab",
        address: `${(baseDistance * 0.9).toFixed(1)} miles away`,
        distance: `${(baseDistance * 0.9).toFixed(1)} mi`,
        nextAvailable: "Same-day appointments",
        acceptsInsurance: true,
      },
      {
        id: "pcp-lab",
        name: "PCP Lab Services",
        type: "pcp",
        address: "At your doctor's office",
        distance: "—",
        nextAvailable: "Tuesday",
        acceptsInsurance: true,
      },
    ],
    diabetes: [
      {
        id: "labcorp-2",
        name: "LabCorp",
        type: "lab",
        address: `${(baseDistance * 0.6).toFixed(1)} miles away`,
        distance: `${(baseDistance * 0.6).toFixed(1)} mi`,
        nextAvailable: "Walk-in available",
        acceptsInsurance: true,
      },
      {
        id: "quest-2",
        name: "Quest Diagnostics",
        type: "lab",
        address: `${(baseDistance * 0.9).toFixed(1)} miles away`,
        distance: `${(baseDistance * 0.9).toFixed(1)} mi`,
        nextAvailable: "Same-day appointments",
        acceptsInsurance: true,
      },
    ],
    colorectal: [
      {
        id: "fit-kit",
        name: "At-Home FIT Kit",
        type: "telehealth",
        address: "Mailed to your home",
        distance: "—",
        nextAvailable: "Ships in 2-3 days",
        acceptsInsurance: true,
      },
      {
        id: "gi-center",
        name: "GI Center",
        type: "hospital",
        address: `${(baseDistance * 1.4).toFixed(1)} miles away`,
        distance: `${(baseDistance * 1.4).toFixed(1)} mi`,
        nextAvailable: "Colonoscopy scheduling",
        acceptsInsurance: true,
      },
      {
        id: "endoscopy",
        name: "Regional Endoscopy Center",
        type: "clinic",
        address: `${(baseDistance * 1.7).toFixed(1)} miles away`,
        distance: `${(baseDistance * 1.7).toFixed(1)} mi`,
        nextAvailable: "2-week wait",
        acceptsInsurance: true,
      },
    ],
    mammogram: [
      {
        id: "imaging-1",
        name: "Imaging Center",
        type: "imaging",
        address: `${(baseDistance * 1.2).toFixed(1)} miles away`,
        distance: `${(baseDistance * 1.2).toFixed(1)} mi`,
        nextAvailable: "Next week",
        acceptsInsurance: true,
      },
      {
        id: "radiology-1",
        name: "Regional Radiology",
        type: "imaging",
        address: `${(baseDistance * 1.6).toFixed(1)} miles away`,
        distance: `${(baseDistance * 1.6).toFixed(1)} mi`,
        nextAvailable: "Same-week available",
        acceptsInsurance: true,
      },
    ],
    cervical: [
      {
        id: "pcp-obgyn",
        name: "PCP / OB-GYN",
        type: "pcp",
        address: "Your provider's office",
        distance: "—",
        nextAvailable: "Monday",
        acceptsInsurance: true,
      },
      {
        id: "planned-1",
        name: "Planned Parenthood",
        type: "clinic",
        address: `${(baseDistance * 1.1).toFixed(1)} miles away`,
        distance: `${(baseDistance * 1.1).toFixed(1)} mi`,
        nextAvailable: "Walk-in or appointment",
        acceptsInsurance: true,
      },
    ],
    hiv: [
      {
        id: "labcorp-3",
        name: "LabCorp",
        type: "lab",
        address: `${(baseDistance * 0.6).toFixed(1)} miles away`,
        distance: `${(baseDistance * 0.6).toFixed(1)} mi`,
        nextAvailable: "Walk-in available",
        acceptsInsurance: true,
      },
      {
        id: "pcp-hiv",
        name: "PCP Lab",
        type: "pcp",
        address: "Your doctor's office",
        distance: "—",
        acceptsInsurance: true,
      },
      {
        id: "planned-2",
        name: "Planned Parenthood",
        type: "clinic",
        address: `${(baseDistance * 1.1).toFixed(1)} miles away`,
        distance: `${(baseDistance * 1.1).toFixed(1)} mi`,
        nextAvailable: "Walk-in available",
        acceptsInsurance: true,
      },
    ],
    depression: [
      {
        id: "pcp-mental",
        name: "PCP Visit",
        type: "pcp",
        address: "Your provider's office",
        distance: "—",
        nextAvailable: "This week",
        acceptsInsurance: true,
      },
      {
        id: "telehealth-1",
        name: "Telehealth Screening",
        type: "telehealth",
        address: "Video visit from home",
        distance: "—",
        nextAvailable: "Available today",
        acceptsInsurance: true,
      },
    ],
    tobacco_counseling: [
      {
        id: "telehealth-tobacco",
        name: "Telehealth Counseling",
        type: "telehealth",
        address: "Video visit from home",
        distance: "—",
        nextAvailable: "Evenings available",
        acceptsInsurance: true,
      },
      {
        id: "pcp-tobacco",
        name: "PCP Visit",
        type: "pcp",
        address: "Your provider's office",
        distance: "—",
        acceptsInsurance: true,
      },
    ],
    default: [
      {
        id: "pcp-default",
        name: "Your Primary Care Provider",
        type: "pcp",
        address: "Your provider's office",
        distance: "—",
        nextAvailable: "Call to schedule",
        acceptsInsurance: true,
      },
      {
        id: "telehealth-default",
        name: "Telehealth Visit",
        type: "telehealth",
        address: "Video visit from home",
        distance: "—",
        nextAvailable: "Same-day available",
        acceptsInsurance: true,
      },
    ],
  };

  return centersByScreening[screeningId] || centersByScreening.default;
};

// Get icon for health center type
const getHealthCenterIcon = (type: HealthCenter["type"]) => {
  switch (type) {
    case "pcp":
      return "🩺";
    case "lab":
      return "🧪";
    case "imaging":
      return "📷";
    case "clinic":
      return "🏥";
    case "hospital":
      return "🏨";
    case "pharmacy":
      return "💊";
    case "telehealth":
      return "📱";
    default:
      return "📍";
  }
};

// Status badge component
const StatusBadge = ({ status }: { status: ScreeningStatus }) => {
  const configs: Record<ScreeningStatus, { label: string; className: string; icon: React.ReactNode }> = {
    due_now: {
      label: "Due Now",
      className: "bg-red-100 text-red-700 border-red-200",
      icon: <AlertCircle className="w-3 h-3" />,
    },
    due_soon: {
      label: "Due Soon",
      className: "bg-amber-100 text-amber-700 border-amber-200",
      icon: <Clock className="w-3 h-3" />,
    },
    up_to_date: {
      label: "Up to Date",
      className: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    not_applicable: {
      label: "Not Applicable",
      className: "bg-gray-100 text-gray-600 border-gray-200",
      icon: <XCircle className="w-3 h-3" />,
    },
  };

  const config = configs[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
        config.className
      )}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

// Individual screening card with nearby locations
const ScreeningCard = ({
  screening,
  zipCode,
  insurancePlan,
  onSchedule,
}: {
  screening: ScreeningItem;
  zipCode?: string;
  insurancePlan?: string;
  onSchedule?: (screeningId: string, locationId?: string) => void;
}) => {
  const [showLocations, setShowLocations] = useState(false);
  
  const nearbyLocations = useMemo(
    () => getNearbyHealthCenters(zipCode, screening.id, insurancePlan),
    [zipCode, screening.id, insurancePlan]
  );

  const statusStyles: Record<ScreeningStatus, string> = {
    due_now: "border-l-red-500 bg-red-50/50",
    due_soon: "border-l-amber-500 bg-amber-50/50",
    up_to_date: "border-l-emerald-500 bg-emerald-50/50",
    not_applicable: "border-l-gray-400 bg-gray-50/50",
  };

  const showScheduleOptions = screening.status === "due_now" || screening.status === "due_soon";

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-200 border-l-4 overflow-hidden transition-all hover:shadow-md",
        statusStyles[screening.status]
      )}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{screening.emoji}</span>
              <h4 className="font-semibold text-gray-900 text-sm">{screening.name}</h4>
            </div>
            <p className="text-xs text-gray-600 mb-2">{screening.reason}</p>
            {screening.frequency && (
              <p className="text-xs text-gray-500">
                <Clock className="w-3 h-3 inline mr-1" />
                {screening.frequency}
              </p>
            )}
            {screening.options && screening.options.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {screening.options.map((option, i) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                  >
                    {option}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <StatusBadge status={screening.status} />
          </div>
        </div>

        {/* Near You Section - Show for due items */}
        {showScheduleOptions && nearbyLocations.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setShowLocations(!showLocations)}
              className="w-full flex items-center justify-between px-3 py-2 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-600" />
                <span className="text-sm font-medium text-sky-700">
                  Best places near you
                </span>
                {zipCode && (
                  <span className="text-xs text-sky-500">({zipCode})</span>
                )}
              </div>
              <ChevronDown 
                className={cn(
                  "w-4 h-4 text-sky-600 transition-transform",
                  showLocations && "rotate-180"
                )} 
              />
            </button>
            
            {showLocations && (
              <div className="mt-2 space-y-2">
                {nearbyLocations.map((location) => (
                  <div
                    key={location.id}
                    className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="text-lg flex-shrink-0">{getHealthCenterIcon(location.type)}</span>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {location.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          {location.distance !== "—" && (
                            <>
                              <Navigation className="w-3 h-3" />
                              <span>{location.distance}</span>
                              <span>•</span>
                            </>
                          )}
                          <span>{location.address}</span>
                        </div>
                        {location.nextAvailable && (
                          <p className="text-xs text-emerald-600 mt-1">
                            {location.nextAvailable}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => onSchedule?.(screening.id, location.id)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-sky-600 text-white text-xs font-medium rounded-lg hover:bg-sky-700 transition-colors whitespace-nowrap flex-shrink-0"
                    >
                      <Calendar className="w-3 h-3" />
                      Schedule
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Section header component
const SectionHeader = ({
  title,
  count,
  variant,
}: {
  title: string;
  count: number;
  variant: "due_now" | "due_soon" | "up_to_date" | "not_applicable";
}) => {
  const configs = {
    due_now: {
      bgClass: "bg-red-100",
      textClass: "text-red-800",
      countClass: "bg-red-200 text-red-900",
    },
    due_soon: {
      bgClass: "bg-amber-100",
      textClass: "text-amber-800",
      countClass: "bg-amber-200 text-amber-900",
    },
    up_to_date: {
      bgClass: "bg-emerald-100",
      textClass: "text-emerald-800",
      countClass: "bg-emerald-200 text-emerald-900",
    },
    not_applicable: {
      bgClass: "bg-gray-100",
      textClass: "text-gray-700",
      countClass: "bg-gray-200 text-gray-800",
    },
  };

  const config = configs[variant];

  return (
    <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg mb-3", config.bgClass)}>
      <h3 className={cn("font-semibold text-sm", config.textClass)}>{title}</h3>
      <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", config.countClass)}>
        {count}
      </span>
    </div>
  );
};

export const PreventiveCareChecklist = ({
  profile,
  onSchedule,
}: PreventiveCareChecklistProps) => {
  // Generate recommendations from profile
  const screenings = useMemo(
    () => generateScreeningRecommendations(profile),
    [profile]
  );

  const grouped = useMemo(() => groupScreeningsByStatus(screenings), [screenings]);

  const totalDue = grouped.dueNow.length + grouped.dueSoon.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-50 to-teal-50 rounded-2xl p-4 border border-sky-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-sky-500 to-teal-500 rounded-xl">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Your Preventive Care Checklist</h2>
            <p className="text-sm text-gray-600">Based on USPSTF A/B recommendations</p>
          </div>
        </div>
        {totalDue > 0 && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-gray-700">
              <strong className="text-red-600">{totalDue}</strong> screening
              {totalDue !== 1 ? "s" : ""} need attention
            </span>
          </div>
        )}
        {profile.zipCode && (
          <div className="mt-2 flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-sky-500" />
            <span className="text-gray-600">
              Showing locations near <strong>{profile.zipCode}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Due Now Section */}
      {grouped.dueNow.length > 0 && (
        <div>
          <SectionHeader title="Due Now" count={grouped.dueNow.length} variant="due_now" />
          <div className="space-y-3">
            {grouped.dueNow.map((screening) => (
              <ScreeningCard
                key={screening.id}
                screening={screening}
                zipCode={profile.zipCode}
                insurancePlan={profile.insurancePlan}
                onSchedule={onSchedule}
              />
            ))}
          </div>
        </div>
      )}

      {/* Due Soon Section */}
      {grouped.dueSoon.length > 0 && (
        <div>
          <SectionHeader title="Due Soon" count={grouped.dueSoon.length} variant="due_soon" />
          <div className="space-y-3">
            {grouped.dueSoon.map((screening) => (
              <ScreeningCard
                key={screening.id}
                screening={screening}
                zipCode={profile.zipCode}
                insurancePlan={profile.insurancePlan}
                onSchedule={onSchedule}
              />
            ))}
          </div>
        </div>
      )}

      {/* Up to Date Section */}
      {grouped.upToDate.length > 0 && (
        <div>
          <SectionHeader title="Up to Date" count={grouped.upToDate.length} variant="up_to_date" />
          <div className="space-y-3">
            {grouped.upToDate.map((screening) => (
              <ScreeningCard 
                key={screening.id} 
                screening={screening}
                zipCode={profile.zipCode}
              />
            ))}
          </div>
        </div>
      )}

      {/* Not Applicable Section (collapsed by default) */}
      {grouped.notApplicable.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer list-none">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-150 transition-colors">
              <h3 className="font-semibold text-sm text-gray-700">Not Applicable</h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-800">
                {grouped.notApplicable.length}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-500 ml-auto group-open:rotate-90 transition-transform" />
            </div>
          </summary>
          <div className="mt-3 space-y-3">
            {grouped.notApplicable.map((screening) => (
              <ScreeningCard 
                key={screening.id} 
                screening={screening}
                zipCode={profile.zipCode}
              />
            ))}
          </div>
        </details>
      )}

      {/* Footer */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <p className="text-xs text-gray-500 leading-relaxed">
          <strong>Disclaimer:</strong> This checklist is based on U.S. Preventive Services Task
          Force (USPSTF) A and B recommendations and your self-reported information. It is not
          medical advice. Please consult your healthcare provider for personalized guidance.
        </p>
        <Link
          href="https://www.uspreventiveservicestaskforce.org/uspstf/recommendation-topics/uspstf-a-and-b-recommendations"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-2 text-xs text-sky-600 hover:text-sky-700 font-medium"
        >
          View USPSTF Guidelines
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

// Compact version for sidebar/summary display
export const PreventiveCareChecklistCompact = ({
  profile,
}: {
  profile: PreventiveCareProfile;
}) => {
  const screenings = useMemo(
    () => generateScreeningRecommendations(profile),
    [profile]
  );

  const grouped = useMemo(() => groupScreeningsByStatus(screenings), [screenings]);
  const dueNowCount = grouped.dueNow.length;
  const dueSoonCount = grouped.dueSoon.length;

  if (dueNowCount === 0 && dueSoonCount === 0) {
    return (
      <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        <span className="text-sm text-emerald-800 font-medium">
          All screenings up to date!
        </span>
      </div>
    );
  }

  return (
    <Link
      href="/my-health#checklist"
      className="block p-3 bg-red-50 rounded-xl border border-red-100 hover:bg-red-100/50 transition-colors group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <div>
            <p className="text-sm font-medium text-red-800">
              {dueNowCount} screening{dueNowCount !== 1 ? "s" : ""} due now
            </p>
            {dueSoonCount > 0 && (
              <p className="text-xs text-red-600">
                + {dueSoonCount} due soon
              </p>
            )}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-red-500 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};
