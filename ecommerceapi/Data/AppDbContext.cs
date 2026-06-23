using ECommerceApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ECommerceApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(c => c.CategoryId);
                entity.Property(c => c.CategoryName).IsRequired().HasMaxLength(100);
                entity.Property(c => c.Description).HasMaxLength(500);
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(p => p.ProductId);
                entity.Property(p => p.Name).IsRequired().HasMaxLength(200);
                entity.Property(p => p.Description).HasMaxLength(1000);
                entity.Property(p => p.Price).HasPrecision(18, 2);
                entity.Property(p => p.ImageUrl).HasMaxLength(500);
                entity.Property(p => p.Stock).IsRequired();   // added

                entity.HasOne(p => p.Category)
                      .WithMany(c => c.Products)
                      .HasForeignKey(p => p.CategoryId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Seed Categories
            modelBuilder.Entity<Category>().HasData(
                new Category { CategoryId = 1, CategoryName = "Electronics", Description = "Electronic devices and gadgets" },
                new Category { CategoryId = 2, CategoryName = "Clothing", Description = "Men and women apparel" },
                new Category { CategoryId = 3, CategoryName = "Accessories", Description = "Bags, watches and more" },
                new Category { CategoryId = 4, CategoryName = "Shoes", Description = "Footwear for all occasions" }
            );

            // Seed Products
            modelBuilder.Entity<Product>().HasData(
                new Product { ProductId = 1, Name = "Wireless Headphones", Description = "Premium noise cancelling headphones", Price = 199.99m, ImageUrl = "https://example.com/headphones.jpg", Stock = 50, CategoryId = 1 },
                new Product { ProductId = 2, Name = "Smart Watch Pro", Description = "Feature packed smartwatch", Price = 299.99m, ImageUrl = "https://example.com/smartwatch.jpg", Stock = 30, CategoryId = 1 },
                new Product { ProductId = 3, Name = "Cotton T-Shirt", Description = "Comfortable everyday t-shirt", Price = 29.99m, ImageUrl = "https://example.com/tshirt.jpg", Stock = 100, CategoryId = 2 },
                new Product { ProductId = 4, Name = "Denim Jeans", Description = "Classic slim fit jeans", Price = 69.99m, ImageUrl = "https://example.com/jeans.jpg", Stock = 75, CategoryId = 2 },
                new Product { ProductId = 5, Name = "Winter Jacket", Description = "Warm jacket for cold weather", Price = 149.99m, ImageUrl = "https://example.com/jacket.jpg", Stock = 40, CategoryId = 2 },
                new Product { ProductId = 6, Name = "Leather Watch", Description = "Classic leather strap watch", Price = 149.99m, ImageUrl = "https://example.com/watch.jpg", Stock = 25, CategoryId = 3 },
                new Product { ProductId = 7, Name = "Designer Sunglasses", Description = "UV protected stylish sunglasses", Price = 179.99m, ImageUrl = "https://example.com/sunglasses.jpg", Stock = 60, CategoryId = 3 },
                new Product { ProductId = 8, Name = "Running Shoes", Description = "Lightweight shoes for running", Price = 89.99m, ImageUrl = "https://example.com/shoes.jpg", Stock = 80, CategoryId = 4 }
            );
        }
    }
}