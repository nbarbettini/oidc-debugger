using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using OidcDebugger.ViewModels;

namespace OidcDebugger.Controllers
{
    public class CallbackController : Controller
    {
        [HttpGet("~/debug"), HttpPost("~/debug")]
        public IActionResult Index()
        {
            var viewModel = new DebugViewModel
            {
                Method = Request.Method,
                Referer = HttpContext.Request.Headers["Referer"],
                Form = Request.HasFormContentType
                    ? Helpers.Flatten(Request.Form) 
                    : Enumerable.Empty<KeyValuePair<string, string>>(),
            };

            return View(viewModel);
        }
    }
}
