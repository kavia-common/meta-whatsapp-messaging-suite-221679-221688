/**
 * Feature flags helper for the app.
 * Reads flags from env.FEATURE_FLAGS and REACT_APP_EXPERIMENTS_ENABLED.
 * Provides ergonomic accessors and type-safe boolean reading.
 */

import { env, parseBool } from '../utils/env';

// PUBLIC_INTERFACE
export function getFeatureFlag(flagName, defaultValue = false) {
  /**
   * Returns the boolean value of a feature flag. Supports string 'true'/'false' values too.
   */
  const value = env.FEATURE_FLAGS?.[flagName];
  if (value === undefined) return defaultValue;
  return parseBool(value, defaultValue);
}

// PUBLIC_INTERFACE
export function allFeatureFlags() {
  /**
   * Returns the raw feature flags object.
   */
  return { ...(env.FEATURE_FLAGS || {}) };
}

// PUBLIC_INTERFACE
export function isExperimentEnabled() {
  /**
   * Returns global experiments switch (REACT_APP_EXPERIMENTS_ENABLED).
   */
  return !!env.EXPERIMENTS_ENABLED;
}

// PUBLIC_INTERFACE
export function whenEnabled(flagName, on, off = () => null) {
  /**
   * Utility to pick a function or value based on a flag. Returns the invoked result.
   * Example:
   *   const content = whenEnabled('newDashboard', () => <New />, () => <Old />);
   */
  const enabled = getFeatureFlag(flagName, false);
  const chosen = enabled ? on : off;
  return typeof chosen === 'function' ? chosen() : chosen;
}
