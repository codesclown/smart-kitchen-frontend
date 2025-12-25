import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-white/95 dark:bg-slate-900/95 text-card-foreground backdrop-blur-xl flex flex-col gap-5 sm:gap-6 md:gap-7 rounded-2xl border border-gray-200/60 dark:border-slate-700/60 shadow-xl py-5 sm:py-6 md:py-7 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-3 sm:gap-4 md:gap-5 px-5 sm:px-6 md:px-7 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-5 sm:[.border-b]:pb-6 md:[.border-b]:pb-7",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-tight font-bold text-mobile-xl sm:text-2xl md:text-3xl text-slate-900 dark:text-slate-100", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-slate-600 dark:text-slate-400 text-mobile-base sm:text-lg md:text-xl leading-relaxed", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-5 sm:px-6 md:px-7", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-5 sm:px-6 md:px-7 [.border-t]:pt-5 sm:[.border-t]:pt-6 md:[.border-t]:pt-7", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
