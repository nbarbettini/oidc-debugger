using Microsoft.AspNetCore.Mvc.RazorPages;

namespace OidcDebugger.Pages.Debug;

public class DebugModel : PageModel
{
    public string Method { get; set; } = "GET";

    public string? Referer { get; set; }

    public KeyValuePair<string, string?>[] Form { get; set; } = [];

    public void OnGet()
    {
        CopyValuesFromRequest();
    }

    public void OnPost()
    {
        CopyValuesFromRequest();
    }

    private void CopyValuesFromRequest()
    {
        Method = Request.Method;

        Referer = HttpContext.Request.Headers.Referer;

        Form = Request.HasFormContentType
            ? Request.Form.Flatten().ToArray()
            : [];
    }
}
