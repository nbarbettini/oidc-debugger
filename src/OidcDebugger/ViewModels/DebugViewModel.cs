using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Primitives;

namespace OidcDebugger.ViewModels
{
    public class DebugViewModel
    {
        public string Method { get; set; }

        public string Referer { get; set; }

        public string AuthorizationCode { get; set; }

        public string State { get; set; }

        public string ErrorCode { get; set; }

        public string ErrorDescription { get; set; }

        public IEnumerable<KeyValuePair<string, string>> Form { get; set; }
    }
}
