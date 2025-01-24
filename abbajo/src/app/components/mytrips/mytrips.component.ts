// import { OnInit } from '@angular/core';
// import { TravelService } from '../../shared/travel.service';
// import { CommonModule } from '@angular/common';
// import { travel } from '../../shared/travel';
// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-mytrips',
//   templateUrl: './mytrips.component.html',
//   styleUrls: ['./mytrips.component.css']
// })
// export class MytripsComponent implements OnInit {
//   myTrips: travel[] = [];
//   isLoading = true;
// trip: any;

//   constructor(private travelService: TravelService) {}

//   ngOnInit() {
//     this.fetchMyTrips();
//   }

//   fetchMyTrips() {
//     this.travelService.loadTravels().then(() => {
//       // You'll need to implement a method to get current user ID
//       const currentUserId = this.getCurrentUserId();
//       this.myTrips = this.travelService.travels().filter(
//         trip => trip.driver_id === currentUserId
//       );
//       this.isLoading = false;
//     }).catch(error => {
//       console.error('Error fetching trips:', error);
//       this.isLoading = false;
//     });
//   }

//   // Placeholder method - replace with actual authentication service
//   private getCurrentUserId(): number {
//     return 1; // Example user ID
//   }
// }
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TravelService } from '../../shared/travel.service';
import { travel } from '../../shared/travel';

@Component({
  selector: 'app-mytrips',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gray-200 min-h-screen py-8">
      <div class="max-w-3xl mx-auto px-8 py-8 sm:px-16 sm:py-16 bg-white rounded-lg shadow-md">
        <h2 class="text-center text-gray-800 text-2xl font-semibold mb-8">My Trips</h2>

        @if (isLoading) {
          <div class="text-center text-gray-600">
            Loading your trips...
          </div>
        }

        @if (!isLoading && myTrips.length === 0) {
          <div class="text-center text-gray-600">
            No trips found.
          </div>
        }

        @for (trip of myTrips; track trip.id) {
          <div class="mb-6 p-6 border border-gray-300 rounded-lg">
            <div class="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
              <h3 class="text-xl font-bold text-gray-800">
                {{ trip.start_city_name }} to {{ trip.destination_city_name }}
              </h3>
              <span class="text-gray-600">{{ trip.travel_date }}</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-600 font-medium mb-2">Start Location</label>
                <p class="text-gray-800">{{ trip.start_location_address }}</p>
              </div>
              <div>
                <label class="block text-gray-600 font-medium mb-2">Destination</label>
                <p class="text-gray-800">{{ trip.destination_city_id }}</p>
              </div>
              <div>
                <label class="block text-gray-600 font-medium mb-2">Distance</label>
                <p class="text-gray-800">{{ trip.travel_km }} km</p>
              </div>
              <div>
                <label class="block text-gray-600 font-medium mb-2">Travel Fee</label>
                <p class="text-gray-800">€{{ trip.travel_fee }}</p>
              </div>
              <div>
                <label class="block text-gray-600 font-medium mb-2">Vehicle</label>
                <p class="text-gray-800">{{ trip.car_type }} ({{ trip.car_carseats }} seats)</p>
              </div>
              <div>
                <label class="block text-gray-600 font-medium mb-2">Passengers</label>
                <p class="text-gray-800">{{ trip.passengers_count }}</p>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class MytripsComponent implements OnInit {
  myTrips: travel[] = [];
  isLoading = true;

  constructor(@Inject(TravelService) private travelService: TravelService) {}

  ngOnInit() {
    this.fetchMyTrips();
  }

  fetchMyTrips() {
    this.travelService.loadTravels().then(() => {
      const currentUserId = this.getCurrentUserId();
      this.myTrips = this.travelService.travels().filter(
        (trip: travel) => trip.driver_id === currentUserId
      );
      this.isLoading = false;
    }).catch((error: any) => {
      console.error('Error fetching trips:', error);
      this.isLoading = false;
    });
  }

  private getCurrentUserId(): number {
    return 1; // Replace with actual authentication logic
  }
}