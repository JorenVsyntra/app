import { Injectable, signal } from '@angular/core';
import { User } from '../shared/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl = 'http://localhost:8000/api/users';
  selectedUser = signal<User | null>(null); 
  users = signal<User[]>([]);

  constructor() {}

  async loadUsers() {
    try {
      const response = await fetch(this.usersUrl);
      if (!response.ok) throw new Error('Failed to load users');
      const data = await response.json();
      this.users.set(data.users); // Note: accessing 'users' from response
    } catch (error) {
      console.error('Error loading users:', error);
      throw error;
    }
  }

  async loadUser(id: number) {
    try {
      const response = await fetch(`${this.usersUrl}/${id}`);
      if (!response.ok) throw new Error('Failed to load user');
      const data = await response.json();
      this.selectedUser.set(data.user); // Note: accessing 'user' from response
    } catch (error) {
      console.error('Error loading user:', error);
      throw error;
    }
  }

  async updateUser(user: User) {
    try {
      const response = await fetch(`${this.usersUrl}/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(user)
      });
      
      if (!response.ok) throw new Error('Failed to update user');
      
      const data = await response.json();
      const updatedUser = data.user;
      
      this.selectedUser.set(updatedUser);
      this.users.update(users =>
        users.map(u => (u.id === updatedUser.id ? updatedUser : u))
      );
      
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
}