namespace OidcDebugger
{
    public class AppTenant
    {
        public string Shortname { get; set; }
        
        public string Name { get; set; }

        public string Description { get; set; }
        
        public string[] Hostnames { get; set; }

        public string GoogleTrackingId { get; set; }
    }
}
