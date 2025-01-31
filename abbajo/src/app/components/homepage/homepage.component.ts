import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TravelService } from '../../shared/travel.service';
import { travel } from '../../shared/travel';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../shared/auth.service';
import { passenger } from '../../shared/passenger';
import { filter } from 'rxjs';

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
  joinedTrips = this.travelService.joinedTrips;  

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
    await this.loadTravels(); // Refresh the travel list
  } catch (error) {
    console.error('Error joining trip:', error);
    // You might want to show an error message to the user here
  }
}

async cancelTrip(tripId: number) {
  try {
    await this.travelService.leaveTrip(tripId);
    await this.loadTravels(); // Refresh the travel list
  } catch (error) {
    console.error('Error canceling trip:', error);
  }
}

// hasUserJoined is now based on the has_joined property from backend
hasUserJoined(travel: travel): boolean {
  return travel.has_joined || false;
}


  ngOnInit() {
    this.loadTravels();
  }

  async loadTravels() {
    await this.travelService.loadTravels();
    const travels = this.travelService.travels();
    this.travels.set(travels);
    this.filteredTravels.set(travels);
    console.log('filtered',this.filteredTravels());
  }

  // async loadTravels() {
  //   await this.travelService.loadTravels();
  //   const travels = this.travelService.travels();
    
  //   // Validate that each travel has an ID
  //   const validTravels = travels.filter(travel => {
  //     if (!travel.id) {
  //       console.warn('Travel missing ID:', travel);
  //       return false;
  //     }
  //     return true;
  //   });
    
  //   this.travels.set(validTravels);
  //   this.filteredTravels.set(validTravels);
  // }

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
    console.log(this.travels());
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
