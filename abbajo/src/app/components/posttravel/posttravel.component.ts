import { Component, OnInit, Signal, inject, signal, effect } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CityService } from '../../shared/city.service';
import { city } from '../../shared/city';
import { UserService } from '../../shared/user.service';
import { User } from '../../shared/user';
import { TravelService } from '../../shared/travel.service';
import { travel } from '../../shared/travel';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
  ],
  templateUrl: './posttravel.component.html',
  styleUrls: ['./posttravel.component.scss'],
  })
export class PosttravelComponent implements OnInit {
  private travelService = inject(TravelService);
  private userService = inject(UserService);
  private cityService = inject(CityService);
  travels: Signal<travel[]> = this.travelService.travels;
  selectedTravel: Signal<travel | null> = this.travelService.selectedTravel;
  selectedUser: Signal<User | null> = this.userService.selectedUser;
  cities: Signal<city[]> = this.cityService.cities;
  filteredCities = signal<city[]>([]);

  travelForm = new FormGroup({
    destination_id: new FormControl<number | null>(null),
    startlocation_id: new FormControl(''),
    date: new FormControl(''),
    fee: new FormControl<number | null>(null),
    km: new FormControl<number | null>(null),
    user_id: new FormControl(''),
    car_id: new FormControl(''),
    searchStart: new FormControl(''),
    searchDest: new FormControl(''),
  });

  constructor() {
    effect(() => {
      const user = this.selectedUser();
      if (user) {
        console.log('Current user:', user);
        this.travelForm.patchValue({
          user_id: user.firstname + ' ' + user.lastname,
          car_id: user.car?.type,
        }, { emitEvent: false });
      }
    })
  }
  
  ngOnInit() {
    this.loadTravels();
    this.loadUser(1);
    this.loadCities();
  }

  loadTravels() {
    this.travelService.loadTravels().then(() => {
      console.log('Travels loaded:', this.travels());
    });
  }

  loadUser(id: number) {
    this.userService.loadUser(id);
  }

  loadCities() {
    this.cityService.loadCities().then(() => {
      console.log('Cities loaded:', this.cities());
    });
  }

  onSearchInputStart(event: Event) {
    const searchStart = (event.target as HTMLInputElement).value.toLowerCase();
    if (!searchStart) {
      this.filteredCities.set(this.cities());
      return;
    }
    const filtered = this.cities().filter(city =>
      city.name.toLowerCase().includes(searchStart)
    );
    this.filteredCities.set(filtered);
  }

  async onSubmit() {
    try {
      const response = await fetch('http://localhost:8000/api/travels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination_id: this.travelForm.value.destination_id!,
          startlocation_id: this.travelForm.value.startlocation_id!,
          date: this.travelForm.value.date!,
          fee: this.travelForm.value.fee!,
          km: this.travelForm.value.km!,
          user_id: this.selectedUser()?.id,
          car_id: this.selectedUser()?.car.id
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'posting trip failed');
      }
      
      console.log('Trip posted:', data);
      // Handle successful registration (e.g., redirect to login)
      
    } catch (error) {
      console.error('Trip posting error:', error);
      // Handle registration error (show error message to user)
    }
  }
}