using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerceApi.Models
{
    public class Wishlist
    {
        public int Id { get; set; }

        // Adjust type to match your User PK (string for Identity GUID, int otherwise)
        public string UserId { get; set; } = string.Empty;

        public int ProductId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey(nameof(ProductId))]
        public Product? Product { get; set; }
    }
}
