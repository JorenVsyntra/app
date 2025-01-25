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
  styleUrls: ['./posttravel.component.css'],
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
  startLoc = signal<city | null>(null);
  destLoc = signal<city | null>(null);
  startDropdown = false;
  destDropdown = false;
  isButtonActive = false;

  travelForm = new FormGroup({
    destination_id: new FormControl<number | null>(null),
    startlocation_id: new FormControl<number | null>(null),
    date: new FormControl(''),
    fee: new FormControl<number | null>(null),
    km: new FormControl<number | null>(null),
    user_id: new FormControl(''),
    car_id: new FormControl(''),
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

      if (user) {
        console.log('Current user:', user);
        this.travelForm.patchValue({
          user_id: user.firstname + ' ' + user.lastname,
          car_id: user.car?.type,
          searchStart: this.startLoc()?.name,
          searchDest: this.destLoc()?.name,
          price: calculatedPrice 
        }, { emitEvent: false });
      }
    });
    // Add listeners to update price when km or fee changes
    this.travelForm.get('km')?.valueChanges.subscribe(() => {
      const km = this.travelForm.get('km')?.value ?? 0;
      const fee = this.travelForm.get('fee')?.value ?? 0;
      const calculatedPrice = (km / 100) * fee;
      
      this.travelForm.patchValue({ 
        price: calculatedPrice 
      }, { emitEvent: false });
    });

    this.travelForm.get('fee')?.valueChanges.subscribe(() => {
      const km = this.travelForm.get('km')?.value ?? 0;
      const fee = this.travelForm.get('fee')?.value ?? 0;
      const calculatedPrice = (km / 100) * fee;
      
      this.travelForm.patchValue({ 
        price: calculatedPrice 
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
    try {
      const response = await fetch('http://localhost:8000/api/travels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination_id: this.destLoc()?.id,
          startlocation_id: this.startLoc()?.id,
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

  onButtonMouseDown(event: MouseEvent) {
    this.isButtonActive = true;
  }

  onButtonMouseUp(event: MouseEvent) {
    this.isButtonActive = false;
  }
}