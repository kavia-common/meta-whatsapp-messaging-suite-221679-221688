# Meta WhatsApp Messaging Suite — React Frontend

## Overview

This frontend provides a modern dashboard interface for creating WhatsApp messaging templates, submitting them for approval, managing contact lists, and sending bulk messages via Meta Business Suite. The UI follows the Ocean Professional theme and is implemented in React with a lightweight component approach and minimal dependencies.

The app expects a backend that proxies requests to Meta Business Suite APIs and exposes REST and WebSocket endpoints for authentication, templates, contacts, messaging, and approvals.

## Ocean Professional Theme

The Ocean Professional theme uses blue as the primary accent and amber for highlights, aligning with a modern aesthetic. Colors, spacing, and component styles aim to keep the interface clean and readable. Theme CSS lives at:
- src/styles/theme.css

The root layout sets the theme on the html element via a data-theme attribute. See:
- src/App.js (applies the theme)
- src/styles/theme.css (theme variables and base rules)

## Project Structure (key folders)

- src/router/AppRouter.js — App routing and page wiring
- src/pages/ — Top-level pages (Messaging, Templates, Contacts, Approvals, Settings)
- src/components/ — Reusable and feature components
- src/state/ — Global state store and slices
- src/api/ — HTTP client, feature APIs, and feature flags
- src/ws/ — WebSocket client and channels (e.g., messaging progress)
- src/utils/ — Utilities (env, formatters, validators, CSV parsing)
- src/styles/theme.css — Theme styles for Ocean Professional

## Prerequisites

- Node.js 18+ and npm
- A running backend exposing the expected endpoints (documented below)
- A configured Meta Business Suite application (for real API interactions)

## Getting Started

1) Install dependencies:
   npm install

2) Configure environment:
   - Copy .env.example to .env
   - Update values for your environment (see Environment Variables)

3) Start the development server:
   npm start
   The app will be available at http://localhost:3000 by default.

4) Run tests:
   CI=true npm test

5) Build for production:
   npm run build

## Environment Setup

Copy .env.example to .env and customize for your environment. Only variables prefixed with REACT_APP_ are exposed to the frontend at build time.

Key variables:
- REACT_APP_API_BASE: Base URL for backend REST API calls used by api/httpClient.js
- REACT_APP_BACKEND_URL: Public backend base (useful when behind a proxy)
- REACT_APP_FRONTEND_URL: Public frontend base (used for redirects)
- REACT_APP_WS_URL: WebSocket URL for real-time updates
- REACT_APP_NODE_ENV: development | production | test
- REACT_APP_NEXT_TELEMETRY_DISABLED: 1 disables telemetry (parity across repos)
- REACT_APP_ENABLE_SOURCE_MAPS: true/false for production source maps
- REACT_APP_PORT: Dev server port
- REACT_APP_TRUST_PROXY: true if behind a reverse proxy
- REACT_APP_LOG_LEVEL: silent | error | warn | info | debug | trace
- REACT_APP_HEALTHCHECK_PATH: Path that can be probed for a health check
- REACT_APP_FEATURE_FLAGS: JSON string of feature flags consumed by src/api/featureFlags.js
- REACT_APP_EXPERIMENTS_ENABLED: Global toggle for experimental features

Reference file:
- src/utils/env.js (reads and normalizes env values)

## Running the App

- Development mode:
  npm start
  Ensure the backend is running and accessible at REACT_APP_API_BASE and REACT_APP_WS_URL (with appropriate CORS and WebSocket support).

- Production build:
  npm run build
  Serve the build/ directory using your preferred static file server or CDN. Ensure environment values match the target environment at build time.

## Environment Variables

The app relies on the following environment variables. See .env.example for recommended defaults.

- REACT_APP_API_BASE
- REACT_APP_BACKEND_URL
- REACT_APP_FRONTEND_URL
- REACT_APP_WS_URL
- REACT_APP_NODE_ENV
- REACT_APP_NEXT_TELEMETRY_DISABLED
- REACT_APP_ENABLE_SOURCE_MAPS
- REACT_APP_PORT
- REACT_APP_TRUST_PROXY
- REACT_APP_LOG_LEVEL
- REACT_APP_HEALTHCHECK_PATH
- REACT_APP_FEATURE_FLAGS
- REACT_APP_EXPERIMENTS_ENABLED

Feature flags are accessed via:
- src/api/featureFlags.js
Environment parsing is centralized in:
- src/utils/env.js

## Expected Backend Endpoints and Contracts

