# Stage 1: Build frontend assets
FROM node:20-alpine AS frontend
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci
COPY webpack.config.js .babelrc ./
COPY OidcDebugger/Pages/ OidcDebugger/Pages/
RUN npm run build

# Stage 2: Build .NET application
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY OidcDebugger/*.csproj OidcDebugger/
COPY OidcDebugger.BackendTests/*.csproj OidcDebugger.BackendTests/
COPY OidcDebugger.sln ./
RUN dotnet restore
COPY . .
COPY --from=frontend /src/OidcDebugger/wwwroot/bundle/ OidcDebugger/wwwroot/bundle/
RUN dotnet publish OidcDebugger/OidcDebugger.csproj -c Release -o /app --no-restore

# Stage 3: Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app .

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080

ENTRYPOINT ["dotnet", "OidcDebugger.dll"]
