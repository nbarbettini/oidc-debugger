using Finbuckle.MultiTenant.Abstractions;

namespace OidcDebugger;

public record AppTenantInfo : ITenantInfo
{
    public string? Id { get; set; }

    public string? Identifier { get; set; }

    public string? GoogleTrackingId { get; set; }

    public string? Name { get; set; }

    public string? Noun { get; set; }

    public string? SurveyUrl { get; set; }
}
