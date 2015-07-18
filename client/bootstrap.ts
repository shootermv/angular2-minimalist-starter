/// <reference path="../typings/tsd.d.ts" />

// Angular 2
import {bootstrap} from 'angular2/angular2';

// Our top level component that holds all of our components
import {App} from './components/app';

/*
  Bootstrap our Angular app with our top level component `App`
  and inject our global services/bindings into Angular's dependency injection
*/
bootstrap(
  // Top Level Component
  App
);
