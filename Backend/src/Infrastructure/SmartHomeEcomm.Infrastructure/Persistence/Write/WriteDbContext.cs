using Microsoft.EntityFrameworkCore;

namespace SmartHomeEcomm.Infrastructure.Persistence.Write;

public class WriteDbContext(DbContextOptions<WriteDbContext> options) : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(typeof(WriteDbContext).Assembly);
    }
}
