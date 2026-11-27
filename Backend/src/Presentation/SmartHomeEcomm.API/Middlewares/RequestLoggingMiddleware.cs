using System.Diagnostics;
using SmartHomeEcomm.API.Logging;
using Serilog.Context;
using Serilog.Extensions.Hosting;

namespace SmartHomeEcomm.API.Middlewares;

public class RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        var correlationId = ResolveCorrelationId(context);

        using (LogContext.PushProperty("CorrelationId", correlationId))
        using (logger.BeginScope(new Dictionary<string, object>
               {
                   ["CorrelationId"] = correlationId,
                   ["RequestMethod"] = context.Request.Method,
                   ["RequestPath"] = context.Request.Path.Value ?? string.Empty,
                   ["ClientIp"] = context.Connection.RemoteIpAddress?.ToString() ?? "unknown"
               }))
        {
            logger.LogInformation("Request started {RequestMethod} {RequestPath}", context.Request.Method, context.Request.Path.Value);

            var stopwatch = Stopwatch.StartNew();
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                logger.LogError(ex, "Request failed {RequestMethod} {RequestPath} after {ElapsedMs}ms",
                    context.Request.Method, context.Request.Path.Value, stopwatch.ElapsedMilliseconds);
                throw;
            }

            stopwatch.Stop();

            var statusCode = context.Response.StatusCode;
            var level = statusCode switch
            {
                >= 500 => LogLevel.Error,
                >= 400 => LogLevel.Warning,
                _ => LogLevel.Information
            };

            logger.Log(level, "Request completed {RequestMethod} {RequestPath} {StatusCode} in {ElapsedMs}ms",
                context.Request.Method, context.Request.Path.Value, statusCode, stopwatch.ElapsedMilliseconds);
        }
    }

    private static string ResolveCorrelationId(HttpContext context)
    {
        if (context.Request.Headers.TryGetValue(CorrelationIdEnricher.HeaderName, out var incoming)
            && !string.IsNullOrWhiteSpace(incoming))
        {
            context.Response.Headers[CorrelationIdEnricher.HeaderName] = incoming.ToString();
            return incoming.ToString();
        }

        var generated = Activity.Current?.TraceId.ToString() ?? Guid.NewGuid().ToString("N");
        context.Response.Headers[CorrelationIdEnricher.HeaderName] = generated;
        return generated;
    }
}
