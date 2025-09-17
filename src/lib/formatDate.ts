import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";

const TIMEZONE = 'America/Argentina/Buenos_Aires';

export const toLocalDate = (input: string | Date): Date => {
    const date = typeof input === 'string' ? new Date(input) : input;
    return utcToZonedTime(date, TIMEZONE);
};

export const toUTCDate = (input: Date | null): Date | null => {
    if (!input) return null;
    return zonedTimeToUtc(input, TIMEZONE);
};