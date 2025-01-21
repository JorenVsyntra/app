import { Component, OnInit, Signal, inject } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { User } from '../../shared/user';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  templateUrl: './profilepage.component.html',
  styleUrls: ['./profilepage.component.css'],
  imports: [RouterOutlet, RouterLink,  ]
})
export class ProfilepageComponent implements OnInit {
  private userService = inject(UserService);
  users: Signal<User[]> = this.userService.users;
  selectedUser: Signal<User | null> = this.userService.selectedUser;

  constructor() {}
  
  ngOnInit() {
    // Load users first
    this.loadUsers();
    // Then load specific user
    this.loadUser(1);
    console.log("hallo");
  }

  loadUsers() {
    this.userService.loadUsers();
  }

  loadUser(id: number) {
    this.userService.loadUser(id);
  }
}