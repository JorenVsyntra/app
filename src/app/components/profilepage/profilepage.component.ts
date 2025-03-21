import { Component, OnInit, Signal, signal, inject, effect } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { User } from '../../shared/user';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CityService } from '../../shared/city.service';
import { city } from '../../shared/city';
import { travel } from '../../shared/travel';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profilepage.component.html',
  styleUrls: ['./profilepage.component.css'],
  })
export class ProfilepageComponent implements OnInit {
  private userService = inject(UserService);
  private cityService = inject(CityService);
  users: Signal<User[]> = this.userService.users;
  selectedUser: Signal<User | null> = this.userService.selectedUser;
  cities: Signal<city[]> = this.cityService.cities;

  profileForm = new FormGroup({
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    address: new FormControl(''),
    bio: new FormControl(''),
    dob: new FormControl(''),
    type: new FormControl(''),
    carseats: new FormControl<number | null>(null),
    city_id: new FormControl<number | null>(null),
  });

  constructor() {
    effect(() => {
      const user = this.selectedUser();
      if (user) {
        console.log('Current user:', user);
        this.profileForm.patchValue({
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          phone: user.phone,
          address: user.location?.address,
          bio: user.bio,
          dob: user.dob,
          type: user.car?.type,        
          carseats: user.car?.carseats, 
          city_id: user.location?.city_id 
        }, { emitEvent: false });
      }
    });
  }
  
  ngOnInit() {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      this.loadUser(parseInt(storedUserId, 10));
    }
    this.loadCities();
  }

  loadUser(id: number) {
    this.userService.loadUser(id);
  }

  loadCities() {
    this.cityService.loadCities();
  }

  async onSubmit() {
    if (this.profileForm.valid) {
      console.log('Form values:', this.profileForm.value); 
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
            city_id: this.profileForm.value.city_id!,
          },
          bio: this.profileForm.value.bio,
          dob: this.profileForm.value.dob!,
          car: {
            ...currentUser.car,
            type: this.profileForm.value.type,
            carseats: this.profileForm.value.carseats
          }
        };
        console.log('Sending update:', updatedUser);
        try {
          await this.userService.updateUser(updatedUser);
          console.log('Update successful');
        } catch (error) {
          console.error('Update failed:', error);
        }
      }
    }
  }
}