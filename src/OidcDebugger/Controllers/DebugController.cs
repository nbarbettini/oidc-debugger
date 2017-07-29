using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using OidcDebugger.ViewModels;

namespace OidcDebugger.Controllers
{
    public class DebugController : Controller
    {
        [HttpGet("~/debug")]
        public IActionResult Index()
        {
            var viewModel = new DebugViewModel
            {
                Method = HttpContext.Request.Method,
                Referer = HttpContext.Request.Headers["Referer"]
            };

            return View(viewModel);
        }
    }
}
