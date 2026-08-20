export const getToday = (): string =>
  new Date().toISOString().slice(0, 10);

export const shiftDate = (
  dateStr: string,
  days: number,
): string => {
  const base = dateStr
    ? new Date(`${dateStr}T00:00:00`)
    : new Date();

  base.setDate(base.getDate() + days);

  return base.toISOString().slice(0, 10);
};