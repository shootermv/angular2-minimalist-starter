/// <reference path="../../../typings/tsd.d.ts" />

// Angular 2
import {Component, View, Directive, coreDirectives} from 'angular2/angular2';
import {formDirectives, Control, ControlGroup, Validators} from 'angular2/forms';

// App
import {appDirectives} from '../../directives/directives';
import {TodoService} from '../../services/TodoService';

// Simple component
@Component({
  selector: 'todo'
})
@View({
  directives: [coreDirectives, formDirectives, appDirectives],
  templateUrl: '/client/components/todo/todo.html'
})
export class Todo {

  todoForm: ControlGroup;

  constructor(private todoService: TodoService) {
    this.todoForm = new ControlGroup({
      title: new Control('', Validators.required)
    });
  }

  addOne($event) {
    $event.preventDefault();
    const todo = this.todoForm.value;
    this.todoService.addOne(todo);
    this.todoForm.controls.title.updateValue('');
  }

  removeOne(todo) {
    this.todoService.removeOne(todo.id);
  }

  find() {
    return this.todoService.find();
  }
}
