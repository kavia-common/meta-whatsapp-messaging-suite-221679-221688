//
// Environment utilities for the React app.
// Safely reads REACT_APP_* variables, provides defaults, and parses booleans/JSON.
// Usage:
//   import { env, getEnv, parseBool, parseJson } from '../utils/env';
//   const apiUrl = env.API_BASE;
//
// Notes:
// - Do not read .env directly; values are injected at build-time into process.env.
// - All public functions are marked with PUBLIC_INTERFACE as required.
//

/**
 * INTERNAL: Fetch and normalize an env var value.
 * Treats undefined/null/empty-string as undefined to allow defaulting.
 */
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
   * Accepted falsy: '0', 'false', 'no', 'off', 0, false, ''
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

// Compute normalized values with sensible defaults
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

// Log level: debug (dev), info (test), warn (prod) defaulting based on NODE_ENV
const DEFAULT_LOG_LEVEL = NODE_ENV === 'production' ? 'warn' : (NODE_ENV === 'test' ? 'info' : 'debug');
const LOG_LEVEL = String(getEnvVar('REACT_APP_LOG_LEVEL', DEFAULT_LOG_LEVEL)).toLowerCase();

const HEALTHCHECK_PATH = getEnvVar('REACT_APP_HEALTHCHECK_PATH', '/healthz');

// Feature flags and experiments
const RAW_FEATURE_FLAGS = getEnvVar('REACT_APP_FEATURE_FLAGS', '{}');
const FEATURE_FLAGS = parseJson(RAW_FEATURE_FLAGS, {});
const EXPERIMENTS_ENABLED = parseBool(getEnvVar('REACT_APP_EXPERIMENTS_ENABLED', '0'), false);

/**
 * PUBLIC_INTERFACE
 * Return a snapshot of current environment variables in a simple object.
 */
// PUBLIC_INTERFACE
export function getEnv() {
  return {
    REACT_APP_NODE_ENV: env.NODE_ENV,
    REACT_APP_API_BASE: env.API_BASE,
    REACT_APP_FRONTEND_URL: env.FRONTEND_URL,
    REACT_APP_WS_URL: env.WS_URL,
    REACT_APP_NEXT_TELEMETRY_DISABLED: env.NEXT_TELEMETRY_DISABLED,
    REACT_APP_ENABLE_SOURCE_MAPS: env.ENABLE_SOURCE_MAPS,
    REACT_APP_PORT: env.PORT,
    REACT_APP_TRUST_PROXY: env.TRUST_PROXY,
    REACT_APP_LOG_LEVEL: env.LOG_LEVEL,
    REACT_APP_HEALTHCHECK_PATH: env.HEALTHCHECK_PATH,
    REACT_APP_FEATURE_FLAGS: JSON.stringify(env.FEATURE_FLAGS || {}),
    REACT_APP_EXPERIMENTS_ENABLED: env.EXPERIMENTS_ENABLED,
  };
}

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
