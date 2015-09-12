/// <reference path="../../../typings/tsd.d.ts" />

// Angular 2
import {Component, View} from 'angular2/angular2';

@Component({
  selector: 'home'
})
@View({
  styleUrls: ['/client/components/home/home.css'],
  templateUrl: '/client/components/home/home.html'
})
export class Home {
  constructor() {

  }
}
