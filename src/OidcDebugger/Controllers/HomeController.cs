using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace OidcDebugger.Controllers
{
    public class HomeController : Controller
    {
        [HttpGet("~/")]
        public IActionResult Index()
        {
            return View();
        }
    }
}
