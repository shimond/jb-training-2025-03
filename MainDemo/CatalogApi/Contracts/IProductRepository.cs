using CatalogApi.Model;

namespace CatalogApi.Contracts;

public interface IProductRepository
{
    Task<List<Product>> GetProducts();
    Task<List<Product>> SearchProducts(string q);
    Task<Product?> GetProduct(int id);
    Task<Product> AddProduct(Product product);
    Task UpdateProduct(Product product);
    Task DeleteProduct(int id);
}
