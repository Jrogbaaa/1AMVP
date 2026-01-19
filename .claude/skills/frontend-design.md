---
name: frontend-design
description: Use this skill when creating or modifying UI components, styling, layouts, or any frontend visual elements in this Next.js healthcare application. Apply these patterns for consistent design system usage.
---

# Frontend Design Skill - 1Another MVP

This skill provides guidelines for creating consistent, accessible UI following the established design system.

## Tech Stack

- **Framework:** Next.js with React
- **UI Library:** shadcn/ui (Radix UI primitives)
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Utilities:** class-variance-authority (CVA), clsx + tailwind-merge

## Component Patterns

### Base UI Components

Located in `/components/ui/`. Always use these instead of raw HTML elements:

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
```

### Class Merging

Always use the `cn()` utility for combining Tailwind classes:

```tsx
import { cn } from "@/lib/utils"

<div className={cn("base-classes", conditional && "conditional-class", className)} />
```

### Component Structure

```tsx
"use client"

import { cn } from "@/lib/utils"

interface MyComponentProps {
  className?: string
  children?: React.ReactNode
}

export function MyComponent({ className, children }: MyComponentProps) {
  return (
    <div className={cn("default-styles", className)} data-slot="my-component">
      {children}
    </div>
  )
}
```

## Color System

### Brand Colors (use Tailwind classes)

| Purpose | Class | Hex |
|---------|-------|-----|
| Primary action | `bg-emerald` / `text-emerald` | #00a388 |
| Secondary | `bg-green` / `text-green` | #66B36C |
| Accent | `bg-light-blue` / `text-light-blue` | #3ac1e1 |
| Light bg | `bg-sand` | #F1EFE4 |

### Neutral Colors

| Purpose | Class | Hex |
|---------|-------|-----|
| Primary text | `text-black-1` | #1D1D1D |
| Secondary text | `text-gray-1` | #666666 |
| Muted text | `text-gray-2` | #999999 |
| Borders | `border-gray-3` | #E0E0E0 |
| Light bg | `bg-gray-4` | #F5F5F5 |

### State Colors

| State | Class | Hex |
|-------|-------|-----|
| Success | `text-success` / `bg-success` | #27AE60 |
| Warning | `text-warning` / `bg-warning` | #F2C94C |
| Error | `text-error` / `bg-error` | #EB5757 |

### Gradients

Primary brand gradient:
```tsx
className="bg-gradient-to-br from-emerald to-green"
// or
className="bg-gradient-to-r from-green via-emerald to-light-blue"
```

## Typography

### Heading Classes

Use design system classes for headings:

```tsx
<h1 className="ds-h1">56px heading</h1>
<h2 className="ds-h2">48px heading</h2>
<h3 className="ds-h3">40px heading</h3>
<h4 className="ds-h4">32px heading</h4>
<h5 className="ds-h5">24px heading</h5>
<h6 className="ds-h6">20px heading</h6>
```

### Body Text

```tsx
<p className="text-large">20px body</p>
<p className="text-medium">18px body</p>
<p className="text-normal">16px body (default)</p>
<p className="text-small">14px body</p>
```

### Font Families

```tsx
className="font-sans"     // Manrope - body text
className="font-heading"  // AirbnbCereal - headings
className="font-mono"     // IBM Plex Mono - code
```

## Button Variants

```tsx
<Button variant="default">Primary (gradient)</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="accent">Accent (light-blue)</Button>
<Button variant="link">Link</Button>

<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon only</Button>
```

## Input States

```tsx
<Input state="default" />
<Input state="success" />
<Input state="warning" />
<Input state="error" />
```

## Spacing & Layout

### Consistent Spacing

Use Tailwind's spacing scale consistently:
- `gap-2` (8px) - tight spacing
- `gap-4` (16px) - default spacing
- `gap-6` (24px) - section spacing
- `gap-8` (32px) - large spacing

### Container Patterns

```tsx
// Page container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Card container
<div className="max-w-md mx-auto">

