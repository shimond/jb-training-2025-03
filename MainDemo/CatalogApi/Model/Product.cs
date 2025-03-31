namespace CatalogApi.Model;

public record Product
{
    public int Id { get; init; } 
    public string Name { get; init; }
    public double Price { get; init; }
    public string Description { get; init; }
}


