using System.Diagnostics;
using MediatR;
using Microsoft.Extensions.Logging;

namespace SmartHomeEcomm.Application.Common.Behaviors;

public class LoggingBehavior<TRequest, TResponse>(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;
        var stopwatch = Stopwatch.StartNew();

        try
        {
            var response = await next();
            stopwatch.Stop();
            logger.LogInformation("Handled {Request} in {Elapsed}ms", requestName, stopwatch.ElapsedMilliseconds);
            return response;
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            logger.LogError(ex, "Error handling {Request} in {Elapsed}ms", requestName, stopwatch.ElapsedMilliseconds);
            throw;
        }
    }
}
