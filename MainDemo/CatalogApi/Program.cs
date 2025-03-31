using CatalogApi.Contracts;
using CatalogApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddSingleton<ISmsService, SmsForFreeSmsService>();
builder.Services.AddScoped<IProductRepository, SqlProductsRepository>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.Use(async (context, next) => {
    var service = context.RequestServices.GetService<ISmsService>();
    await next();
});

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
