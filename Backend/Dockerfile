# syntax=docker/dockerfile:1

# ---------- Build stage ----------
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Restore first, as a separate layer, so package restore is cached independently of source edits.
COPY global.json ./
COPY Directory.Build.props ./
COPY SmartHomeEcomm.slnx ./
COPY src/Core/SmartHomeEcomm.Domain/SmartHomeEcomm.Domain.csproj src/Core/SmartHomeEcomm.Domain/
COPY src/Core/SmartHomeEcomm.Application/SmartHomeEcomm.Application.csproj src/Core/SmartHomeEcomm.Application/
COPY src/Infrastructure/SmartHomeEcomm.Infrastructure/SmartHomeEcomm.Infrastructure.csproj src/Infrastructure/SmartHomeEcomm.Infrastructure/
COPY src/Presentation/SmartHomeEcomm.API/SmartHomeEcomm.API.csproj src/Presentation/SmartHomeEcomm.API/

RUN dotnet restore src/Presentation/SmartHomeEcomm.API/SmartHomeEcomm.API.csproj

COPY . .

RUN dotnet publish src/Presentation/SmartHomeEcomm.API/SmartHomeEcomm.API.csproj \
    -c Release \
    -o /app/publish \
    --no-restore \
    /p:UseAppHost=false

# ---------- Runtime stage ----------
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# curl is needed by the container HEALTHCHECK below; the base image does not ship it.
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Logs are mounted as a volume in compose/CI, so the runtime user needs write access to it.
RUN mkdir -p /app/logs && chown -R app:app /app

ENV ASPNETCORE_ENVIRONMENT=Production \
    ASPNETCORE_URLS=http://+:8080 \
    DOTNET_RUNNING_IN_CONTAINER=true \
    DOTNET_gcServer=1 \
    DOTNET_TieredPGO=1

EXPOSE 8080

COPY --from=build --chown=app:app /app/publish .

USER app

HEALTHCHECK --interval=30s --timeout=5s --start-period=45s --retries=3 \
    CMD curl -fsS http://localhost:8080/healthz || exit 1

ENTRYPOINT ["dotnet", "SmartHomeEcomm.API.dll"]
