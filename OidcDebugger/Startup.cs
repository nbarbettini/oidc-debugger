using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NWebsec.AspNetCore;

namespace OidcDebugger
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureDevelopmentServices(IServiceCollection services)
        {
            ConfigureCommonServices(services);
        }

        public void ConfigureServices(IServiceCollection services)
        {
            ConfigureCommonServices(services);

            // Require HTTPS in production
            services.Configure<MvcOptions>(options =>
            {
                options.Filters.Add(new RequireHttpsAttribute());
            });
        }

        private void ConfigureCommonServices(IServiceCollection services)
        {
            services.Configure<MultitenancyOptions>(Configuration.GetSection("Multitenancy"));
            services.AddMultitenancy<AppTenant, AppTenantResolver>();

            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            app.UseCspReportOnly(options => options
                .DefaultSources(s => s.Self())
                .ScriptSources(s => s.Self())
                .ReportUris(r => r.Uris("https://nb.report-uri.io/r/default/csp/reportOnly")));

            app.UseReferrerPolicy(opts => opts.NoReferrer());

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts(options => options.MaxAge(days: 365).IncludeSubdomains());

                app.UseExceptionHandler("/Home/Error");
            }            

            app.UseStaticFiles();

            app.UseXfo(options => options.SameOrigin());
            app.UseXXssProtection(options => options.EnabledWithBlockMode());
            app.UseXContentTypeOptions();

            app.UseMultitenancy<AppTenant>();

            app.UseMvc();
        }
    }
}
