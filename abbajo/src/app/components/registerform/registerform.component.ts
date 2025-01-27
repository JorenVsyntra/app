import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CityService } from '../../shared/city.service';
import { city } from '../../shared/city';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet],
  templateUrl: './registerform.component.html',
  styleUrls: ['./registerform.component.css'],
})
export class RegisterComponent implements OnInit {
  private cityService = inject(CityService);
  cities = this.cityService.cities;
  registrationForm: any;
  constructor() {
    this.loadCities();
  }
  registerData = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    streetAddress: '',
    selectedCity: '',
    hasCar: null as boolean | null,
    type: '',
    carSeats: 0,
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

carModels: any;

  showCarModelSection = false;

  onCarOptionChange(hasCar: boolean) {
    this.registerData.hasCar = hasCar;
    this.showCarModelSection = hasCar;
    if (!hasCar) {
      this.registerData.type = '';
    }
  }

  async onSubmit() {
    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname: this.registerData.firstName,
          lastname: this.registerData.lastName,
          email: this.registerData.email,
          password: this.registerData.password,
          phone: this.registerData.phone,
          dob: this.registerData.dateOfBirth,
          address: this.registerData.streetAddress,
          city_id: this.registerData.selectedCity,
          type: this.registerData.type || null,
          carseats: this.registerData.carSeats || null
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      console.log('Registration successful:', data);
      // Handle successful registration (e.g., redirect to login)
      
    } catch (error) {
      console.error('Registration error:', error);
      // Handle registration error (show error message to user)
    }
  }

  ngOnInit() {
    this.loadCities();
  }
  
  loadCities() {
    this.cityService.loadCities().then(() => {
    });
  }
}