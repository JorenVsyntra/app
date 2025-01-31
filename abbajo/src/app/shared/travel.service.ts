import { Injectable, signal } from '@angular/core';
import { travel } from './travel';

@Injectable({
  providedIn: 'root'
})
export class TravelService {
  private apiUrl = 'http://localhost:8000/api/travels';
  private apiUrl2 = 'http://localhost:8000/api/passengers';
  selectedTravel = signal<travel | null>(null); 
  travels = signal<travel[]>([]);
  joinedTrips = signal<number[]>([]);

  constructor() { }
 
  async postTravel(travel: travel) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(travel)
      });
      
      if (!response.ok) throw new Error('Failed to create travel');
      
      const data = await response.json();
      const createdTravel = data.travel;
      
      this.travels.update(travels => [...travels, createdTravel]);
      
      return createdTravel;
    } catch (error) {
      console.error('Error creating travel:', error);
      throw error;
    }
  }
 
  async updateTravel(travel: travel) {
    try {
      const response = await fetch(`${this.apiUrl}/${travel.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(travel)
      });
      
      if (!response.ok) throw new Error('Failed to update travel');
      
      const data = await response.json();
      const updatedTravel = data.travel;
      
      this.selectedTravel.set(updatedTravel);
      this.travels.update(travels =>
        travels.map(t => (t.id === updatedTravel.id ? updatedTravel : t))
      );
      
      return updatedTravel;
    } catch (error) {
      console.error('Error updating travel:', error);
      throw error;
    }
  }
 
  async deleteTravel(id: number) {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete travel');
      
      this.travels.update(travels => travels.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting travel:', error);
      throw error;
    }
  }


  async loadTravels() {
    const userId = localStorage.getItem('user_id');
    const response = await fetch(`${this.apiUrl}?user_id=${userId}`);
    if (!response.ok) throw new Error('Failed to load travels');
    const data = await response.json();
    this.travels.set(data);
  }

  async joinTrip(travelId: number) {
    try {
      const userId = localStorage.getItem('user_id');
      const response = await fetch(`${this.apiUrl2}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ user_id: userId, travel_id: travelId })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to join travel');
      }
  
      await this.loadTravels(); // Refresh travels data
      return data;
  
    } catch (error) {
      console.error('Join trip error:', error);
      throw error;
    }
  }

  async leaveTrip(travelId: number) {
    const userId = localStorage.getItem('user_id');
    const response = await fetch(`${this.apiUrl}/${travelId}/leave`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to leave trip');
    }

    await this.loadTravels(); // Refresh travels to update join status
  }

async cancelTrip(tripId: number) {
  try {
    const userId = localStorage.getItem('user_id');
    if (!userId) throw new Error('User must be logged in');

    // Update URL structure to match Laravel route
    const response = await fetch(`${this.apiUrl}/${tripId}/leave?user_id=${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to cancel trip');
    }

    // Update local state
    const currentJoined = JSON.parse(localStorage.getItem('joined_trips') || '[]');
    const updatedJoined = currentJoined.filter((id: number) => id !== tripId);
    localStorage.setItem('joined_trips', JSON.stringify(updatedJoined));
    this.joinedTrips.set(updatedJoined);

    await this.loadTravels();
    return true;
  } catch (error) {
    console.error('Error canceling trip:', error);
    throw error;
  }
}

  // async loadTravels() {
  //   try {
  //     const response = await fetch(this.apiUrl);
  //     if (!response.ok) throw new Error('Failed to load travels');
  //     const data = await response.json();
      
  //     // Map travel_id to id
  //     const mappedTravels = data.travels.map((travel: travel) => ({
  //       ...travel,
  //       id: travel.travel_id
  //     }));
      
  //     this.travels.set(mappedTravels);
  //     console.log('Travels loaded:', this.travels());
  //   } catch (error) {
  //     console.error('Error loading travels:', error);
  //     throw error;
  //   }
  // }
}