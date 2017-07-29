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

        public StringValues Query { get; set; }

        public StringValues Form { get; set; }

        public StringValues Errors { get; set; }

    }
}
