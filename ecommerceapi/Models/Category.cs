namespace ECommerceApi.Models
{
    public class Category
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        // Navigation property
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
