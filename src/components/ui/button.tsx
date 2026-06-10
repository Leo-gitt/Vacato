import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva  } from 'class-variance-authority'
import type {VariantProps} from 'class-variance-authority';

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default: 'bg-teal-600 text-white shadow-sm hover:bg-teal-500',
        secondary: 'bg-[#1e293b] text-stone-300 border border-gray-700 shadow-sm hover:bg-[#243044] hover:text-white',
        ghost: 'text-stone-500 hover:bg-stone-100 hover:text-stone-900',
        destructive: 'bg-red-600 text-white shadow-sm hover:bg-red-700',
        success: 'bg-green-600 text-white shadow-sm hover:bg-green-700',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        default: 'px-4 py-2 text-sm',
        lg: 'px-5 py-2.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
