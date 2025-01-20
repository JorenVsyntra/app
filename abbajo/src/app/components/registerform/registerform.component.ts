
import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { User } from '../../shared/user';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="user-container">
      <h2>User List</h2>
      <div class="add-user">
        <input 
          #userInput 
          type="text" 
          placeholder="Add new user" 
          (keyup.enter)="addUser(userInput.value); userInput.value = ''"
        >
        <button (click)="addUser(userInput.value); userInput.value = ''">Add</button>
      </div>

      @if (users().length === 0) {
        <p>No users yet! Add one above.</p>
      }

      <ul class="user-list">
        @for (user of users(); track user.id) {
          <li class="user-item">
            <input 
              type="checkbox" 
              [checked]="user.completed" 
              (change)="toggleUser(user)"
            >
            <span [class.completed]="user.completed">{{ user.title }}</span>
            <button (click)="deleteUser(user.id)">Delete</button>
          </li>
        }
      </ul>
    </div>
  `,
  styles: [`
    .user-container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
    }
    .add-user {
      margin-bottom: 20px;
    }
    .user-list {
      list-style: none;
      padding: 0;
    }
    .user-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
    .completed {
      text-decoration: line-through;
      color: #888;
    }
  `]
})
export class RegisterComponent {
  private userService = inject(UserService);
  users = this.userService.users;

  constructor() {
    this.userService.loadUsers();

    // Example of using effect
    effect(() => {
      console.log('Users updated:', this.users());
    });
  }

  addUser(title: string) {
    if (title.trim()) {
      this.userService.addUser(title);
    }
  }

  toggleUser(user: User) {
    this.userService.toggleUser(user);
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id);
  }
  async fetchCities() {
    try {
      const response = await fetch('http://localhost:8000/api/cities');
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  }
  async fetchCar() {
    try {
      const response = await fetch('http://localhost:8000/api/cars');
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
    }
  async fetchUsers() {
    try {
      const response = await fetch('http://localhost:8000/api/users');
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    }
// post user
async postUser() {
  try {
    const response = await fetch('http://localhost:8000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: 'John Doe' })
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error posting user:', error);
  }

}
}
