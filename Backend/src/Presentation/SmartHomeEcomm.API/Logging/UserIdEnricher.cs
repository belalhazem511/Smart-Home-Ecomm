using Serilog.Core;
using Serilog.Events;

namespace SmartHomeEcomm.API.Logging;

public class UserIdEnricher : ILogEventEnricher
{
    private readonly IHttpContextAccessor _accessor;

    public UserIdEnricher(IHttpContextAccessor accessor) => _accessor = accessor;

    public void Enrich(LogEvent logEvent, ILogEventPropertyFactory factory)
    {
        var user = _accessor.HttpContext?.User;
        if (user?.Identity?.IsAuthenticated != true) return;

        var userId = user.FindFirst("sub")?.Value
                     ?? user.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        if (!string.IsNullOrWhiteSpace(userId))
            logEvent.AddPropertyIfAbsent(factory.CreateProperty("UserId", userId));
    }
}
