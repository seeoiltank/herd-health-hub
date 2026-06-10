import { format } from "date-fns";

export function createPageUrl(pageName: string) {
    return '/' + pageName.replace(/ /g, '-');
}

/**
 * Format a date safely. date-fns `format` throws a RangeError on an invalid
 * date (e.g. missing or malformed values), which can crash an entire page.
 * This returns a fallback string instead of throwing.
 */
export function formatDate(value: unknown, pattern: string, fallback = "—"): string {
    if (value === null || value === undefined || value === "") return fallback;
    const date = value instanceof Date ? value : new Date(value as string | number);
    if (isNaN(date.getTime())) return fallback;
    return format(date, pattern);
}
