import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        "h-14 w-full min-w-0 rounded-2xl border border-gray-200/60 dark:border-slate-700/60",
        "bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-lg",
        "px-5 py-4 text-mobile-base sm:text-lg md:text-xl font-medium tracking-wide",
        "transition-all duration-300 ease-out outline-none",
        "placeholder:text-slate-400 dark:placeholder:text-slate-500",
        "hover:border-gray-300/80 dark:hover:border-slate-600/80",
        "focus:bg-white dark:focus:bg-slate-900",
        "focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 focus:shadow-xl",
        "text-slate-900 dark:text-slate-100",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:ring-destructive/30 dark:aria-invalid:ring-destructive/50 aria-invalid:border-destructive",
        "file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-mobile-sm file:font-semibold file:text-emerald-600",
        "min-h-[56px]", // Ensure touch-friendly size
        className
      )}
      {...props}
    />
  );
}

export { Input };