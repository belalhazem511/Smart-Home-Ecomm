using SmartHomeEcomm.API.Extensions;
using SmartHomeEcomm.API.Logging;

DotNetEnv.Env.TraversePath().Load();

var builder = WebApplication.CreateBuilder(args);

builder.AddSmartHomeEcommLogging();

builder.Services.RegisterAllServices(builder.Configuration);

var app = builder.Build();

await app.ConfigureWebApplicationMiddlewaresAsync();

app.Run();
