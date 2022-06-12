FROM microsoft/aspnetcore-build:2.0 AS build-env
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY ./OidcDebugger/*.csproj ./
RUN dotnet restore

# Prevent 'Warning: apt-key output should not be parsed (stdout is not a terminal)'
ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=1
ENV ASPNETCORE_ENVIRONMENT=Development

# install NodeJS 13.x
# see https://github.com/nodesource/distributions/blob/master/README.md#deb
RUN apt-get update -yq 
RUN apt-get install curl gnupg -yq 
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs

# Copy everything else and build
COPY . ./
RUN dotnet publish -c Release -o out

ENTRYPOINT ["dotnet", "/app/OidcDebugger/out/OidcDebugger.dll"]
EXPOSE 80