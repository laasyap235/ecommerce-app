using ECommerceApi.Data;
using ECommerceApi.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ECommerceApi.Models;


namespace ECommerceApi.Controllers
{
    [ApiController]
    [Route("api/wishlist")]
    [Authorize]
    public class WishlistController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WishlistController(AppDbContext context)
        {
            _context = context;
        }

        // Adjust to whatever claim your JWT actually stores the user id in
        private string GetUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        // GET /api/wishlist
        [HttpGet]
        public async Task<IActionResult> GetWishlist()
        {
            var userId = GetUserId();

            var products = await _context.Wishlists
                .Where(w => w.UserId == userId)
                .Include(w => w.Product)
                .Select(w => w.Product)
                .ToListAsync();

            return Ok(products);
        }

        // POST /api/wishlist  { productId }
        [HttpPost]
        public async Task<IActionResult> AddToWishlist([FromBody] AddWishlistDto dto)
        {
            var userId = GetUserId();

            var exists = await _context.Wishlists
                .AnyAsync(w => w.UserId == userId && w.ProductId == dto.ProductId);

            if (!exists)
            {
                _context.Wishlists.Add(new Wishlist
                {
                    UserId = userId,
                    ProductId = dto.ProductId
                });
                await _context.SaveChangesAsync();
            }

            return Ok(new { message = "Added to wishlist" });
        }

        // DELETE /api/wishlist/{productId}
        [HttpDelete("{productId:int}")]
        public async Task<IActionResult> RemoveFromWishlist(int productId)
        {
            var userId = GetUserId();

            var item = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);

            if (item != null)
            {
                _context.Wishlists.Remove(item);
                await _context.SaveChangesAsync();
            }

            return Ok(new { message = "Removed from wishlist" });
        }

        // POST /api/wishlist/sync  { productIds: [...] }
        // Call once right after login to merge the guest (localStorage) wishlist into the DB
        [HttpPost("sync")]
        public async Task<IActionResult> SyncWishlist([FromBody] SyncWishlistDto dto)
        {
            var userId = GetUserId();

            var existingIds = await _context.Wishlists
                .Where(w => w.UserId == userId)
                .Select(w => w.ProductId)
                .ToListAsync();

            var newIds = dto.ProductIds.Except(existingIds).ToList();

            foreach (var productId in newIds)
            {
                _context.Wishlists.Add(new Wishlist
                {
                    UserId = userId,
                    ProductId = productId
                });
            }

            if (newIds.Any())
                await _context.SaveChangesAsync();

            var products = await _context.Wishlists
                .Where(w => w.UserId == userId)
                .Include(w => w.Product)
                .Select(w => w.Product)
                .ToListAsync();

            return Ok(products);
        }
    }
}