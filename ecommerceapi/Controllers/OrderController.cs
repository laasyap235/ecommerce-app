using ECommerceApi.Data;
using ECommerceApi.DTOs;
using ECommerceApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ECommerceApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/orders")]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var cart = await _context.Carts
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null || !cart.CartItems.Any())
                return BadRequest(new { message = "Cart is empty." });

            var order = new Order
            {
                UserId = userId.Value,
                CreatedAt = DateTime.UtcNow,
                Total = cart.Total,
                Status = "Pending",
                OrderItems = cart.CartItems.Select(ci => new OrderItem
                {
                    ProductId = ci.ProductId,
                    ProductName = ci.Product?.Name ?? "",
                    ImageUrl = ci.Product?.ImageUrl ?? "",
                    Price = ci.Product?.Price ?? 0,
                    Quantity = ci.Quantity,
                    Subtotal = ci.Subtotal
                }).ToList()
            };

            _context.Orders.Add(order);
            _context.RemoveRange(cart.CartItems);
            cart.CartItems.Clear();
            cart.Total = 0;

            await _context.SaveChangesAsync();

            return Ok(MapToDto(order));
        }

        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => MapToDto(o))
                .ToListAsync();

            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);

            if (order == null) return NotFound();

            return Ok(MapToDto(order));
        }

        private int? GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null || !int.TryParse(claim.Value, out var id)) return null;
            return id;
        }

        private static OrderDto MapToDto(Order order) => new()
        {
            Id = order.Id,
            CreatedAt = order.CreatedAt,
            Total = order.Total,
            Status = order.Status,
            OrderItems = order.OrderItems.Select(oi => new OrderItemDto
            {
                Id = oi.Id,
                ProductId = oi.ProductId,
                ProductName = oi.ProductName,
                ImageUrl = oi.ImageUrl,
                Price = oi.Price,
                Quantity = oi.Quantity,
                Subtotal = oi.Subtotal
            }).ToList()
        };
    }
}