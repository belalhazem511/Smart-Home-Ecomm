using Hangfire;
using SmartHomeEcomm.Application.Common.Interfaces;
using SmartHomeEcomm.Domain.Contracts;
using SmartHomeEcomm.Domain.Interfaces;
using SmartHomeEcomm.Infrastructure.Caching;
using SmartHomeEcomm.Infrastructure.BackgroundJobs;
using SmartHomeEcomm.Infrastructure.Email;
using SmartHomeEcomm.Infrastructure.Persistence;
using SmartHomeEcomm.Infrastructure.Persistence.Read;
using SmartHomeEcomm.Infrastructure.Persistence.Repositories;
using SmartHomeEcomm.Infrastructure.Persistence.Write;
using SmartHomeEcomm.Infrastructure.Security;
using SmartHomeEcomm.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace SmartHomeEcomm.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        var writeConnection = Environment.GetEnvironmentVariable("DB_CONNECTION_WRITE")
            ?? configuration.GetConnectionString("Write")
            ?? configuration.GetConnectionString("Default");
        var readConnection = Environment.GetEnvironmentVariable("DB_CONNECTION_READ")
            ?? configuration.GetConnectionString("Read")
            ?? writeConnection;

        services.AddDbContext<WriteDbContext>(options => options.UseSqlServer(writeConnection));
        services.AddDbContext<ReadDbContext>(options => options.UseSqlServer(readConnection));

        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<ICacheService, CacheService>();
        services.AddScoped<ITokenService, JwtTokenService>();
        services.AddHangfire(config => config.UseSqlServerStorage(writeConnection));
        services.AddHangfireServer();
        services.AddScoped<IBackgroundJobs, HangfireBackgroundJobService>();
        services.AddSingleton<IDateTime, SystemDateTime>();
        services.AddHttpClient<ResendEmailService>();
        services.AddScoped<IEmailSender>(sp => sp.GetRequiredService<ResendEmailService>());
        services.AddDistributedMemoryCache();

        return services;
    }
}
