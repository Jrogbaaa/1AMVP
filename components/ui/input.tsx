import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-xl border-2 border-gray-200 bg-gray-50/50 px-4 py-2 text-base transition-all duration-200 outline-none placeholder:text-gray-400 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus:border-[#00BFA6] focus:bg-white focus:ring-4 focus:ring-[#00BFA6]/10",
        "file:text-gray-700 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "aria-invalid:border-red-400 aria-invalid:ring-red-100",
        className
      )}
      {...props}
    />
  )
}

export { Input }
