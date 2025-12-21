import { DoctorLayoutClient } from "./DoctorLayoutClient";

// Force dynamic rendering - this layout requires Convex and authentication
export const dynamic = "force-dynamic";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DoctorLayoutClient>{children}</DoctorLayoutClient>;
}

