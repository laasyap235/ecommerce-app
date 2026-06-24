using ECommerceApi.Data;
using ECommerceApi.DTOs;
using ECommerceApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ECommerceApi.Controllers
{
    [ApiController]
    [Route("api/cart")]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartController(AppDbContext context)
        {
            _context = context;
        }

        // GET /api/cart  — get current user's cart
        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var cart = await GetOrCreateCartAsync(userId.Value);
            return Ok(MapToDto(cart));
        }

        // POST /api/cart  — add item to cart
        [HttpPost]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var product = await _context.Products.FindAsync(dto.ProductId);
            if (product == null) return NotFound(new { message = "Product not found." });

            var cart = await GetOrCreateCartAsync(userId.Value);

            var existing = cart.CartItems
                .FirstOrDefault(ci => ci.ProductId == dto.ProductId);

            if (existing != null)
            {
                existing.Quantity += dto.Quantity;
                existing.Subtotal = existing.Quantity * product.Price;
            }
            else
            {
                cart.CartItems.Add(new CartItem
                {
                    CartId = cart.Id,
                    ProductId = dto.ProductId,
                    Quantity = dto.Quantity,
                    Subtotal = dto.Quantity * product.Price
                });
            }

            cart.Total = cart.CartItems.Sum(ci => ci.Subtotal);
            await _context.SaveChangesAsync();

            // Reload with product details
            await _context.Entry(cart)
                .Collection(c => c.CartItems)
                .Query()
                .Include(ci => ci.Product)
                .LoadAsync();

            return Ok(MapToDto(cart));
        }

        // PUT /api/cart/{itemId}  — update quantity
        [HttpPut("{itemId}")]
        public async Task<IActionResult> UpdateItem(int itemId, [FromBody] UpdateCartItemDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var cart = await GetOrCreateCartAsync(userId.Value);

            var item = cart.CartItems.FirstOrDefault(ci => ci.Id == itemId);
            if (item == null) return NotFound(new { message = "Cart item not found." });

            var product = await _context.Products.FindAsync(item.ProductId);
            if (product == null) return NotFound();

            if (dto.Quantity <= 0)
            {
                cart.CartItems.Remove(item);
                _context.Remove(item);
            }
            else
            {
                item.Quantity = dto.Quantity;
                item.Subtotal = dto.Quantity * product.Price;
            }

            cart.Total = cart.CartItems.Sum(ci => ci.Subtotal);
            await _context.SaveChangesAsync();

            await _context.Entry(cart)
                .Collection(c => c.CartItems)
                .Query()
                .Include(ci => ci.Product)
                .LoadAsync();

            return Ok(MapToDto(cart));
        }

        // DELETE /api/cart/{itemId}  — remove item
        [HttpDelete("{itemId}")]
        public async Task<IActionResult> RemoveItem(int itemId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var cart = await GetOrCreateCartAsync(userId.Value);

            var item = cart.CartItems.FirstOrDefault(ci => ci.Id == itemId);
            if (item == null) return NotFound(new { message = "Cart item not found." });

            cart.CartItems.Remove(item);
            _context.Remove(item);

            cart.Total = cart.CartItems.Sum(ci => ci.Subtotal);
            await _context.SaveChangesAsync();

            return Ok(MapToDto(cart));
        }

        // DELETE /api/cart  — clear cart
        [HttpDelete]
        public async Task<IActionResult> ClearCart()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var cart = await GetOrCreateCartAsync(userId.Value);

            _context.RemoveRange(cart.CartItems);
            cart.CartItems.Clear();
            cart.Total = 0;

            await _context.SaveChangesAsync();
            return Ok(MapToDto(cart));
        }

        // ── Helpers ──────────────────────────────────────────────

        private int? GetUserId()
        {
            var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (claim == null || !int.TryParse(claim.Value, out var id)) return null;
            return id;
        }

        private async Task<Cart> GetOrCreateCartAsync(int userId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                cart = new Cart { UserId = userId, Total = 0 };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }

            return cart;
        }

        private static CartDto MapToDto(Cart cart) => new()
        {
            Id = cart.Id,
            Total = cart.Total,
            CartItems = cart.CartItems.Select(ci => new CartItemDto
            {
                Id = ci.Id,
                ProductId = ci.ProductId,
                ProductName = ci.Product?.Name ?? "",
                ImageUrl = ci.Product?.ImageUrl ?? "",
                Price = ci.Product?.Price ?? 0,
                Quantity = ci.Quantity,
                Subtotal = ci.Subtotal
            }).ToList()
        };
    }
}