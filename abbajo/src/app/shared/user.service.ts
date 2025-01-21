import { Injectable, signal, OnInit } from '@angular/core';
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
    const response = await fetch(this.usersUrl);
    const users = await response.json();
    if (users) {
      this.users.set(users);
    }
    console.log(this.users());
  }

  // load user
  async loadUser(id: number) {
    const response = await fetch(`${this.usersUrl}/${id}`);
    const user = await response.json();
    if (user) {
      this.selectedUser.set(user);
    }
    console.log(this.selectedUser());
  }

  async addUser(title: string) {
    const newUser = {
      title,
      completed: false
    };

    const response = await fetch(this.usersUrl, {
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

  // update user
  async updateUser(user: User) {
    const response = await fetch(`${this.usersUrl}/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
    const updatedUser = await response.json();
    if (updatedUser) {
      this.users.update(users =>
        users.map(u => (u.id === updatedUser.id ? updatedUser : u))
      );
    }
  }

  // delete user
  async deleteUser(id: number) {
    await fetch(`${this.usersUrl}/${id}`, {
      method: 'DELETE'
    });
    this.users.update(users => users.filter(u => u.id !== id));
  }
}