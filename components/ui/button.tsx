import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-[#00BFA6] to-[#00A6CE] text-white shadow-md shadow-[#00BFA6]/20 hover:shadow-lg hover:shadow-[#00BFA6]/30 hover:-translate-y-0.5 focus-visible:ring-[#00BFA6]",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500/50",
        outline:
          "border-2 border-[#00BFA6] bg-white text-[#00A6CE] hover:bg-[#00BFA6]/5 focus-visible:ring-[#00BFA6]",
        secondary:
          "bg-gray-100 text-gray-700 hover:bg-gray-200 focus-visible:ring-gray-400",
        ghost:
          "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-400",
        link: "text-[#00A6CE] underline-offset-4 hover:underline focus-visible:ring-[#00A6CE]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 gap-1.5 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
