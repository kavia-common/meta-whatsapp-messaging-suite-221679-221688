//
// Formatting utilities used across the UI
//
import { DateFormats } from './constants';

// PUBLIC_INTERFACE
export function formatPhone(phone) {
  /** Formats phone for display, preserving + and grouping digits for readability. */
  if (!phone && phone !== 0) return '';
  const s = String(phone).replace(/[^\d+]/g, '');
  if (s.startsWith('+')) {
    const digits = s.slice(1).replace(/\D/g, '');
    return `+${groupDigits(digits)}`;
  }
  return groupDigits(s.replace(/\D/g, ''));
}

function groupDigits(d) {
  // Basic grouping into blocks of 3-4 from the start for readability, not a locale-specific format
  return d.replace(/(\d{3,4})(?=\d)/g, '$1 ').trim();
}

// PUBLIC_INTERFACE
export function formatDate(value, style = DateFormats.HUMAN_DATE) {
  /** Format dates using Intl. Accepts Date|string|number */
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  if (style === DateFormats.ISO) return date.toISOString();
  if (style === DateFormats.HUMAN_DATETIME) {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }
  // HUMAN_DATE default
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date);
}

// PUBLIC_INTERFACE
export function formatCount(n) {
  /** Shortens large numbers (e.g., 1200 -> 1.2k) */
  const num = Number(n);
  if (!Number.isFinite(num)) return '';
  if (num < 1000) return String(num);
  if (num < 1_000_000) return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}k`;
  if (num < 1_000_000_000) return `${(num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1)}M`;
  return `${(num / 1_000_000_000).toFixed(num % 1_000_000_000 === 0 ? 0 : 1)}B`;
}

// PUBLIC_INTERFACE
export function pluralize(word, count) {
  /** Pluralize a simple English word by appending 's' when count !== 1 */
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}
