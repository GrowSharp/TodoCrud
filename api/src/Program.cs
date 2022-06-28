using Microsoft.OpenApi.Models;
using TodoApi;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
  options.AddPolicy(name: MyAllowSpecificOrigins,
                    policy =>
                    {
                      policy.WithOrigins("http://localhost:3000").AllowAnyMethod().AllowAnyHeader().AllowCredentials();
                    });
});


builder.Services.AddControllers();

builder.Services.AddDbContext<TodoContext>();

builder.Services.AddSwaggerGen(c =>
{
  c.SwaggerDoc("v1",
               new OpenApiInfo
               {
                 Title = "TodoApi",
                 Version = "v1"
               });
});

var app = builder.Build();

if(builder.Environment.IsDevelopment())
{
  app.UseDeveloperExceptionPage();
  app.UseSwagger();
  app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "TodoApi v1"));
}

app.UseCors(MyAllowSpecificOrigins);

app.UseHttpsRedirection();

app.MapControllers();

app.Run();