using CatalogApi.Contracts;
using CatalogApi.Model;
using Microsoft.Data.SqlClient;

namespace CatalogApi.Services;

public class SqlProductsRepository : IProductRepository
{
    private readonly string? _connectionString;

    public SqlProductsRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("trainDb");
    }



    public async Task<Product> AddProduct(Product product)
    {
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            SqlCommand command = new SqlCommand("INSERT INTO Products (Name, Price, Description) VALUES (@Name, @Price, @Description)", connection);
            command.Parameters.AddWithValue("@Name", product.Name);
            command.Parameters.AddWithValue("@Price", product.Price);
            command.Parameters.AddWithValue("@Description", product.Description);
            await connection.OpenAsync();
            var rowsAffected = await command.ExecuteNonQueryAsync();
            return product;
        }        
    }

    public Task DeleteProduct(int id)
    {
        throw new NotImplementedException();
    }

    public Task<Product> GetProduct(int id)
    {
        throw new NotImplementedException();
    }

    public async Task<List<Product>> GetProducts()
    {
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            SqlCommand command = new SqlCommand("SELECT * FROM Products", connection);
            await connection.OpenAsync();
            SqlDataReader reader = await command.ExecuteReaderAsync();
            List<Product> list = new List<Product>();

            var IdPosition = reader.GetOrdinal("Id");
            var NamePosition = reader.GetOrdinal("Name");
            var PricePosition = reader.GetOrdinal("Price");
            var DescriptionPosition = reader.GetOrdinal("Description");

            while (await reader.ReadAsync())
            {
                Product p = new Product
                {
                    Id = reader.GetInt32(IdPosition),
                    Name = reader.GetString(NamePosition),
                    Price = reader.GetDouble(PricePosition),
                    Description = reader.GetString(DescriptionPosition)
                };
                list.Add(p);
            }

            return list;
        }
    }

    public Task UpdateProduct(Product product)
    {
        throw new NotImplementedException();
    }
}
