import { Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { AuthService } from './shared/auth.service';
//import { ProfilePageComponent } from './components/profilepage/profilepage.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, RouterOutlet, RouterLink,  ]
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router); // Move this to class level

  constructor() {}
  
  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  async logout() {
    this.authService.logout();
    await this.router.navigate(['/logingin']); // Use class level router
  }
  title = 'abbajo';
//filteredPosts: any;
}