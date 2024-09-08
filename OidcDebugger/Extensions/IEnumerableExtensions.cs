using Microsoft.Extensions.Primitives;

namespace OidcDebugger.Extensions;

public static class IEnumerableExtensions
{
    public static IEnumerable<KeyValuePair<string, string?>> Flatten(
        this IEnumerable<KeyValuePair<string, StringValues>> source)
        => source.SelectMany(x => x.Value, (orig, value) => new KeyValuePair<string, string?>(orig.Key, value));
}
