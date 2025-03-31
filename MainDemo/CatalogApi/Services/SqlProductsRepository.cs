using CatalogApi.Contracts;
using CatalogApi.Model;
using Microsoft.Data.SqlClient;
using System.Transactions;

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
            SqlCommand command = new SqlCommand("INSERT INTO Products (Name, Price, Description) VALUES (@Name, @Price, @Description); SELECT SCOPE_IDENTITY();", connection);
            command.Parameters.AddWithValue("@Name", product.Name);
            command.Parameters.AddWithValue("@Price", product.Price);
            command.Parameters.AddWithValue("@Description", product.Description);
            await connection.OpenAsync();
            var newId = Convert.ToInt32(await command.ExecuteScalarAsync());
            var productAfterInsert = product with { Id = newId };
            return productAfterInsert;
        }
    }

    public Task UpdateProduct(Product product)
    {
        throw new NotImplementedException();
    }

    public Task DeleteProduct(int id)
    {
        throw new NotImplementedException();
    }

    public async Task<Product?> GetProduct(int id)
    {
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            SqlCommand command = new SqlCommand("SELECT * FROM Products WHERE Id = @Id", connection);
            command.Parameters.AddWithValue("@Id", id);
            await connection.OpenAsync();
            SqlDataReader reader = await command.ExecuteReaderAsync();

            var IdPosition = reader.GetOrdinal("Id");
            var NamePosition = reader.GetOrdinal("Name");
            var PricePosition = reader.GetOrdinal("Price");
            var DescriptionPosition = reader.GetOrdinal("Description");

            if (await reader.ReadAsync())
            {
                Product p = new Product
                {
                    Id = reader.GetInt32(IdPosition),
                    Name = reader.GetString(NamePosition),
                    Price = reader.GetDouble(PricePosition),
                    Description = reader.GetString(DescriptionPosition)
                };
                return p;
            }
            else
            {
                return null;
            }
        }
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

    public async Task<List<Product>> SearchProducts(string searchTerm)
    {
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            SqlCommand command = new SqlCommand("SELECT * FROM Products WHERE Name LIKE @SearchTerm OR Description LIKE @SearchTerm", connection);
            command.Parameters.AddWithValue("@SearchTerm", "%" + searchTerm + "%");
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
}
