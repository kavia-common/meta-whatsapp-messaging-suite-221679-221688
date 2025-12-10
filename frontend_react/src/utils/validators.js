//
// Validation utilities used across Templates, Contacts, and Messaging
//
import { CSVHeaders, MAX_LIMITS } from './constants';

// Simple E.164-like validation allowing optional + and 8-15 digits.
// PUBLIC_INTERFACE
export function isValidPhone(value) {
  /** Validate phone numbers roughly to E.164. */
  if (!value) return false;
  const cleaned = String(value).trim();
  return /^\+?[1-9]\d{7,14}$/.test(cleaned);
}

// PUBLIC_INTERFACE
export function normalizePhone(value) {
  /** Normalize phone numbers by removing spaces, hyphens, and parenthesis. Keeps leading + if present. */
  if (!value && value !== 0) return '';
  return String(value).replace(/[()\s-]/g, '');
}

// PUBLIC_INTERFACE
export function validateCSVHeaders(headers, expectedHeaders = CSVHeaders.CONTACTS) {
  /**
   * Validate CSV headers for contacts upload.
   * - headers: array of column names from uploaded file
   * - expectedHeaders: array of required headers
   * Returns: { valid: boolean, missing: string[], extras: string[] }
   */
  const headerSet = new Set(headers.map((h) => String(h || '').trim().toLowerCase()));
  const expectedSet = new Set(expectedHeaders.map((h) => h.toLowerCase()));

  const missing = expectedHeaders.filter((h) => !headerSet.has(h.toLowerCase()));
  const extras = headers.filter((h) => !expectedSet.has(String(h || '').trim().toLowerCase()));

  return {
    valid: missing.length === 0,
    missing,
    extras,
  };
}

// PUBLIC_INTERFACE
export function validateTemplateForm(form) {
  /**
   * Validate a template form object with fields:
   * { name, category, language, components: { header?, body, footer?, buttons? } }
   * Returns: { valid: boolean, errors: Record<string,string> }
   */
  const errors = {};

  const name = (form?.name || '').trim();
  if (!name) {
    errors.name = 'Template name is required.';
  } else if (name.length > MAX_LIMITS.TEMPLATE_NAME) {
    errors.name = `Template name must be ≤ ${MAX_LIMITS.TEMPLATE_NAME} characters.`;
  }

  const category = (form?.category || '').trim();
  if (!category) {
    errors.category = 'Category is required.';
  }

  const language = (form?.language || '').trim();
  if (!language) {
    errors.language = 'Language is required.';
  }

  const body = (form?.components?.body || '').trim();
  if (!body) {
    errors.body = 'Body is required.';
  } else if (body.length > MAX_LIMITS.TEMPLATE_BODY) {
    errors.body = `Body must be ≤ ${MAX_LIMITS.TEMPLATE_BODY} characters.`;
  }

  const header = (form?.components?.header || '').trim();
  if (header && header.length > MAX_LIMITS.TEMPLATE_HEADER) {
    errors.header = `Header must be ≤ ${MAX_LIMITS.TEMPLATE_HEADER} characters.`;
  }

  const footer = (form?.components?.footer || '').trim();
  if (footer && footer.length > MAX_LIMITS.TEMPLATE_FOOTER) {
    errors.footer = `Footer must be ≤ ${MAX_LIMITS.TEMPLATE_FOOTER} characters.`;
  }

  const buttons = form?.components?.buttons || [];
  if (Array.isArray(buttons)) {
    const quickReplies = buttons.filter((b) => (b?.type || '').toUpperCase() === 'QUICK_REPLY');
    if (quickReplies.length > MAX_LIMITS.QUICK_REPLY_COUNT) {
      errors.buttons = `Max ${MAX_LIMITS.QUICK_REPLY_COUNT} quick reply buttons allowed.`;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// PUBLIC_INTERFACE
export function hasVariables(text) {
  /** Checks if text contains template variables like {{1}}, {{name}}, or {{ variable }} */
  return /\{\{\s*[\w\d]+\s*\}\}/.test(String(text || ''));
}
