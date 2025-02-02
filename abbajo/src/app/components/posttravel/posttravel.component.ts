import { Component, OnInit, Signal, inject, signal, effect } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  styleUrls: ['./posttravel.component.css'],
  })
export class PosttravelComponent implements OnInit {
  private router = inject(Router);
  private travelService = inject(TravelService);
  private userService = inject(UserService);
  private cityService = inject(CityService);
  travels: Signal<travel[]> = this.travelService.travels;
  selectedTravel: Signal<travel | null> = this.travelService.selectedTravel;
  selectedUser: Signal<User | null> = this.userService.selectedUser;
  cities: Signal<city[]> = this.cityService.cities;
  filteredCities = signal<city[]>([]);
  startLoc = signal<city | null>(null);
  destLoc = signal<city | null>(null);
  startDropdown = false;
  destDropdown = false;
  isButtonActive = false;

  travelForm = new FormGroup({
    destination_id: new FormControl<number | null>(null),
    startlocation_id: new FormControl<number | null>(null),
    startAddress: new FormControl(''),
    destAddress: new FormControl(''),
    date: new FormControl(''),
    fee: new FormControl<number | null>(null),
    km: new FormControl<number | null>(null),
    user_id: new FormControl(''),
    car_id: new FormControl(''),
    av_seats: new FormControl<number | null>(null),
    searchStart: new FormControl(''),
    searchDest: new FormControl(''),
    price: new FormControl<number | null>(null),
  });

  constructor() {
    effect(() => {
      const user = this.selectedUser();
      const km = this.travelForm.get('km')?.value ?? 0;
      const fee = this.travelForm.get('fee')?.value ?? 0;
      const calculatedPrice = (km / 100) * fee;
      const roundedPrice = Number(calculatedPrice.toFixed(2));

      if (user) {
        console.log('Current user:', user);
        this.travelForm.patchValue({
          user_id: user.firstname + ' ' + user.lastname,
          car_id: user.car?.type,
          searchStart: this.startLoc()?.name,
          searchDest: this.destLoc()?.name,
          price: roundedPrice 
        }, { emitEvent: false });
      }
    });
  
    this.travelForm.get('km')?.valueChanges.subscribe(() => {
      const km = this.travelForm.get('km')?.value ?? 0;
      const fee = this.travelForm.get('fee')?.value ?? 0;
      const calculatedPrice = (km / 100) * fee;
      const roundedPrice = Number(calculatedPrice.toFixed(2));
      
      this.travelForm.patchValue({ 
        price: roundedPrice 
      }, { emitEvent: false });
    });

    this.travelForm.get('fee')?.valueChanges.subscribe(() => {
      const km = this.travelForm.get('km')?.value ?? 0;
      const fee = this.travelForm.get('fee')?.value ?? 0;
      const calculatedPrice = (km / 100) * fee;
      const roundedPrice = Number(calculatedPrice.toFixed(2));
      
      this.travelForm.patchValue({ 
        price: roundedPrice 
      }, { emitEvent: false });
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
    this.startDropdown = true;
  }

  onSearchInputDest(event: Event) {
    const searchDest = (event.target as HTMLInputElement).value.toLowerCase();
    if (!searchDest) {
      this.filteredCities.set(this.cities());
      return;
    }
    const filtered = this.cities().filter(city =>
      city.name.toLowerCase().includes(searchDest)
    );
    this.filteredCities.set(filtered);
    this.destDropdown = true;
  }

  onBlur() {
    setTimeout(() => {
      this.startDropdown = false;
      this.destDropdown = false;
    }, 200);
  }

  selectStartCity(id: number) {
    console.log('Selected City ID:', id);
    this.startDropdown = false;
    this.startLoc.set(this.cities().find(city => city.id === id) ?? null);
  }

  selectDestCity(id: number) {
    console.log('Selected City ID:', id);
    this.destDropdown = false;
    this.destLoc.set(this.cities().find(city => city.id === id) ?? null);
  }

  async onSubmit() {
    const requestBody = {
      destCity_id: this.destLoc()?.id,
      startCity_id: this.startLoc()?.id,
      startAddress: this.travelForm.value.startAddress!,
      destAddress: this.travelForm.value.destAddress!,
      date: this.travelForm.value.date!,
      fee: this.travelForm.value.fee!,
      km: this.travelForm.value.km!,
      user_id: this.selectedUser()?.id,
      car_id: this.selectedUser()?.car.id,
      av_seats: this.travelForm.value.av_seats!,
      price: this.travelForm.value.price!,
    };
    console.log('Request body:', requestBody);

    try {
      const response = await fetch('http://localhost:8000/api/travels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 422) {
          console.error('Validation errors:', data.errors);
          Object.keys(data.errors).forEach(key => {
            const control = this.travelForm.get(key);
            if (control) {
              control.setErrors({
                serverError: data.errors[key][0]
              });
            }
          });
        }
        throw new Error(data.message || 'posting trip failed');
      }
      if (response.ok) {
        await this.router.navigate(['/mytrips']);
        console.log('Trip posted:', data);
      }
      
    } catch (error) {
      console.error('Trip posting error:', error);
    }
  }

  onButtonMouseDown(event: MouseEvent) {
    this.isButtonActive = true;
  }

  onButtonMouseUp(event: MouseEvent) {
    this.isButtonActive = false;
  }
}