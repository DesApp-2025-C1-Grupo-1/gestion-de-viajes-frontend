
declare module 'date-fns-tz' {
  export function utcToZonedTime(date: string | Date, timeZone: string): Date;
  export function zonedTimeToUtc(date: Date, timeZone: string): Date;
}