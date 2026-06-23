using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ECommerceApi.Migrations
{
    /// <inheritdoc />
    public partial class initialdatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.CategoryId);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    ProductId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.ProductId);
                    table.ForeignKey(
                        name: "FK_Products_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "CategoryId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "CategoryId", "CategoryName", "Description" },
                values: new object[,]
                {
                    { 1, "Electronics", "Electronic devices and gadgets" },
                    { 2, "Clothing", "Men and women apparel" },
                    { 3, "Accessories", "Bags, watches and more" },
                    { 4, "Shoes", "Footwear for all occasions" }
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "ProductId", "CategoryId", "Description", "ImageUrl", "Name", "Price" },
                values: new object[,]
                {
                    { 1, 1, "Premium noise cancelling headphones", "https://example.com/headphones.jpg", "Wireless Headphones", 199.99m },
                    { 2, 1, "Feature packed smartwatch", "https://example.com/smartwatch.jpg", "Smart Watch Pro", 299.99m },
                    { 3, 2, "Comfortable everyday t-shirt", "https://example.com/tshirt.jpg", "Cotton T-Shirt", 29.99m },
                    { 4, 2, "Classic slim fit jeans", "https://example.com/jeans.jpg", "Denim Jeans", 69.99m },
                    { 5, 2, "Warm jacket for cold weather", "https://example.com/jacket.jpg", "Winter Jacket", 149.99m },
                    { 6, 3, "Classic leather strap watch", "https://example.com/watch.jpg", "Leather Watch", 149.99m },
                    { 7, 3, "UV protected stylish sunglasses", "https://example.com/sunglasses.jpg", "Designer Sunglasses", 179.99m },
                    { 8, 4, "Lightweight shoes for running", "https://example.com/shoes.jpg", "Running Shoes", 89.99m }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Products_CategoryId",
                table: "Products",
                column: "CategoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Categories");
        }
    }
}
