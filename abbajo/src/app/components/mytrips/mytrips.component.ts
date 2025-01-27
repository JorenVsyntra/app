// import { Component, OnInit, inject, Signal, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { TravelService } from '../../shared/travel.service';
// import { travel } from '../../shared/travel';
// import { UserService } from '../../shared/user.service';
// import { User } from '../../shared/user';



// @Component({
//   selector: 'app-mytrips',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './mytrips.component.html',
//   styleUrls: ['./mytrips.component.css']
// })
// export class MytripsComponent implements OnInit {
//   private travelService = inject(TravelService);
//   private userService = inject(UserService);
//   selectedUser: Signal<User | null> = this.userService.selectedUser
//   travels: Signal<travel[]> = this.travelService.travels
//   filterdTravels = signal<travel[]>([]);
//   isLoading = true;
//   getCurrentUserId: any;

//   constructor() {}

//   ngOnInit() {
//     this.loadTravels(1);
//     this.fetchMyTrips();
//   }

//   loadTravels(id: number) {
//     this.userService.loadUser(id);
//   }

//   fetchMyTrips() {
//     const currentUserId = 1;
    

//       const Travels = this.travelService.travels().filter(
//         trip => trip.driver_id === currentUserId
//       );
//     this.filterdTravels.set(Travels);
//   }
// }
import { Component, OnInit, inject, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TravelService } from '../../shared/travel.service';
import { travel } from '../../shared/travel';
import { UserService } from '../../shared/user.service';
import { User } from '../../shared/user';


@Component({
  selector: 'app-mytrips',
  standalone: true,
  imports: [CommonModule],
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
    // Assuming you want to load trips for a specific user
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      this.loadUserAndTrips(parseInt(storedUserId, 10));
    }
    this.loadtravels();
  }
loadtravels () {
  this.travelService.loadTravels();
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