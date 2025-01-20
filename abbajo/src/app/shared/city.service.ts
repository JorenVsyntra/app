import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { city } from './city';
 
@Injectable({
  providedIn: 'root'
})
export class CityService {
 
  constructor() {}
 
    cityUrl = 'http://localhost:8000/api/cities';
    cities = signal<city[]>([]);
 
    // fetch cities
    async loadCities() {
      const response = await fetch(this.cityUrl);
      const cities = await response.json();
      if (cities) {
        this.cities.set(cities);
      }
    }
 
    // add city
    async addCity(title: string) {
      const newCity= {
        title,
        completed: false
      };
 
      const response = await fetch(this.cityUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCity)
      });
      const city = await response.json();
      if (city) {
        this.cities.update((cities: city[]) => [...cities, city]);
      }
    }
}