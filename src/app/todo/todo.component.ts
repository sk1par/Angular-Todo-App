import { TodoService } from './../service/todo.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  categoryId: string;
  todos: Array<any>;
  todoName = '';
  dataStatus = 'Add';
  todoId: string;

  constructor(
    private todoService: TodoService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.categoryId = this.activatedRoute.snapshot.paramMap.get('id');
    this.todoService.loadTodos(this.categoryId).subscribe(results => {
      this.todos = results;
    });
  }

  onSubmit(f: NgForm) {
    if (this.dataStatus === 'Add') {
      const todo = {
        todo: f.value.todoName,
        isCompleted: false
      };
      this.todoService.saveTodo(this.categoryId, todo);
      f.resetForm();
    } else {
      this.todoService.updatetodo(this.categoryId, this.todoId, f.value.todoName);
      f.resetForm();
      this.dataStatus = 'Add';
    }
  }

  onEdit(todo: string, id: string) {
    this.todoName = todo;
    this.dataStatus = 'Edit';
    this.todoId = id;
  }

  onDelete(id: string) {
    this.todoService.deleteTodo(this.categoryId, id);
  }

  completeTodo(todoId: string) {
    this.todoService.markComplete(this.categoryId, todoId);
  }

  incompleteTodo(todoId: string) {
    this.todoService.markIncomplete(this.categoryId, todoId);
  }
}
