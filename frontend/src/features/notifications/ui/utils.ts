/**
 * Formats any ISO 8601 timestamps embedded within a log message string
 * to the user's local timezone and a friendly, readable format.
 */
export function formatLogMessage(message: string): string {
  if (!message) return '';

  // Matches ISO 8601 timestamps like 2026-07-09T03:30:00.000Z or 2026-07-09T03:30:00Z
  const isoRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})/g;

  return message.replace(isoRegex, (match) => {
    try {
      const date = new Date(match);
      if (isNaN(date.getTime())) return match;
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    } catch {
      return match;
    }
  });
}
