using System.Security.Claims;
using System.Text;
using Hangfire;
using SmartHomeEcomm.API.HealthChecks;
using SmartHomeEcomm.API.Middlewares;
using SmartHomeEcomm.API.Routing;
using SmartHomeEcomm.Application;
using SmartHomeEcomm.Application.Common.Interfaces;
using SmartHomeEcomm.Application.Common.Models;
using SmartHomeEcomm.Domain.Localization;
using SmartHomeEcomm.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Scalar.AspNetCore;
using Serilog;
using Serilog.Events;

namespace SmartHomeEcomm.API.Extensions;

public static class Extensions
{
    public static IServiceCollection RegisterAllServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddHttpContextAccessor();

        var jwtOptions = services.ConfigureJwtOptions();
        services.AddWebServices();
        services.AddInfrastructureServices(configuration);
        services.AddApplicationServices();
        services.ModifyApiBehaviourOptions();
        services.AddJwtAuthentication(jwtOptions);
        services.AddHealthChecks()
            .AddCheck<DatabaseHealthCheck>("database", tags: ["ready"]);

        return services;
    }

    public static async Task<WebApplication> ConfigureWebApplicationMiddlewaresAsync(this WebApplication app)
    {
        var forwarding = new ForwardedHeadersOptions
        {
            ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
        };
        forwarding.KnownIPNetworks.Clear();
        forwarding.KnownProxies.Clear();
        app.UseForwardedHeaders(forwarding);

        app.UseSerilogRequestLogging(options =>
        {
            options.GetLevel = (httpContext, _, ex) =>
                ex is not null || httpContext.Response.StatusCode >= 500 ? LogEventLevel.Error
                : httpContext.Response.StatusCode >= 400 ? LogEventLevel.Warning
                : LogEventLevel.Information;

            options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
            {
                diagnosticContext.Set("ClientIp", httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown");
                diagnosticContext.Set("RequestHost", httpContext.Request.Host.Value ?? string.Empty);
            };
        });

        app.UseMiddleware<RequestLoggingMiddleware>();
        app.UseMiddleware<GlobalErrorHandlingMiddleware>();

        app.MapOpenApi();
        app.MapScalarApiReference(options =>
        {
            options.AddPreferredSecuritySchemes("Bearer");
        });
        app.MapGet("/", () => Results.Redirect("/scalar/v1"));

        if (!app.Environment.IsDevelopment())
            app.UseHsts();

        var isContainer = string.Equals(
            Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER"), "true",
            StringComparison.OrdinalIgnoreCase);

        if (!app.Environment.IsDevelopment() && !isContainer)
            app.UseHttpsRedirection();

        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();

        app.MapHealthChecks("/healthz", new HealthCheckOptions { Predicate = _ => false }).AllowAnonymous();
        app.MapHealthChecks("/readyz", new HealthCheckOptions { Predicate = check => check.Tags.Contains("ready") }).AllowAnonymous();

        if (app.Environment.IsDevelopment())
            app.MapHangfireDashboard();

        await Task.CompletedTask;
        return app;
    }

    private static void AddWebServices(this IServiceCollection services)
    {
        services.AddControllers(options => options.Conventions.Add(new LowercaseRouteConvention()));
        services.AddOpenApi(options =>
        {
            options.AddDocumentTransformer((document, context, cancellationToken) =>
            {
                document.Components ??= new OpenApiComponents();
                document.Components.SecuritySchemes ??= new Dictionary<string, IOpenApiSecurityScheme>();
                document.Components.SecuritySchemes.Add("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT"
                });

                return Task.CompletedTask;
            });

            options.AddOperationTransformer((operation, context, cancellationToken) =>
            {
                var hasAuthorize = context.Description.ActionDescriptor.EndpointMetadata
                    .OfType<Microsoft.AspNetCore.Authorization.AuthorizeAttribute>()
                    .Any();

                if (!hasAuthorize) return Task.CompletedTask;

                operation.Security ??= new List<OpenApiSecurityRequirement>();
                operation.Security.Add(new OpenApiSecurityRequirement
                {
                    [new OpenApiSecuritySchemeReference("Bearer", context.Document)] = []
                });

                return Task.CompletedTask;
            });
        });
        services.AddEndpointsApiExplorer();
    }

    private static JwtOptions ConfigureJwtOptions(this IServiceCollection services)
    {
        var key = Environment.GetEnvironmentVariable("JWT_SECRET_KEY");
        if (string.IsNullOrEmpty(key) || key.Length < 32)
            throw new InvalidOperationException("JWT_SECRET_KEY environment variable must be set and be at least 32 characters.");

        var durationRaw = Environment.GetEnvironmentVariable("JWT_DURATION_DAYS");
        var durationInDays = string.IsNullOrEmpty(durationRaw) ? 7.0 : double.Parse(durationRaw);

        var jwtOptions = new JwtOptions
        {
            Key = key,
            Issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "SmartHomeEcomm",
            Audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "SmartHomeEcomm",
            DurationInDays = durationInDays
        };

        services.AddSingleton<IOptions<JwtOptions>>(new OptionsWrapper<JwtOptions>(jwtOptions));
        return jwtOptions;
    }

    private static void AddJwtAuthentication(this IServiceCollection services, JwtOptions jwtOptions)
    {
        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = jwtOptions.Issuer,
                ValidateAudience = true,
                ValidAudience = jwtOptions.Audience,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Key)),
                RoleClaimType = ClaimTypes.Role
            };
        });
    }

    private static void ModifyApiBehaviourOptions(this IServiceCollection services)
    {
        services.Configure<ApiBehaviorOptions>(cf =>
            cf.InvalidModelStateResponseFactory = (actionContext) =>
            {
                var locale = ErrorMessages.ResolveLocale(
                    actionContext.HttpContext.Request.Headers["x-locale"].FirstOrDefault());

                var errors = actionContext.ModelState.Where(ms => ms.Value!.Errors.Any())
                    .Select(m => new ValidationMessage
                    {
                        Field = m.Key,
                        Errors = m.Value!.Errors.Select(e => MapValidationError(m.Key, e.ErrorMessage, locale))
                    }).ToList();

                var response = new ValidationErrorResponse
                {
                    Code = ErrorCodes.ValidationError,
                    ErrorMessage = ErrorMessages.Get(ErrorCodes.ValidationError, locale),
                    Errors = errors
                };
                return new BadRequestObjectResult(response);
            });
    }

    private static string MapValidationError(string field, string error, string locale)
    {
        if (error.StartsWith("The ") && error.EndsWith(" field is required."))
            return ErrorMessages.Get(ErrorCodes.FieldRequired, locale, field);
        if (error.StartsWith("The value "))
            return ErrorMessages.Get(ErrorCodes.InvalidValue, locale, field);
        return error;
    }
}
