using System.ComponentModel.DataAnnotations;

namespace ECommerceApi.Models
{
    public class User
    {

        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Phone]
        public string PhoneNumber { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set ; } = DateTime.UtcNow;

        public Cart? Cart { get; set; }

    }
}
