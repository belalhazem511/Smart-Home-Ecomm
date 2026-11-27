using SmartHomeEcomm.Infrastructure.Persistence.Write;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace SmartHomeEcomm.API.HealthChecks;

public class DatabaseHealthCheck(WriteDbContext db, ILogger<DatabaseHealthCheck> logger) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var reachable = await db.Database.CanConnectAsync(cancellationToken);

            return reachable
                ? HealthCheckResult.Healthy("Write database is reachable.")
                : HealthCheckResult.Unhealthy("Write database connection could not be established.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Database health check failed");
            return HealthCheckResult.Unhealthy("Write database check threw an exception.", ex);
        }
    }
}
