using System.Reflection;
using Serilog;
using Serilog.Configuration;
using Serilog.Events;
using Serilog.Formatting.Compact;

namespace SmartHomeEcomm.API.Logging;

public static class LoggingExtensions
{
    public static WebApplicationBuilder AddSmartHomeEcommLogging(this WebApplicationBuilder builder)
    {
        var environment = builder.Environment;
        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Information()
            .Enrich.FromLogContext()
            .Enrich.WithProperty("Application", "SmartHomeEcomm.API")
            .Enrich.WithProperty("Environment", environment.EnvironmentName)
            .WriteTo.Console(
                outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}")
            .CreateBootstrapLogger();

        builder.Host.UseSerilog((context, services, configuration) => configuration
            .ReadFrom.Configuration(context.Configuration)
            .ReadFrom.Services(services)
            .Enrich.FromLogContext()
            .Enrich.WithProperty("Application", "SmartHomeEcomm.API")
            .Enrich.WithProperty("Environment", environment.EnvironmentName)
            .Enrich.WithProperty("Version", Assembly.GetExecutingAssembly().GetName().Version?.ToString())
            .Enrich.With(new UserIdEnricher(services.GetRequiredService<IHttpContextAccessor>()))
            .Enrich.With<CorrelationIdEnricher>()
            .SeqIfConfigured(ResolveSeqUrl(context.Configuration)));

        return builder;
    }

    private static string? ResolveSeqUrl(IConfiguration configuration)
    {
        var url = Environment.GetEnvironmentVariable("SEQ_URL")
                  ?? configuration["Serilog:SinkUrl"]
                  ?? configuration["SEQ_URL"];

        if (string.IsNullOrWhiteSpace(url)) return null;

        if (!Uri.TryCreate(url, UriKind.Absolute, out var parsed)
            || (parsed.Scheme != Uri.UriSchemeHttp && parsed.Scheme != Uri.UriSchemeHttps))
        {
            Console.Error.WriteLine($"SEQ_URL '{url}' is not a valid absolute http(s) URL; the Seq sink is disabled.");
            return null;
        }

        return url;
    }

    public static ILoggingBuilder AddSmartHomeEcommLoggingScopes(this ILoggingBuilder logging)
    {
        logging.AddSerilog();
        return logging;
    }

    public static LogEventLevel ToSerilogLevel(this LogLevel level) => level switch
    {
        LogLevel.Trace => LogEventLevel.Verbose,
        LogLevel.Debug => LogEventLevel.Debug,
        LogLevel.Information => LogEventLevel.Information,
        LogLevel.Warning => LogEventLevel.Warning,
        LogLevel.Error => LogEventLevel.Error,
        LogLevel.Critical => LogEventLevel.Fatal,
        _ => LogEventLevel.Information
    };
}
