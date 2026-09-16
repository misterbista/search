# Notes

P0 first, then loading/empty/error and a11y. I skipped the detail page on purpose — search that actually works felt more important in four hours than a trailer page on top of a half-finished search.

## Rendering

Home was already a server page talking to the .NET API, so I kept search on that path. The URL is the source of truth (`?query=` / `&page=`). Submit and pagination just change the URL; the server fetches and renders. That gives shareable links and back/forward for free, without a client cache of results.

SearchBar is a client component because it needs local input, `useTransition` for pending UI, and it shouldn't clobber what you typed while a navigation is in flight. Results themselves are a server component behind Suspense, keyed on query + page so a new search doesn't sit on stale output.

Trending stays on the page even while you're searching. It's its own async component, so a slow search doesn't block the grid you already had. Trending is revalidated every 60s (same movies all week, no point hitting TMDB every request). Search is `no-store` — you want the page you asked for, not a cached one.

I considered a native GET form (no JS). Dropped it because clearing the box and the "Searching…" state are nicer with a small client island, and the results still come from the server.

## API

Same chain as trending: controller → handler factory → service → TMDB client → mapper. I didn't invent a second style.

Response is `{ movies, page, totalPages, totalResults }`. Empty query and page outside 1–500 are 400s. TMDB's 500-page cap is the ceiling on both sides.

## Frontend

- Search is submit-based, not typeahead. Fewer requests, and it matches a search box that already looked like a form.
- Empty input (including clearing the field) drops back to `/`.
- If someone pastes `page=999` and TMDB only has 3 pages, we redirect to page 1 of that query rather than an empty grid.
- Search and trending each own their fetch, skeleton/status, and error copy. The page just composes them. A failed search shouldn't take down trending, and the other way around.
- Pagination is prev/next plus "Page x of y". Infinite scroll would fight shareable page URLs; numbered pages felt like overkill for this.

## What I ran

`dotnet test` in `api/`. In `web/`: lint, typecheck, existing MovieCard test. I didn't add frontend tests for the search bar — time went into the actual flow.

## Skipped

- **Movie detail / trailer (P2).** Extra endpoint, page, and YouTube embed. Would have been next if search + pagination weren't the thing being graded.
- **TV search.** The app is movies-only on purpose; a second type is a product decision, not a free add-on.
- **Caching search.** Trending is stable enough to cache. Search isn't, until we know which queries repeat.
- **Debounce.** Nothing fires on keystroke, so there's nothing to debounce.
