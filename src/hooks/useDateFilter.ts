import { useState } from "react";

import { getToday, shiftDate } from "../lib/dateUtils";

export const useDateFilter = () => {
  const [asOfDate, setAsOfDate] = useState("");

  const goToPreviousDay = () => {
    setAsOfDate((prev) => shiftDate(prev, -1));
  };

  const goToNextDay = () => {
    setAsOfDate((prev) => {
      const next = shiftDate(prev, 1);

      return next >= getToday() ? "" : next;
    });
  };

  const resetToLive = () => {
    setAsOfDate("");
  };

  const handleDateInputChange = (value: string) => {
    setAsOfDate(value === getToday() ? "" : value);
  };

  return {
    asOfDate,
    inputValue: asOfDate || getToday(),
    maxDate: getToday(),
    isLive: asOfDate === "",
    goToPreviousDay,
    goToNextDay,
    resetToLive,
    handleDateInputChange,
  };
};