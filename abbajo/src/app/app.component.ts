import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
//import { ProfilePageComponent } from './components/profilepage/profilepage.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, RouterOutlet, RouterLink,  ]
})
export class AppComponent {
  title = 'abbajo';
//filteredPosts: any;
}