using B1Plus.Api.Configuracoes;
using B1Plus.Api.Servicos.ApiService;
using B1Plus.Api.Servicos.Base;
using B1Plus.Api.Servicos.SAP;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Net;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<SAPConfiguracoes>(builder.Configuration.GetSection("Sap"));
builder.Services.Configure<StringConexaoConfiguracao>(builder.Configuration.GetSection("ConnectionStrings"));

builder.Services.AddScoped<PedidoVendaService>();
builder.Services.AddScoped<ParceiroNegocioService>();
builder.Services.AddScoped<ItemService>();
builder.Services.AddScoped<ImpostoService>();
builder.Services.AddScoped<FilialService>();
builder.Services.AddScoped<GrupoItemService>();
builder.Services.AddScoped<AnexoService>();
builder.Services.AddScoped<VendedorService>();
builder.Services.AddScoped<PedidoVendedorService>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IApiUrlServico, ApiUrlServico>();

builder.Services.AddHttpClient<SAPBase>((sap, client) =>
{
    var config = sap.GetRequiredService<IOptions<SAPConfiguracoes>>().Value;
    client.BaseAddress = new Uri(config.UrlBase);
})
.ConfigurePrimaryHttpMessageHandler(() =>
{
    return new HttpClientHandler
    {
        CookieContainer = new CookieContainer(),
        UseCookies = true,
        ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy
                .AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Services.Configure<JsonOptions>(options =>
{
    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;

});

var app = builder.Build();

app.UseCors("AllowAll");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
