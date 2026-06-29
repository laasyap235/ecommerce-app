using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace ECommerceApi.Services
{
    public interface IBlobService
    {
        Task<string> UploadImageAsync(IFormFile file);
        Task DeleteImageAsync(string imageUrl);
    }

    public class BlobService : IBlobService
    {
        private readonly BlobContainerClient _container;

        public BlobService(IConfiguration config)
        {
            var connectionString = config["AzureStorage:ConnectionString"];
            var containerName = config["AzureStorage:ContainerName"];
            _container = new BlobContainerClient(connectionString, containerName);
        }

        public async Task<string> UploadImageAsync(IFormFile file)
        {
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var blob = _container.GetBlobClient(fileName);

            await blob.UploadAsync(file.OpenReadStream(), new BlobHttpHeaders
            {
                ContentType = file.ContentType
            });

            return blob.Uri.ToString();
        }

        public async Task DeleteImageAsync(string imageUrl)
        {
            var uri = new Uri(imageUrl);
            var fileName = Path.GetFileName(uri.LocalPath);
            var blob = _container.GetBlobClient(fileName);
            await blob.DeleteIfExistsAsync();
        }
    }
}