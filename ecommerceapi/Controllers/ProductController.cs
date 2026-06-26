using ECommerceApi.Models;
using ECommerceApi.Data;
using ECommerceApi.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerceApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 8,
    [FromQuery] string? search = null)
        {
            var query = _context.Products.Include(p => p.Category).AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLower();
                query = query.Where(p =>
                    p.Name.ToLower().Contains(term) ||
                    (p.Category != null && p.Category.CategoryName.ToLower().Contains(term))
                );
            }

            var totalCount = await query.CountAsync();

            var products = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProductDto
                {
                    ProductId = p.ProductId,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    ImageUrl = p.ImageUrl,
                    Stock = p.Stock,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category != null ? p.Category.CategoryName : ""
                })
                .ToListAsync();

            return Ok(new { items = products, totalCount });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Where(p => p.ProductId == id)
                .Select(p => new ProductDto
                {
                    ProductId = p.ProductId,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    ImageUrl = p.ImageUrl,
                    Stock = p.Stock,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category != null ? p.Category.CategoryName : ""
                })
                .FirstOrDefaultAsync();

            if (product == null) return NotFound();
            return Ok(product);
        }

        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetByCategory(int categoryId, [FromQuery] int page = 1, [FromQuery] int pageSize = 8)
        {
            var query = _context.Products
                .Include(p => p.Category)
                .Where(p => p.CategoryId == categoryId);

            var totalCount = await query.CountAsync();

            var products = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProductDto
                {
                    ProductId = p.ProductId,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    ImageUrl = p.ImageUrl,
                    Stock = p.Stock,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category != null ? p.Category.CategoryName : ""
                })
                .ToListAsync();

            return Ok(new { items = products, totalCount });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
        {
            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                ImageUrl = dto.ImageUrl,
                Stock = dto.Stock,
                CategoryId = dto.CategoryId
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = product.ProductId }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateProductDto dto)
        {
            var existing = await _context.Products.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Name = dto.Name;
            existing.Description = dto.Description;
            existing.Price = dto.Price;
            existing.ImageUrl = dto.ImageUrl;
            existing.Stock = dto.Stock;
            existing.CategoryId = dto.CategoryId;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}