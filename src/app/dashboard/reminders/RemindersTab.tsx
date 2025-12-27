"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, AlertTriangle, Filter, Calendar, Clock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useReminders } from "@/hooks/use-reminders";

const typeLabels: Record<string, string> = {
  APPLIANCE: "Appliance",
  EXPIRY: "Expiry",
  SHOPPING: "Shopping",
  BUDGET: "Budget",
  CUSTOM: "Custom",
  appliance: "Appliance",
  expiry: "Expiry",
  shopping: "Shopping",
  budget: "Budget",
  custom: "Custom",
};

export function RemindersTab() {
  const [filterType, setFilterType] = useState<string>("all");
  const { reminders: allReminders, loading, error } = useReminders();

  const reminders = useMemo(() => {
    if (!allReminders) return [];
    
    const sorted = [...allReminders].sort((a, b) =>
      new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );
    if (filterType === "all") return sorted;
    return sorted.filter((r) => r.type.toLowerCase() === filterType.toLowerCase());
  }, [allReminders, filterType]);

  const filterOptions = [
    "all",
    "expiry",
    "shopping",
    "appliance",
    "budget",
    "custom",
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading reminders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Failed to load reminders</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="section-spacing bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
            <h2 className="text-sm sm:text-xl md:text-2xl font-bold">Reminders</h2>
            <span className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
              <Bell className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-300" />
            </span>
          </div>
          <p className="text-[10px] sm:text-sm text-muted-foreground max-w-lg">
            All kitchen reminders at one place – gas, expiry, shopping, budget
            and more. Currently powered by mock data.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-6 sm:h-8 text-[8px] sm:text-xs gap-1 rounded-full px-2 sm:px-3"
          >
            <AlertTriangle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-500" />
            <span>Smart automation (API later)</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-slate-900/5 dark:shadow-black/20">
        <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
              <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-300" />
            </div>
            <div>
              <p className="text-[8px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Filter by type
              </p>
              <p className="text-[9px] sm:text-sm text-muted-foreground">
                View expiry, shopping, appliance & budget reminders.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 sm:gap-1.5">
            {filterOptions.map((t) => (
              <Button
                key={t}
                size="sm"
                variant={filterType === t ? "default" : "outline"}
                className="h-6 sm:h-8 px-2 sm:px-3 rounded-full text-[8px] sm:text-xs"
                onClick={() => setFilterType(t)}
              >
                {tLabels(t)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* List */}
      <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-slate-900/5 dark:shadow-black/20">
        <CardHeader className="pb-2 sm:pb-4 flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle className="text-[10px] sm:text-lg">
              Upcoming & active reminders
            </CardTitle>
            <p className="text-[9px] sm:text-sm text-muted-foreground">
              Sorted by date, earliest first.
            </p>
          </div>
          <Badge className="rounded-full text-[8px] sm:text-xs bg-muted border border-muted-foreground/10 px-1.5 py-0.5">
            {reminders.length} reminders
          </Badge>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-3 pt-0">
          <AnimatePresence initial={false}>
            {reminders.map((rem) => (
              <motion.div
                key={rem.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex gap-2 sm:gap-4 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-muted/40 hover:bg-muted/70 transition-all"
              >
                <div className="mt-0.5">
                  <ReminderIcon type={rem.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
                    <p className="font-semibold text-[10px] sm:text-sm truncate">
                      {rem.title}
                    </p>
                    <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                      <Badge
                        variant="outline"
                        className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full text-[8px] sm:text-xs border-muted-foreground/20"
                      >
                        {typeLabels[rem.type] || rem.type}
                      </Badge>
                      {!rem.isCompleted && (
                        <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-xs px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded-full bg-rose-500/10 text-rose-600">
                          <AlertTriangle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                  {rem.description && (
                    <p className="text-[9px] sm:text-sm text-muted-foreground mt-0.5 line-clamp-2">
                      {rem.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5 text-[8px] sm:text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-0.5 sm:gap-1">
                      <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      {new Date(rem.scheduledAt).toLocaleDateString()}
                    </span>
                    <span className="inline-flex items-center gap-0.5 sm:gap-1">
                      <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      {rem.isCompleted ? "Completed" : "Pending"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {reminders.length === 0 && (
            <p className="text-[10px] sm:text-sm text-muted-foreground text-center py-4 sm:py-6">
              No reminders match this filter.
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ReminderIcon({ type }: { type: string }) {
  const base =
    "w-6 h-6 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center text-white shadow-sm";
  const lowerType = type.toLowerCase();
  switch (lowerType) {
    case "appliance":
      return (
        <div
          className={`${base} bg-gradient-to-br from-amber-500 to-orange-500`}
        >
          <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
        </div>
      );
    case "expiry":
      return (
        <div className={`${base} bg-gradient-to-br from-red-500 to-rose-500`}>
          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
        </div>
      );
    case "shopping":
      return (
        <div
          className={`${base} bg-gradient-to-br from-indigo-500 to-purple-500`}
        >
          <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
        </div>
      );
    case "budget":
      return (
        <div
          className={`${base} bg-gradient-to-br from-emerald-500 to-teal-500`}
        >
          <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
        </div>
      );
    default:
      return (
        <div
          className={`${base} bg-gradient-to-br from-slate-500 to-slate-700`}
        >
          <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
        </div>
      );
  }
}

function tLabels(t: string) {
  if (t === "all") return "All";
  return typeLabels[t] || t;
}
