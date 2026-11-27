using Serilog;

namespace SmartHomeEcomm.API.Logging;

public static class SeqSinkExtensions
{
    public static LoggerConfiguration SeqIfConfigured(this LoggerConfiguration logger, string? serverUrl)
    {
        if (string.IsNullOrWhiteSpace(serverUrl)) return logger;

        var apiKey = Environment.GetEnvironmentVariable("SEQ_API_KEY");

        return apiKey is null
            ? logger.WriteTo.Seq(serverUrl)
            : logger.WriteTo.Seq(serverUrl, apiKey: apiKey);
    }
}
