import { Injectable, signal } from '@angular/core';
import { travel } from './travel';
import { passenger } from './passenger';

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
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error('Failed to load travels');
      const data = await response.json();
      this.travels.set(data.travels);
    } catch (error) {
      console.error('Error loading travels:', error);
      throw error;
    }
  }

  async joinTrip(passenger: passenger) {
    try {
      const response = await fetch(this.apiUrl2, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(passenger)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to join travel');
      }
  
      const data = await response.json();
      await this.loadTravels(); // Refresh travels data
      console.log('Joined trip:', data);
      return data;
  
    } catch (error) {
      console.error('Join trip error:', error);
      throw error;
    }
  }

  async leaveTrip(travel_id: number) {
    try {
      const userId = localStorage.getItem('user_id');
      await fetch(`${this.apiUrl2}/${travel_id}/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
    }
    catch (error) {
      console.error('Error leaving trip:', error);
      throw error;
    }
  }
}