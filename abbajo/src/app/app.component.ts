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
  

  constructor() {}
  isLoggedIn() {
    return this.authService.isLoggedIn();
  }
  logout() {
    const router = inject(Router);
    this.authService.logout();
    router.navigate(['/logingin']);
  }
  title = 'abbajo';
//filteredPosts: any;
}