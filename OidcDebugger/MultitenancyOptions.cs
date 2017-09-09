using System.Collections.Generic;

namespace OidcDebugger
{
    public class MultitenancyOptions
    {
        public IEnumerable<AppTenant> Tenants { get; set; }
    }
}
