using CatalogApi.Contracts;
using CatalogApi.Model;
using Microsoft.AspNetCore.Mvc;

namespace CatalogApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProductsController : ControllerBase
{

    // support: update, delete
    // implement IProductRepository  again with EF
    // try to use config file to select which implementation ("DataBaseMode": "EF|ADO")
    private readonly IProductRepository productRepository;

    public ProductsController(IProductRepository productRepository)
    {
        this.productRepository = productRepository;
    }

    [HttpGet]
    public async Task<ActionResult<List<Product>>> GetProducts(string? q = null)
    {
        if (q is null)
        {
            var res = await productRepository.GetProducts();
            return Ok(res);
        }
        else
        {
            var res = await productRepository.SearchProducts(q);
            return res;
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await productRepository.GetProduct(id);
        if (product == null)
        {
            return NotFound();
        }
        return Ok(product);
    }

    [HttpPost]
    public async Task<ActionResult<Product>> AddProduct(Product product)
    {
        var newProduct = await productRepository.AddProduct(product);
        return CreatedAtAction(nameof(GetProduct), new { id = newProduct.Id }, newProduct);
    }

}
