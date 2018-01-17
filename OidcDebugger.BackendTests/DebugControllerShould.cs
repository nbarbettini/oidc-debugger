using System.IO;
using System.Text;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OidcDebugger.Controllers;
using OidcDebugger.ViewModels;
using Xunit;

namespace OidcDebugger.BackendTests
{
    public class DebugControllerShould
    {
        [Fact]
        public void PassMethodToModel()
        {
            var controller = new DebugController
            {
                ControllerContext = new ControllerContext()
            };
            controller.ControllerContext.HttpContext = new DefaultHttpContext();
            controller.ControllerContext.HttpContext.Request.Method = "GET";

            var result = controller.Index() as ViewResult;
            var model = result.Model as DebugViewModel;

            model.Should().NotBeNull();

            model.Method.Should().Be("GET");
        }

        [Fact]
        public void PassRefererToModel()
        {
            var controller = new DebugController
            {
                ControllerContext = new ControllerContext()
            };
            controller.ControllerContext.HttpContext = new DefaultHttpContext();
            controller.ControllerContext.HttpContext.Request.Headers["Referer"] = "example.com";

            var result = controller.Index() as ViewResult;
            var model = result.Model as DebugViewModel;

            model.Should().NotBeNull();

            model.Referer.Should().Be("example.com");
        }

        [Fact]
        public void NotPassNonFormBody()
        {
            var controller = new DebugController
            {
                ControllerContext = new ControllerContext()
            };
            controller.ControllerContext.HttpContext = new DefaultHttpContext();
            controller.ControllerContext.HttpContext.Request.Method = "POST";
            controller.ControllerContext.HttpContext.Request.Headers["Content-Type"] = "application/json";

            var body = new MemoryStream(Encoding.UTF8.GetBytes(""));
            controller.ControllerContext.HttpContext.Request.Body = body;

            var result = controller.Index() as ViewResult;
            var model = result.Model as DebugViewModel;

            model.Should().NotBeNull();

            model.Form.Length.Should().Be(0);
        }

        [Fact]
        public void PassFormBody()
        {
            var controller = new DebugController
            {
                ControllerContext = new ControllerContext()
            };
            controller.ControllerContext.HttpContext = new DefaultHttpContext();
            controller.ControllerContext.HttpContext.Request.Method = "POST";
            controller.ControllerContext.HttpContext.Request.Headers["Content-Type"] = "application/x-www-form-urlencoded";

            var body = new MemoryStream(Encoding.UTF8.GetBytes("foo=bar&baz=qux"));
            controller.ControllerContext.HttpContext.Request.Body = body;

            var result = controller.Index() as ViewResult;
            var model = result.Model as DebugViewModel;

            model.Should().NotBeNull();

            model.Form.Length.Should().Be(2);

            model.Form[0].Key.Should().Be("foo");
            model.Form[0].Value.Should().Be("bar");

            model.Form[1].Key.Should().Be("baz");
            model.Form[1].Value.Should().Be("qux");
        }

        [Fact]
        public void PassFlattenedFormBody()
        {
            var controller = new DebugController
            {
                ControllerContext = new ControllerContext()
            };
            controller.ControllerContext.HttpContext = new DefaultHttpContext();
            controller.ControllerContext.HttpContext.Request.Method = "POST";
            controller.ControllerContext.HttpContext.Request.Headers["Content-Type"] = "application/x-www-form-urlencoded";

            var body = new MemoryStream(Encoding.UTF8.GetBytes("foo=bar&foo=baz"));
            controller.ControllerContext.HttpContext.Request.Body = body;

            var result = controller.Index() as ViewResult;
            var model = result.Model as DebugViewModel;

            model.Should().NotBeNull();

            model.Form.Length.Should().Be(2);

            model.Form[0].Key.Should().Be("foo");
            model.Form[0].Value.Should().Be("bar");

            model.Form[1].Key.Should().Be("foo");
            model.Form[1].Value.Should().Be("baz");
        }
    }
}
