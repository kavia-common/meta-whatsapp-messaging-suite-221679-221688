//
// Environment utilities for the React app.
// Safely reads REACT_APP_* variables, provides defaults, and parses booleans/JSON.
//
// Usage:
//   import { env } from '../utils/env';
//   const apiUrl = env.API_BASE;
//
// PUBLIC_INTERFACE
export function getEnvVar(name, defaultValue = undefined) {
  /**
   * Returns the value of a REACT_APP_* environment variable, falling back to defaultValue.
   * Performs trimming and ensures empty strings are treated as undefined.
   */
  const raw = process.env[name];
  if (raw === undefined || raw === null) return defaultValue;
  const trimmed = String(raw).trim();
  return trimmed === '' ? defaultValue : trimmed;
}

// PUBLIC_INTERFACE
export function parseBool(val, defaultValue = false) {
  /**
   * Parses a boolean-like value from string/boolean/number safely.
   * Accepted truthy: '1', 'true', 'yes', 'on', 1, true
   * Accepted falsy: '0', 'false', 'no', 'off', 0, false
   */
  if (typeof val === 'boolean') return val;
  if (typeof val === 'number') return val !== 0;
  if (typeof val === 'string') {
    const v = val.trim().toLowerCase();
    if (['1', 'true', 'yes', 'on'].includes(v)) return true;
    if (['0', 'false', 'no', 'off', ''].includes(v)) return false;
  }
  return defaultValue;
}

// PUBLIC_INTERFACE
export function parseJson(val, defaultValue = {}) {
  /**
   * Parses a JSON string safely, returning defaultValue if parse fails or val is empty.
   */
  if (val === undefined || val === null) return defaultValue;
  if (typeof val === 'object') return val;
  try {
    const s = String(val).trim();
    if (!s) return defaultValue;
    return JSON.parse(s);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Failed to parse JSON env var:', e);
    return defaultValue;
  }
}

// Build the environment map with sensible defaults for local dev.
const NODE_ENV = getEnvVar('REACT_APP_NODE_ENV', process.env.NODE_ENV || 'development');

// Prefer REACT_APP_API_BASE, fallback to BACKEND_URL, else relative '/api' for proxy setups.
const API_BASE = getEnvVar('REACT_APP_API_BASE',
  getEnvVar('REACT_APP_BACKEND_URL', '/api')
);

// Optional URLs for front-end and websockets if used elsewhere.
const FRONTEND_URL = getEnvVar('REACT_APP_FRONTEND_URL', '');
const WS_URL = getEnvVar('REACT_APP_WS_URL', '');

// Telemetry and source maps flags (default off in production).
const NEXT_TELEMETRY_DISABLED = parseBool(getEnvVar('REACT_APP_NEXT_TELEMETRY_DISABLED', '1'), true);
const ENABLE_SOURCE_MAPS = parseBool(getEnvVar('REACT_APP_ENABLE_SOURCE_MAPS', NODE_ENV !== 'production' ? '1' : '0'), NODE_ENV !== 'production');

// Misc
const PORT = Number(getEnvVar('REACT_APP_PORT', '3000'));
const TRUST_PROXY = parseBool(getEnvVar('REACT_APP_TRUST_PROXY', '0'), false);
const LOG_LEVEL = getEnvVar('REACT_APP_LOG_LEVEL', NODE_ENV === 'production' ? 'warn' : 'debug');
const HEALTHCHECK_PATH = getEnvVar('REACT_APP_HEALTHCHECK_PATH', '/healthz');

// Feature flags and experiments
const RAW_FEATURE_FLAGS = getEnvVar('REACT_APP_FEATURE_FLAGS', '{}');
const FEATURE_FLAGS = parseJson(RAW_FEATURE_FLAGS, {});
const EXPERIMENTS_ENABLED = parseBool(getEnvVar('REACT_APP_EXPERIMENTS_ENABLED', '0'), false);

// PUBLIC_INTERFACE
export const env = {
  NODE_ENV,
  API_BASE,
  FRONTEND_URL,
  WS_URL,
  NEXT_TELEMETRY_DISABLED,
  ENABLE_SOURCE_MAPS,
  PORT,
  TRUST_PROXY,
  LOG_LEVEL,
  HEALTHCHECK_PATH,
  FEATURE_FLAGS,
  EXPERIMENTS_ENABLED,
};

// PUBLIC_INTERFACE
export function isProd() {
  /** Returns true when running in production mode. */
  return env.NODE_ENV === 'production';
}

// PUBLIC_INTERFACE
export function isDev() {
  /** Returns true when running in development mode. */
  return env.NODE_ENV !== 'production';
}
