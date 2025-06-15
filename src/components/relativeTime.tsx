export default function getRelativeTime(timestamp: string): string {
    const now = new Date();
    const then = new Date(timestamp);

    if (isNaN(then.getTime())) {
        return "Invalid date";
    }

    const diff = Math.floor((now.getTime() - then.getTime()) / 1000);

    const units: [Intl.RelativeTimeFormatUnit, number][] = [
        ["year", 31536000],
        ["month", 2592000],
        ["week", 604800],
        ["day", 86400],
        ["hour", 3600],
        ["minute", 60],
        ["second", 1],
    ];

    for (const [unit, secondsInUnit] of units) {
        if (diff >= secondsInUnit || unit === "second") {
            const value = Math.floor(diff / secondsInUnit);
            const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
            return rtf.format(-value, unit);
        }
    }

    return "just now";
}