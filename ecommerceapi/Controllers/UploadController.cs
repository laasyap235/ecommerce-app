using ECommerceApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/upload")]
    public class UploadController : ControllerBase
    {
        private readonly IBlobService _blobService;

        public UploadController(IBlobService blobService)
        {
            _blobService = blobService;
        }

        [HttpPost("image")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file provided." });

            var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp", "image/gif" };
            if (!allowedTypes.Contains(file.ContentType))
                return BadRequest(new { message = "Only image files are allowed." });

            if (file.Length > 5 * 1024 * 1024)
                return BadRequest(new { message = "File size must be under 5MB." });

            var url = await _blobService.UploadImageAsync(file);
            return Ok(new { url });
        }
    }
}