import { Component, OnInit, inject, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TravelService } from '../../shared/travel.service';
import { travel } from '../../shared/travel';
import { UserService } from '../../shared/user.service';
import { User } from '../../shared/user';


@Component({
  selector: 'app-mytrips',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mytrips.component.html',
  styleUrls: ['./mytrips.component.css']
})
export class MytripsComponent implements OnInit {
  private travelService = inject(TravelService);
  private userService = inject(UserService);

  selectedUser: Signal<User | null> = this.userService.selectedUser;
  travels: Signal<travel[]> = this.travelService.travels;
  filteredTravels = signal<travel[]>([]);
  isLoading = signal(true);

  constructor() {}

  ngOnInit() {
    this.loadTravels();
  }

  async loadTravels() {
    await this.travelService.loadTravels();
    const userId = localStorage.getItem('user_id');
    const joinedTripIds = this.travelService.joinedTrips();
    
    // Filter travels that user has joined
    const userTravels = this.travelService.travels().filter(travel => 
      travel.driver_id === Number(userId) || 
      joinedTripIds.includes(travel.id)
    );
    
    this.filteredTravels.set(userTravels);
  }
  loadUserAndTrips(userId: number) {
    // Load user first, then filter travels
    this.userService.loadUser(userId).then(() => {
      this.fetchMyTrips(userId);
      console.log('Trips loaded:', this.travels());
    }).catch(error => {
      console.error('Error loading user:', error);
      this.isLoading.set(false);
    });
  }

  fetchMyTrips(userId: number) {
    // Filter travels for the specific user
    const userTravels = this.travels().filter(
      trip => trip.driver_id === userId
    );
    
    this.filteredTravels.set(userTravels);
    this.isLoading.set(false);
  }
}