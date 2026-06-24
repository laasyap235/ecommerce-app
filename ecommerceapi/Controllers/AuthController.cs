using ECommerceApi.Data;
using ECommerceApi.DTOs;
using ECommerceApi.Models;
using ECommerceApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ECommerceApi.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ITokenService _tokenService;

        public AuthController(AppDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] SignupRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var emailExists = await _context.Users
                .AnyAsync(u => u.Email.ToLower() == request.Email.ToLower());

            if (emailExists)
                return BadRequest(new { message = "An account with this email already exists." });

            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber ?? string.Empty,
                // NOTE: still storing/comparing plaintext passwords, same as the
                // original controller. Swap this for a hash (e.g. BCrypt.Net-Next)
                // before this goes anywhere near production - happy to wire that
                // up too if you want it.
                Password = request.Password,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = _tokenService.GenerateToken(user);

            return Ok(new AuthResponseDto
            {
                Token = token,
                User = MapToDto(user)
            });
        }

        [HttpPost("signin")]
        public async Task<IActionResult> Signin([FromBody] SigninRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());

            if (user is null || user.Password != request.Password)
                return Unauthorized(new { message = "Invalid email or password." });

            var token = _tokenService.GenerateToken(user);

            return Ok(new AuthResponseDto
            {
                Token = token,
                User = MapToDto(user)
            });
        }

        // A JWT can't be revoked server-side without a blocklist/refresh-token
        // store, so "signing out" really just means the client discards its
        // token. This endpoint exists so the frontend has something consistent
        // to call (and a hook point if you add token revocation later).
        [HttpPost("signout")]
        [Authorize]
        public IActionResult Signout()
        {
            return Ok(new { message = "Signed out successfully." });
        }

        // Lets the frontend re-validate a stored token on app load/refresh and
        // rehydrate the logged-in user without asking them to sign in again.
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> Me()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId is null || !int.TryParse(userId, out var id))
                return Unauthorized();

            var user = await _context.Users.FindAsync(id);
            if (user is null)
                return Unauthorized();

            return Ok(MapToDto(user));
        }

        private static UserDto MapToDto(User user) => new()
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            CreatedAt = user.CreatedAt
        };
    }
}