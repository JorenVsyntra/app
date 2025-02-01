import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TravelService } from '../../shared/travel.service';
import { travel } from '../../shared/travel';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../shared/auth.service';
import { passenger } from '../../shared/passenger';

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
  private authService = inject(AuthService);

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  isUserDriver(driverId: number) {
    const userId = this.authService.getUserId();
    return userId !== null ? Number(userId) === driverId : false;
}

async joinTrip(travelId: number) {
  const userId = localStorage.getItem('user_id');
  if (!userId) {
    console.error('No user ID found');
    return;
  }
  const passenger: passenger = {
    travel_id: travelId,
    user_id: Number(userId)
  };

  try {
    await this.travelService.joinTrip(passenger);
    await this.loadTravels();
  } catch (error) {
    console.error('Error joining trip:', error);
  }
}

async leaveTrip(travel_id: number) {
  try {
    await this.travelService.leaveTrip(travel_id);
    await this.loadTravels(); 
    console.log('Trip left:', travel_id);
  } catch (error) {
    console.error('Error canceling trip:', error);
  }
}

hasUserJoined(travel: travel): boolean {
  const userId = this.authService.getUserId();
  if (!userId || !travel.passenger_ids) return false;
  
  const passengerIds = travel.passenger_ids.split(',').map(Number);
  return passengerIds.includes(Number(userId));
}


  ngOnInit() {
    this.loadTravels();
  }

  async loadTravels() {
    await this.travelService.loadTravels();
    const travels = this.travelService.travels();
    this.travels.set(travels);
    this.filteredTravels.set(travels);
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
     const filtered = this.travels().filter(travel => travel.passengers_count < travel.travel_av_seats);
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
