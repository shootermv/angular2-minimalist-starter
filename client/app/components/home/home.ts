/// <reference path="../../../../typings/tsd.d.ts" />

// Angular 2
import {Component, View} from 'angular2/angular2';

@Component({
  selector: 'home'
})
@View({
  stylesUrl: './app/components/home/home.css',
  templateUrl: './app/components/home/home.html'
})
export class Home {
  constructor() {

  }
}
