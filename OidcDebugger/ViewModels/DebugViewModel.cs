using System.Collections.Generic;

namespace OidcDebugger.ViewModels
{
    public class DebugViewModel
    {
        public string Method { get; set; }

        public string Referer { get; set; }

        public string Code { get; set; }

        public string State { get; set; }

        public string Error { get; set; }

        public string ErrorDescription { get; set; }

        public KeyValuePair<string, string>[] Form { get; set; }
    }
}
