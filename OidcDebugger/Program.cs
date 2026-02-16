using Finbuckle.MultiTenant;
using Microsoft.AspNetCore.HttpOverrides;
using OidcDebugger;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();

builder.Services.AddMultiTenant<AppTenantInfo>()
    .WithHostStrategy("__tenant__")
    .WithConfigurationStore();

// In production, add some additional services
if (!builder.Environment.IsDevelopment())
{
    // Configure forwarded headers for the reverse proxy / load balancer
    builder.Services.Configure<ForwardedHeadersOptions>(options =>
    {
        options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
        options.KnownNetworks.Clear();
        options.KnownProxies.Clear();
    });

    // Enable response compression
    builder.Services.AddResponseCompression();

    // Configure strict HSTS
    builder.Services.AddHsts(opt =>
    {
        opt.MaxAge = TimeSpan.FromDays(365);
        opt.IncludeSubDomains = true;
    });
}

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
    app.UseResponseCompression();
}

app.UseForwardedHeaders();

app.UseMultiTenant();

// Security headers
app.Use(async (context, next) =>
{
    context.Response.Headers["X-Frame-Options"] = "SAMEORIGIN";
    context.Response.Headers["X-XSS-Protection"] = "1; mode=block";
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    await next();
});

app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();

app.Run();
