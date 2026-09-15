namespace MovieSearchCase.Domain.Entities;

public record MovieSearchResult
{
    public required IReadOnlyList<Movie> Movies { get; init; }

    public int Page { get; init; }

    public int TotalPages { get; init; }

    public int TotalResults { get; init; }
}
