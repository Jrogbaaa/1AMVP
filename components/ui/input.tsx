import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  state?: "default" | "success" | "warning" | "error"
}

function Input({ className, type, state = "default", ...props }: InputProps) {
  const stateStyles = {
    default: "border-[#E0E0E0] focus:border-[#3ac1e1] focus:ring-[#3ac1e1]/15",
    success: "border-[#27AE60] focus:border-[#27AE60] focus:ring-[#27AE60]/15",
    warning: "border-[#F2C94C] focus:border-[#F2C94C] focus:ring-[#F2C94C]/15",
    error: "border-[#EB5757] focus:border-[#EB5757] focus:ring-[#EB5757]/15",
  }

  return (
    <input
      type={type}
      data-slot="input"
      data-state={state}
      className={cn(
        "h-11 w-full min-w-0 rounded-xl border bg-white px-[2em] py-[1em] text-base text-[#1D1D1D] transition-all duration-200 outline-none placeholder:text-[#BDBDBD] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "hover:border-[#BDBDBD]",
        "focus:ring-4",
        "file:text-[#1D1D1D] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        stateStyles[state],
        "aria-invalid:border-[#EB5757] aria-invalid:ring-[#EB5757]/15",
        className
      )}
      {...props}
    />
  )
}

export { Input }
