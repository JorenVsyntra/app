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

  async ngOnInit() {
    await this.loadtravels();
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      this.fetchMyTrips(parseInt(storedUserId, 10));
    }
  }

  async loadtravels() {
    await this.travelService.loadTravels();
    console.log('Travels loaded:', this.travels());
  }

  fetchMyTrips(userId: number) {
    const passengerTravels = this.travels().filter(trip => {
      // Add null check for passenger_ids
      if (!trip.passenger_ids) return false;
      
      // Split the passenger_ids string and convert to array of numbers
      const passengerIds = trip.passenger_ids.split(',').map(id => parseInt(id.trim(), 10));
      return passengerIds.includes(userId);
    });

    const driverTravels = this.travels().filter(
      trip => trip.driver_id === userId
    );

    // Combine passenger and driver trips
    this.filteredTravels.set([...driverTravels, ...passengerTravels]);
    console.log('Filtered trips:', this.filteredTravels());
    this.isLoading.set(false);
  }
}