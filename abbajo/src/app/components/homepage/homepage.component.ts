import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TravelService } from '../../shared/travel.service';
import { travel } from '../../shared/travel';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {
  private travelService = inject(TravelService);
  travels = signal<travel[]>([]);
  filteredTravels = signal<travel[]>([]);
  searchControl = new FormControl('');

  ngOnInit() {
    this.loadTravels();
  }

  async loadTravels() {
    await this.travelService.loadTravels();
    this.travels.set(this.travelService.travels());
    this.filteredTravels.set(this.travels());
  }

  onSearch(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    const filtered = this.travels().filter(travel => 
      travel.start_city_name.toLowerCase().includes(searchTerm) ||
      travel.destination_city_name.toLowerCase().includes(searchTerm)
    );
    this.filteredTravels.set(filtered);
  }

  showAll() {
    this.filteredTravels.set(this.travels());
    this.searchControl.setValue('');
  }

 showOnlyAvailable() {
     const filtered = this.travels().filter(travel => travel.passengers_count < 2);
     this.filteredTravels.set(filtered);
     this.searchControl.setValue('');
   }

  showfromcheapest() {
    const filtered = this.travels().sort((a, b) => a.travel_fee - b.travel_fee);
    this.filteredTravels.set(filtered);
    this.searchControl.setValue('');
  }

  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

}
