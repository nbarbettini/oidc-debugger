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
