using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TodoItemsController : ControllerBase
{
  private readonly TodoContext context;

  public TodoItemsController(TodoContext context)
  {
    this.context = context;
  }

  [HttpGet]
  public async Task<ActionResult<IEnumerable<TodoItemDao>>> GetTodoItems()
  {
    return await context.TodoItems.ToListAsync();
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<TodoItemDao>> GetTodoItem(long id)
  {
    var todoItem = await context.TodoItems.FindAsync(id);

    if(todoItem == null)
    {
      return NotFound();
    }

    return todoItem;
  }

  [HttpPut("{id}")]
  public async Task<IActionResult> PutTodoItem(long id, TodoItemDao todoItem)
  {
    if(id != todoItem.Id)
    {
      return BadRequest();
    }

    context.Entry(todoItem).State = EntityState.Modified;

    try
    {
      await context.SaveChangesAsync();
    }
    catch(DbUpdateConcurrencyException)
    {
      if(!TodoItemExists(id))
      {
        return NotFound();
      }

      throw;
    }

    return NoContent();
  }

  [HttpPost]
  public async Task<ActionResult<TodoItemDao>> PostTodoItem(TodoItemDao todoItem)
  {
    context.TodoItems.Add(todoItem);
    await context.SaveChangesAsync();

    //return CreatedAtAction("GetTodoItem", new { id = todoItem.Id }, todoItem);
    return CreatedAtAction(nameof(GetTodoItem),
                           new
                           {
                             id = todoItem.Id
                           },
                           todoItem);
  }

  [HttpDelete("{id}")]
  public async Task<IActionResult> DeleteTodoItem(long id)
  {
    var todoItem = await context.TodoItems.FindAsync(id);
    if(todoItem == null)
    {
      return NotFound();
    }

    context.TodoItems.Remove(todoItem);
    await context.SaveChangesAsync();

    return NoContent();
  }

  private bool TodoItemExists(long id)
  {
    return context.TodoItems.Any(e => e.Id == id);
  }
}