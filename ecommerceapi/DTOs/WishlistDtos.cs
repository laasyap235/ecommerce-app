namespace ECommerceApi.DTOs
{
    public class AddWishlistDto
    {
        public int ProductId { get; set; }
    }

    public class SyncWishlistDto
    {
        public List<int> ProductIds { get; set; } = new();
    }
}
