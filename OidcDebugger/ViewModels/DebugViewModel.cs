using System.Collections.Generic;

namespace OidcDebugger.ViewModels
{
    public class DebugViewModel
    {
        public string Method { get; set; }

        public string Referer { get; set; }

        public KeyValuePair<string, string>[] Form { get; set; }
    }
}
