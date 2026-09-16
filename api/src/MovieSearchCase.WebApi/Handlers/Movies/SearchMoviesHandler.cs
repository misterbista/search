using Microsoft.AspNetCore.Mvc;
using MovieSearchCase.Domain.Interfaces.Services;
using MovieSearchCase.Shared;
using MovieSearchCase.WebApi.Mappers;

namespace MovieSearchCase.WebApi.Handlers.Movies;

public class SearchMoviesHandler(IMovieService movieService, string query, int page) : IRequestHandlerAsync
{

    public async Task<IActionResult> HandleAsync(HttpRequest request)
    {
        var searchResult = await movieService.SearchAsync(
            query,
            page,
            request.HttpContext.RequestAborted);

        return new OkObjectResult(searchResult.ToApiModel());
    }
}
