using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using OidcDebugger.ViewModels;

namespace OidcDebugger.Controllers
{
    public class DebugController : Controller
    {
        [HttpGet("~/debug"), HttpPost("~/debug")]
        public IActionResult Index()
        {
            StringValues rawError;
            StringValues rawErrorDescription;
            StringValues rawCode;
            StringValues rawState;

            if (Request.HasFormContentType)
            {
                Request.Form.TryGetValue("error", out rawError);
                Request.Form.TryGetValue("error_description", out rawErrorDescription);
                Request.Form.TryGetValue("code", out rawCode);
                Request.Form.TryGetValue("state", out rawState);
            }

            var viewModel = new DebugViewModel
            {
                Method = Request.Method,
                Referer = HttpContext.Request.Headers["Referer"],
                Form = Request.HasFormContentType
                    ? Helpers.Flatten(Request.Form) 
                    : Enumerable.Empty<KeyValuePair<string, string>>(),
                Error = rawError,
                ErrorDescription = rawErrorDescription,
                Code = rawCode,
                State = rawState,
            };

            return View(viewModel);
        }
    }
}
