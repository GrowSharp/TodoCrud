namespace TodoApi.Models;

public class TodoItemDao
{
  public long Id { get; set; }
  public string Name { get; set; }
  public bool IsDone { get; set; }
  public DateTime Created { get; set; }
}