import { redirect } from "next/navigation";
import { MoviePagination } from "~/components/MoviePagination";
import { TrendingGrid } from "~/components/TrendingGrid";
import { searchMovies } from "~/lib/api";

export async function SearchResults({
  query,
  page,
}: {
  query: string;
  page: number;
}) {
  const result = await searchMovies(query, page).catch(() => null);

  if (!result) {
    return (
      <p role="alert">
        Search is unavailable. Please submit your search again.
      </p>
    );
  }
  // TMDB is authoritative for the available page range.
  if (page > Math.max(1, result.totalPages)) {
    redirect(`/?${new URLSearchParams({ query })}`);
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-medium text-foreground">
        Search results for &ldquo;{query}&rdquo;
      </h2>
      <p className="text-sm text-muted">
        {result.totalResults.toLocaleString()} results
      </p>
      <TrendingGrid
        movies={result.movies}
        emptyMessage={`No movies found for “${query}”.`}
      />
      <MoviePagination
        query={query}
        page={result.page}
        totalPages={Math.min(result.totalPages, 500)}
      />
    </section>
  );
}
