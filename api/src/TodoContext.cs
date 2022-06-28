using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi;

public class TodoContext : DbContext
{
  public DbSet<TodoItemDao> TodoItems { get; set; }

  protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
  {
    optionsBuilder.UseSqlite("Data Source=TodoItems.db;");
  }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<TodoItemDao>().ToTable("TodoItems");
  }
}