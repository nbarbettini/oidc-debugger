using Finbuckle.MultiTenant;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using OidcDebugger;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();

builder.Services.AddMultiTenant<AppTenantInfo>()
    .WithHostStrategy("__tenant__")
    .WithConfigurationStore();

// In production, add some additional services
if (!builder.Environment.IsDevelopment())
{
    // Require HTTPS for all pages by default
    builder.Services.Configure<MvcOptions>(options =>
    {
        options.Filters.Add(new RequireHttpsAttribute());
    });

    // Configure forwarded headers for Heroku's load balancer
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

app.UseHttpsRedirection();

app.UseXfo(options => options.SameOrigin());
app.UseXXssProtection(options => options.EnabledWithBlockMode());
app.UseXContentTypeOptions();

app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();

app.Run();
