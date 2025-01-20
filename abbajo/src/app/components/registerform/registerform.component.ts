// registration.component.ts
import { Component, Inject, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CityService } from '../../shared/city.service';


@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registerform.component.html',
  styleUrls: ['./registerform.component.css']
})
export class RegistrationComponent {
  
  constructor(private cityService: CityService) {}

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
cities: any;
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
    console.log('Registration component initialized');
    this.cityService.loadCities();
    this.cities = this.cityService.cities;
    console.log(this.cityService.loadCities());
  }
}