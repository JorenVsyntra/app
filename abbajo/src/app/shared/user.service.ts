import { Injectable, signal } from '@angular/core';
import { User } from '../shared/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';
  users = signal<User[]>([]);

  constructor() {}

  async loadUsers() {
    const response = await fetch(this.apiUrl);
    const users = await response.json();
    if (users) {
      this.users.set(users);
    }
  }

  async addUser(title: string) {
    const newUser = {
      title,
      completed: false
    };

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    });
    const user = await response.json();
    if (user) {
      this.users.update(users => [...users, user]);
    }
  }

  async toggleUser(user: User) {
    const updatedUser = { ...user, completed: !user.completed };
    
    const response = await fetch(`${this.apiUrl}/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedUser)
    });
    const result = await response.json();
    if (result) {
      this.users.update(users =>
        users.map(u => u.id === user.id ? updatedUser : u)
      );
    }
  }

  async deleteUser(id: number) {
    await fetch(`${this.apiUrl}/${id}`, {
      method: 'DELETE'
    });
    this.users.update(users => users.filter(u => u.id !== id));
  }
}