// registration.component.ts
import { Component, Inject, OnInit, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CityService } from '../../shared/city.service';
import { city } from '../../shared/city';
import { RouterLink, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, ],
  templateUrl: './registerform.component.html',
  styleUrls: ['./registerform.component.css'],
})

export class RegistrationComponent implements OnInit {
  private cityService = Inject(CityService);
  cities: Signal<city[]> = this.cityService.cities;
  constructor() {}

  registrationData = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    streetAddress: '',
    selectedCity: '',
    hasCar: null as boolean | null,
    carModel: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
carModels: any;

  fetchCities() {
    
  }
  fetchcarModels() {
    
  }
  
  
  showCarModelSection = false;

  onCarOptionChange(hasCar: boolean) {
    this.registrationData.hasCar = hasCar;
    this.showCarModelSection = hasCar;
    if (!hasCar) {
      this.registrationData.carModel = '';
    }
  }

  onSubmit() {
    console.log('Form submitted:', this.registrationData);
    // Add your form submission logic here
  }

  ngOnInit() {
    this.loadCities();
  }
  loadCities() {
    this.cityService.loadCities();
  }
}