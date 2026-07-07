"use client";

import { useEffect, useState } from "react";
import { IST_TIMEZONE, readableDate, readableTime } from "@/lib/date";

export function useClock(timeZone = IST_TIMEZONE) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return {
    now,
    date: readableDate(now, timeZone),
    time: readableTime(now, timeZone),
    timeZone
  };
}
