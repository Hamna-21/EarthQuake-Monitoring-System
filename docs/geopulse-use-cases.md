# GeoPulse Use Cases

## GP-AN-01: Analyze Historical Earthquake Activity in Pakistan

Primary actor: GeoPulse user.

Secondary actors:

- GeoPulse frontend.
- GeoPulse backend.
- MongoDB.
- USGS data source.
- Chart components.

Goal: allow users to explore Pakistan-area historical earthquake patterns through filters, summary cards, and readable charts.

Preconditions:

- GeoPulse is running.
- User can access the dashboard.
- Backend API is available.
- MongoDB historical analytics data is available.

Trigger: user opens Pakistan Historical Analytics or applies filters.

Main flow:

1. User opens Pakistan Historical Analytics.
2. Frontend loads default filters.
3. Hook creates an API request.
4. Backend validates the query.
5. Backend reads MongoDB historical analytics records.
6. Aggregation service builds cards and chart datasets.
7. Frontend renders summary cards and charts.
8. User changes filters.
9. Components update from the same filtered response.

Alternative flows:

- Invalid date range: backend rejects the request and the frontend shows an error.
- No records: frontend shows an empty state.
- Request cancelled: old request is ignored.
- MongoDB unavailable: backend returns an error instead of fake data.

Business rules:

- Start date cannot be after end date.
- Minimum magnitude cannot exceed maximum magnitude.
- Minimum depth cannot exceed maximum depth.
- Missing values must not be converted into fake zero values.
- Historical classification currently uses a broad Pakistan-area bounding box.

Acceptance criteria:

- Default historical total loads correctly.
- Cards and charts use the same backend response.
- Filtering updates all visible historical analytics.
- Errors do not crash the dashboard.
- Live Analytics remains unchanged.

## GP-AUTH-01: Register a New User

Goal: create a GeoPulse account.

Main flow: user enters valid details, backend validates input, password is stored securely, and the account becomes available for login.

Alternative flow: duplicate email or invalid fields show a friendly error.

Related files: authentication pages, auth routes, user model, auth controllers, MongoDB connection.

Acceptance criteria: user can register without affecting dashboard earthquake features.

## GP-AUTH-02: Log In

Goal: allow an existing user to access the dashboard.

Main flow: user submits credentials, backend validates them, token/session is created, and the dashboard opens.

Exception flow: wrong credentials show an error without revealing sensitive details.

Acceptance criteria: authenticated pages stay protected.

## GP-AUTH-03: Google Authentication

Goal: allow sign-in through Google OAuth.

Main flow: user selects Google login, OAuth verifies identity, backend creates or finds the user, and the dashboard opens.

Acceptance criteria: Google login does not bypass route protection.

## GP-DASH-01: View Dashboard Overview

Goal: show the main earthquake monitoring summary.

Main flow: frontend loads live earthquake data, renders cards, feed, map preview, and update time.

Exception flow: API error shows a clear dashboard state.

Acceptance criteria: overview numbers reflect the currently loaded dataset.

## GP-LIVE-01: View Live Earthquake Feed

Goal: show recent earthquake activity.

Main flow: live API data is fetched, normalized, filtered, and displayed in feed/table views.

Acceptance criteria: records preserve magnitude, place, time, depth, and coordinates from source data.

## GP-SEARCH-01: Search Global Earthquakes

Goal: find pages, locations, or earthquake records quickly.

Main flow: user types in the dashboard search, suggestions appear, user selects a match, and the dashboard navigates or filters.

Acceptance criteria: search is case-insensitive and does not create duplicate search bars.

## GP-MAP-01: Explore Global Map

Goal: inspect earthquake locations visually.

Main flow: valid coordinates become markers, popup shows details, strongest event is highlighted.

Exception flow: invalid coordinates are ignored.

Acceptance criteria: marker count matches valid coordinate records.

## GP-HIST-01: Explore Global Historical Earthquakes

Goal: search historical earthquakes by date, magnitude, and location.

Main flow: user applies filters, backend/source returns matching records, table and map update.

Acceptance criteria: historical values are not invented or mixed between events.

## GP-PAK-HIST-01: Explore Pakistan Historical Earthquakes

Goal: inspect Pakistan-area historical seismic records.

Main flow: user applies Pakistan filters, results table/cards/map use the same filtered dataset.

Business rule: Pakistan matching must not label global records as Pakistan records.

Acceptance criteria: search for Pakistan must not return unrelated global-only data.

## GP-DETAIL-01: View Earthquake Details

Goal: inspect one selected earthquake.

Main flow: user opens details from a card, row, marker, or feed item and sees source fields.

Acceptance criteria: details show the selected event only.

## GP-NEARBY-01: Find Nearby Earthquakes

Goal: show earthquakes within a selected radius of the user.

Main flow: user grants location permission, app calculates distances, and shows only earthquakes inside radius.

Exception flow: permission denied shows a friendly message.

Acceptance criteria: “nearby” is based on calculated distance.

## GP-AN-LIVE-01: Analyze Live Earthquake Trends

Goal: understand recent earthquake patterns.

Main flow: existing Live Analytics uses current live data and renders its preserved charts.

Acceptance criteria: Live Analytics does not depend on MongoDB historical backfill.

## GP-FILTER-01: Filter Earthquake Records

Goal: narrow records by date, magnitude, depth, alert, tsunami, or location.

Acceptance criteria: all visible widgets use the filtered dataset.

## GP-SORT-01: Sort Records

Goal: reorder earthquake records by important fields.

Acceptance criteria: sorting does not separate one event’s properties from its coordinates.

## GP-PAGE-01: Navigate Paginated Records

Goal: browse large result sets safely.

Acceptance criteria: page changes preserve filters and do not duplicate rows.

## GP-SAFETY-01: View Safety Guidance

Goal: help users learn earthquake safety actions.

Acceptance criteria: content is informational and does not claim official emergency authority.

## GP-AI-01: Use GeoPulse AI Assistant

Goal: ask earthquake, safety, seismic data, and GeoPulse dashboard questions.

Acceptance criteria: assistant remains focused on the earthquake domain and handles errors safely.

## GP-ALERT-01: Manage Alerts

Goal: view important alert states.

Acceptance criteria: missing alert data is labeled as unavailable, not converted into fake safety status.

## GP-WARN-01: View Warning Status

Goal: understand current warning indicators.

Acceptance criteria: warning labels are based on available source data.

## GP-STRONG-01: View Strongest Earthquake

Goal: identify the strongest event in the active dataset.

Acceptance criteria: highest magnitude is calculated dynamically from current data.

## GP-MAP-HIGHLIGHT-01: Highlight Strongest Map Event

Goal: visually emphasize the strongest earthquake marker.

Acceptance criteria: all tied highest-magnitude events are highlighted.

## GP-ERR-01: Handle Failed API Requests

Goal: keep the app usable when data calls fail.

Acceptance criteria: user sees loading, empty, or error states instead of broken UI.

## GP-FALLBACK-01: Use Database Fallback

Goal: keep historical analytics stable when external APIs are slow.

Acceptance criteria: fallback source is labeled and stale data is not silently presented as fresh.

## GP-SYNC-01: Synchronize External Earthquake Data

Goal: import external earthquake records safely.

Acceptance criteria: records are deduplicated by external event ID.

## GP-MOBILE-01: Use GeoPulse on Mobile

Goal: make dashboard pages readable and touch-friendly.

Acceptance criteria: cards stack cleanly and charts do not overflow.

## GP-AUTH-04: Log Out

Goal: end the authenticated session.

Acceptance criteria: protected dashboard pages are no longer accessible after logout.
