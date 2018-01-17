using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using SaasKit.Multitenancy;

namespace OidcDebugger
{
    public class AppTenantResolver : ITenantResolver<AppTenant>
    {
        private readonly AppTenant[] _tenants;

        public AppTenantResolver(IOptions<MultitenancyOptions> options)
        {
            _tenants = options?.Value?.Tenants?.ToArray() ?? new AppTenant[0];
        }

        public Task<TenantContext<AppTenant>> ResolveAsync(HttpContext context)
        {
            TenantContext<AppTenant> tenantContext = null;

            var tenant = _tenants.FirstOrDefault(t =>
                t.Hostnames.Any(h => h.Equals(context.Request.Host.Host.ToLower())));

            if (tenant != null)
            {
                tenantContext = new TenantContext<AppTenant>(tenant);
            }

            return Task.FromResult(tenantContext);
        }
    }
}
