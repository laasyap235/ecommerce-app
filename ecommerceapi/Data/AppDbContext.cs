using ECommerceApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ECommerceApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<Wishlist> Wishlists { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

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
                entity.Property(p => p.Stock).IsRequired();

                entity.HasOne(p => p.Category)
                      .WithMany(c => c.Products)
                      .HasForeignKey(p => p.CategoryId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(o => o.Id);
                entity.Property(o => o.Total).HasPrecision(18, 2);
                entity.Property(o => o.Status).HasMaxLength(50);
                entity.HasOne(o => o.User)
                      .WithMany()
                      .HasForeignKey(o => o.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasKey(oi => oi.Id);
                entity.Property(oi => oi.Price).HasPrecision(18, 2);
                entity.Property(oi => oi.Subtotal).HasPrecision(18, 2);
                entity.Property(oi => oi.ProductName).HasMaxLength(200);
                entity.Property(oi => oi.ImageUrl).HasMaxLength(500);
                entity.HasOne(oi => oi.Order)
                      .WithMany(o => o.OrderItems)
                      .HasForeignKey(oi => oi.OrderId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(oi => oi.Product)
                      .WithMany()
                      .HasForeignKey(oi => oi.ProductId)
                      .OnDelete(DeleteBehavior.NoAction);
            });

            modelBuilder.Entity<Category>().HasData(
                new Category { CategoryId = 1, CategoryName = "Electronics", Description = "Electronic devices and gadgets" },
                new Category { CategoryId = 2, CategoryName = "Clothing", Description = "Men and women apparel" },
                new Category { CategoryId = 3, CategoryName = "Accessories", Description = "Bags, watches and more" },
                new Category { CategoryId = 4, CategoryName = "Shoes", Description = "Footwear for all occasions" }
            );

            modelBuilder.Entity<Product>().HasData(
                new Product { ProductId = 1, Name = "Wireless Headphones", Description = "Premium noise cancelling headphones", Price = 199.99m, ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e", Stock = 50, CategoryId = 1 },
                new Product { ProductId = 2, Name = "Smart Watch Pro", Description = "Feature packed smartwatch", Price = 299.99m, ImageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30", Stock = 30, CategoryId = 1 },
                new Product { ProductId = 3, Name = "Cotton T-Shirt", Description = "Comfortable everyday t-shirt", Price = 29.99m, ImageUrl = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab", Stock = 100, CategoryId = 2 },
                new Product { ProductId = 4, Name = "Denim Jeans", Description = "Classic slim fit jeans", Price = 69.99m, ImageUrl = "https://images.unsplash.com/photo-1542272604-787c3835535d", Stock = 75, CategoryId = 2 },
                new Product { ProductId = 5, Name = "Winter Jacket", Description = "Warm jacket for cold weather", Price = 149.99m, ImageUrl = "https://images.unsplash.com/photo-1551028719-00167b16eac5", Stock = 40, CategoryId = 2 },
                new Product { ProductId = 6, Name = "Leather Watch", Description = "Classic leather strap watch", Price = 149.99m, ImageUrl = "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56", Stock = 25, CategoryId = 3 },
                new Product { ProductId = 7, Name = "Designer Sunglasses", Description = "UV protected stylish sunglasses", Price = 179.99m, ImageUrl = "https://images.unsplash.com/photo-1511499767150-a48a237f0083", Stock = 60, CategoryId = 3 },
                new Product { ProductId = 8, Name = "Running Shoes", Description = "Lightweight shoes for running", Price = 89.99m, ImageUrl = "https://images.unsplash.com/photo-1542291026-7eec264c27ff", Stock = 80, CategoryId = 4 }
            );

            modelBuilder.Entity<Wishlist>()
                .HasIndex(w => new { w.UserId, w.ProductId })
                .IsUnique();

            modelBuilder.Entity<Wishlist>()
                .HasOne(w => w.Product)
                .WithMany()
                .HasForeignKey(w => w.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(modelBuilder);
        }
    }
}