// Feed container (video content)
<div className="max-w-md mx-auto md:max-w-full md:flex md:justify-center">
```

## Responsive Design

### Mobile-First Approach

Always write mobile styles first, then add breakpoints:

```tsx
className="flex-col md:flex-row"        // Stack on mobile, row on desktop
className="w-full md:w-1/2 lg:w-1/3"    // Full width mobile, partial desktop
className="hidden md:block"              // Desktop only
className="md:hidden"                    // Mobile only
```

### Breakpoints

- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px

### Touch Targets

Ensure minimum 48px touch targets on mobile:
```tsx
className="min-h-[48px] min-w-[48px]"
```

## Shadows & Borders

### Border Radius

```tsx
className="rounded-sm"   // 0.5rem
className="rounded-md"   // 0.75rem
className="rounded-lg"   // 1rem
className="rounded-xl"   // 1.25rem
className="rounded-2xl"  // 1.5rem
className="rounded-3xl"  // 2rem
className="rounded-full" // pill/circle
```

### Shadows

```tsx
className="shadow-sm"   // Subtle
className="shadow"      // Default
className="shadow-md"   // Medium
className="shadow-lg"   // Large (modals)
className="shadow-xl"   // Extra large
```

## Animations

### Available Animations

```tsx
className="animate-slide-up"      // Entrance
className="animate-fade-in"       // Fade in
className="animate-pulse-slow"    // Subtle pulse
className="animate-float"         // Floating effect
```

### Hover States

```tsx
// Button hover (built-in)
className="hover:-translate-y-0.5 hover:shadow-lg"

// Card hover
className="hover:shadow-md transition-shadow"

// Scale on hover
className="hover:scale-105 transition-transform"
```

## Accessibility

### Required Patterns

1. **Semantic HTML:** Use appropriate elements (`button`, `nav`, `main`, `section`)
2. **ARIA labels:** Add to interactive elements without visible text
3. **Focus states:** Use `focus-visible:ring-2 focus-visible:ring-emerald`
4. **Color contrast:** Ensure text meets WCAG AA (4.5:1 for body text)

```tsx
<button aria-label="Close dialog">
  <X className="h-4 w-4" />
</button>

<nav aria-label="Main navigation">
  <a href="/" aria-current={isActive ? "page" : undefined}>Home</a>
</nav>
```

## Dark Mode

Use Tailwind dark mode utilities:

```tsx
className="bg-white dark:bg-black-1"
className="text-black-1 dark:text-white"
className="border-gray-3 dark:border-gray-1"
```

## Common Patterns

### Card with Actions

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter className="flex justify-end gap-2">
    <Button variant="outline">Cancel</Button>
    <Button>Confirm</Button>
  </CardFooter>
</Card>
```

### Modal/Dialog

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter className="flex-col-reverse sm:flex-row">
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Form Field

```tsx
<div className="space-y-2">
  <label className="text-sm font-medium text-black-1">
    Email
  </label>
  <Input
    type="email"
    placeholder="you@example.com"
    state={error ? "error" : "default"}
  />
  {error && (
    <p className="text-sm text-error">{error}</p>
  )}
</div>
```

### Loading State

```tsx
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Loading...
</Button>

// Or skeleton
<Skeleton className="h-4 w-[200px]" />
```

## Do's and Don'ts

### Do
- Use existing components from `/components/ui/`
- Apply the `cn()` utility for class merging
- Follow mobile-first responsive patterns
- Include proper accessibility attributes
- Use design system colors and typography
- Add `data-slot` attributes for testing

### Don't
- Create custom colors outside the palette
- Use inline styles
- Skip accessibility attributes on interactive elements
- Use arbitrary pixel values (use Tailwind scale)
- Forget hover/focus states on interactive elements
- Ignore dark mode compatibility