Note: Exact paths may vary by implementation. The following outlines expected categories and typical shapes. API clients use placeholders that assume REACT_APP_API_BASE is prepended. See src/api/*.js for the actual calls.

- Authentication (src/api/authApi.js)
  - GET /auth/session: Returns the current user session.
    Example response: { "authenticated": true, "user": { "id": "u_123", "name": "Alice" } }
  - GET /auth/login: Initiates an auth flow (may return a redirect URL or perform redirect server-side).
  - POST /auth/logout: Logs out the current session.
  - Notes: AuthGuard (src/components/auth/AuthGuard.js) gates routes based on session state. LoginButton redirects to /auth/login. LogoutButton calls /auth/logout.

- Templates (src/api/templatesApi.js)
  - GET /templates: List templates with status and metadata.
  - POST /templates: Create a new template for approval with variables/sections.
  - PUT /templates/:id: Update template content or metadata.
  - DELETE /templates/:id: Remove a template (if supported).
  - GET /templates/:id: Retrieve a single template.
  - Expected fields commonly include: id, name, category, language, status (e.g., pending, approved, rejected), components.

- Contacts (src/api/contactsApi.js)
  - GET /contacts/lists: Retrieve contact lists.
  - POST /contacts/lists: Create/upload a new contact list (CSV support expected).
  - GET /contacts/lists/:id: Fetch list details and counts.
  - DELETE /contacts/lists/:id: Delete a contact list.
  - Expected fields commonly include: id, name, size, createdAt.

- Messaging (src/api/messagingApi.js)
  - POST /campaigns: Create or schedule a campaign to send a template to a contact list.
  - GET /campaigns/:id: Fetch campaign details.
  - GET /campaigns/:id/delivery: Delivery report summary for a campaign.
  - Expected request shape commonly includes: templateId, contactListId, variables, schedule options.
  - Expected response includes campaign id and initial status.

- Approvals (src/api/approvalsApi.js)
  - GET /approvals: Retrieve template submission statuses.
  - GET /approvals/:templateId: Detailed status for a specific template.
  - Expected fields commonly include: templateId, status, reviewerNotes, submittedAt.

Placeholders and base URL:
- All API modules import httpClient (src/api/httpClient.js), which builds full URLs using REACT_APP_API_BASE.
- Update your backend routes accordingly or adapt the client paths as needed.

## WebSocket Usage

The frontend listens for real-time campaign progress and delivery updates via REACT_APP_WS_URL. The WebSocket client is at:
- src/ws/wsClient.js
- src/ws/channels/messagingProgress.js

Expected message shape (indicative):
{
  "type": "campaign_progress",
  "campaignId": "cmp_123",
  "progress": { "sent": 120, "failed": 3, "total": 500 },
  "status": "running",
  "timestamp": "2025-01-01T12:00:00Z"
}

Other message types may include delivery events and completion notices. The messaging slice (src/state/slices/messagingSlice.js) consumes these updates to reflect progress in components like SendProgress and DeliveryReport.

## Authentication Flow and Guarded Routes

- Session check: On app load or when navigating to guarded routes, the frontend calls /auth/session via authApi.js to determine if the user is authenticated.
- Login: If unauthenticated, LoginButton triggers a redirect to /auth/login. Depending on your backend, this may return a URL or perform a server-side redirect to an IdP. After successful login, users are redirected back to REACT_APP_FRONTEND_URL.
- Logout: LogoutButton calls /auth/logout, clears session state, and returns the user to a public route.
- Guarded routes: AuthGuard wraps protected pages (e.g., Messaging, Contacts, Templates, Approvals) and renders only when authenticated. See src/components/auth/AuthGuard.js and src/router/AppRouter.js.

## Scripts

- npm start — Run dev server
- npm test — Run tests (use CI=true in CI)
- npm run build — Build production bundle

## Troubleshooting

- Missing backend / 404s
  - Symptom: API calls fail with network errors or 404.
  - Fix: Ensure REACT_APP_API_BASE points to a reachable backend and routes exist as expected.

- CORS issues
  - Symptom: Browser blocks requests with CORS errors.
  - Fix: Configure CORS on the backend to allow the frontend origin (REACT_APP_FRONTEND_URL). Include credentials if using cookie-based sessions.

- 401 Unauthorized
  - Symptom: Auth endpoints return 401 or guarded pages never load.
  - Fix: Confirm session cookies/headers flow correctly. Check /auth/session and that /auth/login redirects/returns properly. Verify the frontend and backend share the same top-level domain or configure cookie settings (SameSite, Secure) appropriately.

- WebSocket connection failures
  - Symptom: No real-time updates; WebSocket errors in console.
  - Fix: Confirm REACT_APP_WS_URL is correct and backend supports ws/wss. If behind a proxy, enable WebSocket upgrade/forwarding. Validate auth headers/cookies if required.

- Missing env vars
  - Symptom: Runtime behavior is incorrect or API base resolves to undefined.
  - Fix: Ensure .env exists and includes all required REACT_APP_* variables before building/running. Rebuild after changing env values.

- Source maps disabled
  - Symptom: Hard to debug production errors.
  - Fix: Set REACT_APP_ENABLE_SOURCE_MAPS=true for the build if your hosting policy allows it.

- Proxy/ingress headers
  - Symptom: URL generation or cookies behave unexpectedly behind load balancers.
  - Fix: Set REACT_APP_TRUST_PROXY=true and configure your reverse proxy to forward X-Forwarded-* headers correctly.

## Notes on Required Backend Routes

The frontend assumes the following categories of routes exist on the backend:
- /auth/* for session, login, logout
- /templates/* for listing, creating, updating, deleting, and retrieving templates
- /contacts/* for managing contact lists and uploads
- /campaigns/* and related delivery endpoints for messaging
- /approvals/* for template submission/approval statuses
- WebSocket endpoint at REACT_APP_WS_URL (e.g., /ws) for campaign progress and delivery events

If your backend deviates from these paths, update the corresponding API modules under src/api/ and the WebSocket channel under src/ws/channels/messagingProgress.js accordingly.

## Key Files Reference

- src/App.js — Root layout with theme application
- src/styles/theme.css — Ocean Professional theme styles
- src/router/AppRouter.js — Route definitions and guarded pages
- src/components/auth/AuthGuard.js — Route protection
- src/api/httpClient.js — HTTP client with base URL composition
- src/api/*.js — Feature-specific API clients
- src/ws/wsClient.js — WebSocket client
- src/ws/channels/messagingProgress.js — Messaging progress channel
- src/state/slices/*.js — Redux-like slices for app state

## License

This project is part of a generated template and intended for internal/demo use. Adapt licensing as appropriate for your organization.
