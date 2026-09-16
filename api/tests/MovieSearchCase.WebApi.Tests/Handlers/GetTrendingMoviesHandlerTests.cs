using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using MovieSearchCase.Domain.Entities;
using MovieSearchCase.Domain.Interfaces.Services;
using MovieSearchCase.WebApi.Handlers.Movies;
using Xunit;
using ApiMovie = MovieSearchCase.WebApi.Models.Movies.Movie;
using ApiMovieSearchResult = MovieSearchCase.WebApi.Models.Movies.MovieSearchResult;

namespace MovieSearchCase.WebApi.Tests.Handlers;

public class GetTrendingMoviesHandlerTests
{
    [Fact]
    public async Task HandleShouldReturnOkWithMappedMoviesWhenServiceSucceeds()
    {
        var trending = new List<Movie>
        {
            new()
            {
                Id = 1,
                Title = "A Trending Movie",
                VoteAverage = 8.1,
            },
        };

        var movieServiceMock = new Mock<IMovieService>();
        movieServiceMock
            .Setup(service => service.GetTrendingAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(trending);

        var handler = new GetTrendingMoviesHandler(movieServiceMock.Object);
        var httpContext = new DefaultHttpContext();

        var result = await handler.HandleAsync(httpContext.Request);

        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        var movies = okResult.Value.Should().BeAssignableTo<IEnumerable<ApiMovie>>().Subject;
        movies.Should().ContainSingle(movie => movie.Id == 1 && movie.Title == "A Trending Movie");
    }

    [Fact]
    public async Task SearchHandleShouldReturnMappedPagedResultsWhenServiceSucceeds()
    {
        var searchResult = new MovieSearchResult
        {
            Movies =
            [
                new Movie
                {
                    Id = 1,
                    Title = "A Search Result",
                    VoteAverage = 8.1,
                },
            ],
            Page = 2,
            TotalPages = 3,
            TotalResults = 51,
        };

        var movieServiceMock = new Mock<IMovieService>();
        movieServiceMock
            .Setup(service => service.SearchAsync("search", 2, It.IsAny<CancellationToken>()))
            .ReturnsAsync(searchResult);

        var handler = new SearchMoviesHandler(movieServiceMock.Object, "search", 2);
        var httpContext = new DefaultHttpContext();

        var result = await handler.HandleAsync(httpContext.Request);

        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        var response = okResult.Value.Should().BeOfType<ApiMovieSearchResult>().Subject;
        response.Page.Should().Be(2);
        response.TotalPages.Should().Be(3);
        response.TotalResults.Should().Be(51);
        response.Movies.Should().ContainSingle(movie => movie.Id == 1 && movie.Title == "A Search Result");
    }
}
