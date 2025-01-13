// src/app/country.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root', // Service is provided globally
})
export class CountryService {
  private apiUrl = 'http://localhost:8000/api/countries'; // Backend URL

  // Signal for countries
  countries = signal<{ id: number; name: string }[]>([]);

  constructor(private http: HttpClient) {
    this.loadCountries();
  }

  private loadCountries(): void {
    this.http
      .get<{ id: number; name: string }[]>(this.apiUrl)
      .subscribe((data) => {
        this.countries.set(data); // Update the signal value
      });
  }
}
