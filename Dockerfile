FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

FROM node:lts-alpine AS vue
WORKDIR /src
COPY . .

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# build dll
# Copy csproj and restore as distinct layers
COPY OidcDebugger/OidcDebugger.csproj OidcDebugger/
RUN dotnet restore OidcDebugger/OidcDebugger.csproj
# Copy everything else and build
COPY . .

WORKDIR /src/OidcDebugger
RUN dotnet build OidcDebugger.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish OidcDebugger.csproj -c Release -o /app/publish

# build bundles
FROM vue AS vue-build
RUN npm install
RUN npm run build

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=vue-build /src/OidcDebugger/wwwroot ./wwwroot

# Prevent 'Warning: apt-key output should not be parsed (stdout is not a terminal)'
ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=1
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "OidcDebugger.dll"]
EXPOSE 8080
