using System.Diagnostics;
using Serilog.Context;
using Serilog.Core;
using Serilog.Events;

namespace SmartHomeEcomm.API.Logging;

public class CorrelationIdEnricher : ILogEventEnricher
{
    public const string HeaderName = "x-correlation-id";

    public void Enrich(LogEvent logEvent, ILogEventPropertyFactory factory)
    {
        var correlationId = Activity.Current?.TraceId.ToString() ?? Guid.NewGuid().ToString("N");
        logEvent.AddPropertyIfAbsent(factory.CreateProperty("CorrelationId", correlationId));
    }
}
