"use client";

import { useEffect, useState } from "react";

export function DateTimeDisplay() {
  const [dateTime, setDateTime] = useState<Date | null>(null);

  useEffect(() => {
    setDateTime(new Date());
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!dateTime) {
    return (
      <div className="h-7 w-52 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
    );
  }

  const dateStr = dateTime.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const timeStr = dateTime.toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
      </span>
      <span>{dateStr}</span>
      <span className="text-slate-300 dark:text-slate-700">•</span>
      <span className="font-mono font-semibold">{timeStr}</span>
    </div>
  );
}