"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export interface SearchBarProps {
  initialQuery?: string;
}

export function SearchBar({ initialQuery = "" }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();
  const submittedQuery = useRef<string | null>(null);

  useEffect(() => {
    const submitted = submittedQuery.current;
    // A server navigation must not overwrite text typed while it was pending.
    setQuery((current) =>
      submitted?.trim() === initialQuery && current !== submitted
        ? current
        : initialQuery,
    );
    submittedQuery.current = null;
  }, [initialQuery]);

  function navigate(query: string) {
    submittedQuery.current = query;
    query = query.trim();
    const href = query ? `/?${new URLSearchParams({ query })}` : "/";
    startTransition(() => router.push(href));
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        navigate(query);
      }}
      className="flex w-full max-w-md gap-2"
      aria-busy={isPending}
    >
      <label htmlFor="movie-search" className="sr-only">
        Search for a movie
      </label>
      <input
        id="movie-search"
        type="search"
        name="query"
        value={query}
        onChange={({ target }) => {
          setQuery(target.value);
          if (!target.value.trim()) navigate("");
        }}
        placeholder="Search for a movie…"
        autoComplete="off"
        className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-brand-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 disabled:cursor-wait disabled:opacity-60"
      >
        {isPending ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
