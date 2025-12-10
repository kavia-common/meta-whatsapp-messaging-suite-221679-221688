//
// Shared application constants and enums for the Meta WhatsApp Messaging Suite
//

// PUBLIC_INTERFACE
export const ROUTES = Object.freeze({
  ROOT: '/',
  DASHBOARD: '/',
  TEMPLATES: '/templates',
  MESSAGING: '/messaging',
  CONTACTS: '/contacts',
  APPROVALS: '/approvals',
  SETTINGS: '/settings',
});

// PUBLIC_INTERFACE
export const TemplateStatus = Object.freeze({
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
});

// PUBLIC_INTERFACE
export const Category = Object.freeze({
  MARKETING: 'MARKETING',
  UTILITY: 'UTILITY',
  AUTHENTICATION: 'AUTHENTICATION',
});

// PUBLIC_INTERFACE
export const Language = Object.freeze({
  EN_US: 'en_US',
  EN_GB: 'en_GB',
  ES_ES: 'es_ES',
  ES_MX: 'es_MX',
  FR_FR: 'fr_FR',
  DE_DE: 'de_DE',
  PT_BR: 'pt_BR',
  HI_IN: 'hi_IN',
});

// PUBLIC_INTERFACE
export const MessageComponentTypes = Object.freeze({
  HEADER: 'HEADER',
  BODY: 'BODY',
  FOOTER: 'FOOTER',
  BUTTONS: 'BUTTONS',
  URL: 'URL',
  QUICK_REPLY: 'QUICK_REPLY',
  PHONE_NUMBER: 'PHONE_NUMBER',
});

// PUBLIC_INTERFACE
export const DateFormats = Object.freeze({
  ISO: 'iso',
  HUMAN_DATE: 'human-date',
  HUMAN_DATETIME: 'human-datetime',
});

// PUBLIC_INTERFACE
export const MAX_LIMITS = Object.freeze({
  TEMPLATE_NAME: 512,
  TEMPLATE_BODY: 1024,
  TEMPLATE_HEADER: 60,
  TEMPLATE_FOOTER: 60,
  QUICK_REPLY_COUNT: 3,
});

// PUBLIC_INTERFACE
export const CSVHeaders = Object.freeze({
  CONTACTS: ['name', 'phone', 'country', 'tags'],
});

// PUBLIC_INTERFACE
export const META_TEMPLATE_CATEGORY_LABELS = Object.freeze({
  [Category.MARKETING]: 'Marketing',
  [Category.UTILITY]: 'Utility',
  [Category.AUTHENTICATION]: 'Authentication',
});

// PUBLIC_INTERFACE
export const LANGUAGE_LABELS = Object.freeze({
  [Language.EN_US]: 'English (US)',
  [Language.EN_GB]: 'English (UK)',
  [Language.ES_ES]: 'Spanish (Spain)',
  [Language.ES_MX]: 'Spanish (Mexico)',
  [Language.FR_FR]: 'French',
  [Language.DE_DE]: 'German',
  [Language.PT_BR]: 'Portuguese (Brazil)',
  [Language.HI_IN]: 'Hindi (India)',
});
