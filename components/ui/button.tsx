import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-[#00a388] to-[#66B36C] text-white shadow-md shadow-[#00a388]/20 hover:shadow-lg hover:shadow-[#00a388]/30 hover:-translate-y-0.5 focus-visible:ring-[#00a388]",
        destructive:
          "bg-[#EB5757] text-white hover:bg-[#d94444] focus-visible:ring-[#EB5757]/50",
        outline:
          "border-2 border-[#00a388] bg-white text-[#00a388] hover:bg-[#00a388]/5 focus-visible:ring-[#00a388]",
        secondary:
          "bg-[#F5F5F5] text-[#1D1D1D] hover:bg-[#E0E0E0] focus-visible:ring-[#BDBDBD]",
        ghost:
          "text-[#282828] hover:bg-[#F5F5F5] hover:text-[#1D1D1D] focus-visible:ring-[#BDBDBD]",
        link: "text-[#00a388] underline-offset-4 hover:underline focus-visible:ring-[#00a388]",
        accent: "bg-[#3ac1e1] text-white hover:bg-[#2eb0d0] focus-visible:ring-[#3ac1e1]",
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
