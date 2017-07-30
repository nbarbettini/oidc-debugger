using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Primitives;

namespace OidcDebugger
{
    public static class Helpers
    {
        public static IEnumerable<KeyValuePair<string, string>> Flatten(
            IEnumerable<KeyValuePair<string, StringValues>> source)
            => source.SelectMany(x => x.Value, (orig, value) => new KeyValuePair<string, string>(orig.Key, value));
    }
}
