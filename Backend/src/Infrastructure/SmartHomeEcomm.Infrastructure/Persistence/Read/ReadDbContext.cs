using SmartHomeEcomm.Infrastructure.Persistence.Write;
using Microsoft.EntityFrameworkCore;

namespace SmartHomeEcomm.Infrastructure.Persistence.Read;

public class ReadDbContext(DbContextOptions<ReadDbContext> options) : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(typeof(WriteDbContext).Assembly);
    }
}
