using TodoApi.Models;

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

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<TodoContext>();
builder.Services.AddSwaggerGen(c =>
{
  c.SwaggerDoc("v1",
               new()
               {
                 Title = "TodoApi",
                 Version = "v1"
               });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if(builder.Environment.IsDevelopment())
{
  app.UseDeveloperExceptionPage();
  app.UseSwagger();
  app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "TodoApi v1"));
}

app.UseCors(MyAllowSpecificOrigins);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();