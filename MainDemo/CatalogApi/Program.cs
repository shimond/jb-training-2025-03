using CatalogApi.Contracts;
using CatalogApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddScoped<IProductRepository, SqlProductsRepository>();
builder.Services.AddCors(x => x.AddDefaultPolicy(o => o.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:4200")));
var app = builder.Build();
app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
