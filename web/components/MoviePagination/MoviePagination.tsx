import Link from "next/link";

export interface MoviePaginationProps {
  query: string;
  page: number;
  totalPages: number;
}

const linkClassName =
  "rounded-md border border-border px-3 py-2 text-muted hover:border-brand-500 hover:text-foreground focus:border-brand-500 focus:outline-none";
const disabledClassName =
  "rounded-md border border-border px-3 py-2 text-muted/50";

export function MoviePagination({
  query,
  page,
  totalPages,
}: MoviePaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Search results pagination"
      className="flex items-center justify-center gap-2 text-sm"
    >
      {page > 1 ? (
        <Link
          href={{ pathname: "/", query: { query, page: page - 1 } }}
          className={linkClassName}
        >
          Previous
        </Link>
      ) : (
        <span className={disabledClassName}>Previous</span>
      )}

      <span className="px-2 text-muted" aria-live="polite">
        Page {page} of {totalPages}
      </span>

      {page < totalPages ? (
        <Link
          href={{ pathname: "/", query: { query, page: page + 1 } }}
          className={linkClassName}
        >
          Next
        </Link>
      ) : (
        <span className={disabledClassName}>Next</span>
      )}
    </nav>
  );
}
