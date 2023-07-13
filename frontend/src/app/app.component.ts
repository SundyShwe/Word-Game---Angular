import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <nav>
    <a [routerLink]="['','words']">Words Game </a>
    <a [routerLink]="['','history']">History</a>
    <a [routerLink]="['','setting']">Setting </a>
</nav>
    <router-outlet/>
  `,
  styles: [
    'nav a {margin-right:15px}'
  ]
})
export class AppComponent {
  title = 'frontend';
}
