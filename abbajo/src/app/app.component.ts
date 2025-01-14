import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../app/components/registerform/registerform.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RegisterComponent],
  template: `
    <div class="app-container">
      <h1>Angular 19 Users</h1>
      <app-user-list />
    </div>
  `,
  styles: [`
    .app-container {
      padding: 20px;
    }
  `]
})
export class AppComponent {
}
