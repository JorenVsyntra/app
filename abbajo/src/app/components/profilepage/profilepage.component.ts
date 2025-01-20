// src/app/profile/profile-page.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CountryService } from '../../shared/countries.service';  // Import your service

@Component({
  selector: 'app-profile-page',
  standalone: true,
  templateUrl: './profilepage.component.html',
  styleUrls: ['./profilepage.component.css'],
})
export class ProfilePageComponent implements OnInit {
  // Signal for selected country
  selectedCountry: number | null = null;

  // Reactive signal for countries from the service
  countries = this.countryService.countries;

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    // You can log or perform any actions when countries are loaded
    console.log('Countries loaded:', this.countries());
  }
}
