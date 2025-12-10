//
// Meta WhatsApp specific helpers and mappings
//
import {
  Category,
  LANGUAGE_LABELS,
  META_TEMPLATE_CATEGORY_LABELS,
  Language,
  MessageComponentTypes,
} from './constants';

// PUBLIC_INTERFACE
export function getMetaCategoryOptions() {
  /** Returns {value,label} pairs for template categories. */
  return Object.values(Category).map((c) => ({
    value: c,
    label: META_TEMPLATE_CATEGORY_LABELS[c] || c,
  }));
}

// PUBLIC_INTERFACE
export function getLanguageOptions() {
  /** Returns {value,label} pairs for languages supported by the app. */
  return Object.values(Language).map((l) => ({
    value: l,
    label: LANGUAGE_LABELS[l] || l,
  }));
}

// PUBLIC_INTERFACE
export function getComponentTypeLabel(type) {
  /** Returns a display label for a message component type */
  const t = (type || '').toUpperCase();
  switch (t) {
    case MessageComponentTypes.HEADER:
      return 'Header';
    case MessageComponentTypes.BODY:
      return 'Body';
    case MessageComponentTypes.FOOTER:
      return 'Footer';
    case MessageComponentTypes.BUTTONS:
      return 'Buttons';
    case MessageComponentTypes.URL:
      return 'URL Button';
    case MessageComponentTypes.QUICK_REPLY:
      return 'Quick Reply';
    case MessageComponentTypes.PHONE_NUMBER:
      return 'Phone Button';
    default:
      return type || 'Unknown';
  }
}

// PUBLIC_INTERFACE
export function renderPreviewParts(components) {
  /**
   * Build a preview model from template components:
   * Input structure example:
   * {
   *   header: "Welcome {{name}}",
   *   body: "Your order {{1}} has shipped",
   *   footer: "Thanks!",
   *   buttons: [{ type: 'QUICK_REPLY', text: 'Track' }, { type: 'URL', text: 'Open', url: 'https://...' }]
   * }
   * Returns:
   * { header: string|null, body: string, footer: string|null, buttons: Array<{type,label,meta?}> }
   */
  const header = (components?.header || '').trim() || null;
  const body = (components?.body || '').trim() || '';
  const footer = (components?.footer || '').trim() || null;
  const btns = Array.isArray(components?.buttons) ? components.buttons : [];

  const buttons = btns.map((b) => {
    const type = (b?.type || '').toUpperCase();
    if (type === MessageComponentTypes.URL) {
      return { type, label: b?.text || 'Open', meta: { url: b?.url || '' } };
    }
    if (type === MessageComponentTypes.PHONE_NUMBER) {
      return { type, label: b?.text || 'Call', meta: { phone_number: b?.phone_number || '' } };
    }
    // QUICK_REPLY and others
    return { type, label: b?.text || getComponentTypeLabel(type) };
  });

  return { header, body, footer, buttons };
}
