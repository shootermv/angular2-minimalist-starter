/// <reference path="../../../../typings/tsd.d.ts" />

// Angular 2
import {Component, View, Directive, coreDirectives} from 'angular2/angular2';

// App
import {appDirectives} from '../../directives/directives';
import {TodoService} from '../../services/TodoService';

// Simple component
@Component({
  selector: 'todo'
})
@View({
  directives: [coreDirectives, appDirectives],
  templateUrl: './app/components/todo/todo.html'
})
export class Todo {

  constructor(private todoService: TodoService) {
  }

  addOne($event, todoTitleField) {
    $event.preventDefault();
    this.todoService.addOne(todoTitleField.value);
    todoTitleField.value = null;
    todoTitleField.focus();
  }

  removeOne(todo) {
    this.todoService.removeOne(todo.id);
  }

  find() {
    return this.todoService.find();
  }
}
