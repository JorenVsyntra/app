import { Injectable, signal } from '@angular/core';
import { travel } from './travel';

@Injectable({
  providedIn: 'root'
})
export class TravelService {
  private apiUrl = 'http://localhost:8000/api/travels';
  selectedTravel = signal<travel | null>(null); 
  travels = signal<travel[]>([]);
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
      console.log('Travels loaded:', this.travels());
    } catch (error) {
      console.error('Error loading travels:', error);
      throw error;
    }
  }
}