import { Component, OnInit, Signal, inject, effect } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { User } from '../../shared/user';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterOutlet, RouterLink],
  templateUrl: './profilepage.component.html',
  styleUrls: ['./profilepage.component.css'],
  })
export class ProfilepageComponent implements OnInit {
  private userService = inject(UserService);
  users: Signal<User[]> = this.userService.users;
  selectedUser: Signal<User | null> = this.userService.selectedUser;

  profileForm = new FormGroup({
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    address: new FormControl(''),
    bio: new FormControl(''),
    dob: new FormControl(''),
  });

  constructor() {
    effect(() => {
      const user = this.selectedUser();
      if (user) {
        this.profileForm.patchValue({
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          phone: user.phone,
          address: user.location.address,
          bio: user.bio,
          dob: user.dob
        }, { emitEvent: false });
      }
    });
  }
  
  ngOnInit() {
    this.loadUsers();
    this.loadUser(1);
  }

  loadUsers() {
    this.userService.loadUsers();
  }

  loadUser(id: number) {
    this.userService.loadUser(id);
  }

  async onSubmit() {
    if (this.profileForm.valid) {
      const currentUser = this.selectedUser();
      if (currentUser) {
        const updatedUser: User = {
          ...currentUser,
          ...this.profileForm.value,
          firstname: this.profileForm.value.firstname!,
          lastname: this.profileForm.value.lastname!,
          email: this.profileForm.value.email!,
          phone: this.profileForm.value.phone!,
          location: {
            ...currentUser.location,
            address: this.profileForm.value.address!,
          },
          bio: this.profileForm.value.bio,
          dob: this.profileForm.value.dob!
        };
        
        await this.userService.updateUser(updatedUser);
      }
    }
  }
}