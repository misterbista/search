import { Suspense } from "react";
import { SearchBar } from "~/components/SearchBar";
import { SearchResults } from "~/components/SearchResults";
import { TrendingGrid } from "~/components/TrendingGrid";
import { getTrendingMovies } from "~/lib/api";

interface HomePageProps {
  searchParams: Promise<{
    query?: string | string[];
    page?: string | string[];
  }>;
}
// Repeated query parameters arrive as arrays; use one deterministic value.
function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function TrendingMovies() {
  const movies = await getTrendingMovies().catch(() => null);
  return movies ? (
    <TrendingGrid movies={movies} />
  ) : (
    <p role="alert">Trending movies are temporarily unavailable.</p>
  );
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const query = firstValue(params.query)?.trim() ?? "";
  const requestedPage = Number(firstValue(params.page));
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 && requestedPage <= 500
      ? requestedPage
      : 1;

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-foreground">
          Movie Search Case
        </h1>
        <SearchBar initialQuery={query} />
      </header>

      {/* Search is server-rendered from the URL; keep its loading state local. */}
      {query && (
        <Suspense
          key={`${query}:${page}`}
          fallback={<p role="status">Searching movies…</p>}
        >
          <SearchResults query={query} page={page} />
        </Suspense>
      )}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium text-foreground">
          Trending this week
        </h2>
        <Suspense fallback={<p role="status">Loading trending movies…</p>}>
          <TrendingMovies />
        </Suspense>
      </section>
    </main>
  );
}
