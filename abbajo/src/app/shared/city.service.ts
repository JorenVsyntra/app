// src/app/shared/city.service.ts
import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { city } from './city';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private cityUrl = 'http://localhost:8000/api/cities';
  cities = signal<city[]>([]);

  async loadCities() {
    try {
      const response = await fetch(this.cityUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch cities');
      }
      const data = await response.json();
      if (data && data.cities) {
        this.cities.set(data.cities);
      }
    } catch (error) {
      console.error('Error loading cities:', error);
      // You might want to handle this error in the UI
    }
  }
}