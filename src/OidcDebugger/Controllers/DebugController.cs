using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using OidcDebugger.ViewModels;

namespace OidcDebugger.Controllers
{
    public class DebugController : Controller
    {
        [HttpGet("~/debug")]
        public IActionResult Index()
        {
            Request.Query.TryGetValue("error", out var rawQueryError);
            Request.Query.TryGetValue("error_description", out var rawQueryErrorDescription);

            StringValues rawCode;
            if (Request.HasFormContentType)
            {
                Request.Form.TryGetValue("code", out rawCode);
            }
            else
            {
                Request.Query.TryGetValue("code", out rawCode);
            }

            Request.Query.TryGetValue("state", out var rawState);

            var viewModel = new DebugViewModel
            {
                Method = Request.Method,
                Referer = HttpContext.Request.Headers["Referer"],
                Form = Request.HasFormContentType ? Helpers.Flatten(Request.Form) : Enumerable.Empty<KeyValuePair<string, string>>(),
                ErrorCode = rawQueryError,
                ErrorDescription = rawQueryErrorDescription,
                AuthorizationCode = rawCode,
                State = rawState,
            };

            return View(viewModel);
        }
    }
}
