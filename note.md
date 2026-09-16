# Implementation notes

## Why server rendering

The existing page and API helper already fetch data on the server. Keeping search there reuses that flow and avoids separate browser fetching and result state. This suits submit-based search with page links.

The server renders results; the client search bar handles input, navigation, and pending feedback. Shareable URLs and back/forward navigation come from URL state, not SSR itself.

Each search requires a server round trip. Search and trending use separate async server components with Suspense, so each section can appear as it becomes ready. Trending is cached for 60 seconds; search is uncached.

## Implementation

- Preserves the existing controller → handler → service → client flow and mappers.
- Returns `movies`, `page`, `totalPages`, and `totalResults`; validates queries and pages 1–500.
- Keeps trending visible, resets search on clear, and redirects pages beyond the result count to page 1.
- Each section owns its fetch, loading state, and failure message; the home page composes them.

## Verification and scope

API build, frontend lint, typecheck, and the existing movie-card test passed. API tests passed earlier. Current frontend tests do not cover search interactions.

## Left out

- **Details and trailers:** require additional endpoints, a page, and video handling; prioritized search and pagination first.
- **TV search:** adds a second content type and UI choices beyond the movie-only scope.
- **Search caching:** deferred until repeated-query traffic justifies cache duration and freshness decisions. Trending has more predictable reuse.
- **Debouncing:** search runs on submit, so typing does not send requests.
