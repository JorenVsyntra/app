
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';


// @Component({
//   selector: 'app-register',
//   templateUrl: './registerform.component.html',
//   styleUrls: ['./registerform.component.css']
// })
// export class RegisterComponent implements OnInit {
//   registrationForm: FormGroup;
//   states: string[] = [
//     'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
//     'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
//     'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
//     'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
//     'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma',
//     'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee',
//     'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
//   ];

//   constructor(private fb: FormBuilder) {
//     this.registrationForm = this.fb.group({
//       firstName: ['', Validators.required],
//       lastName: ['', Validators.required],
//       streetAddress: ['', Validators.required],
//       streetAddress2: [''],
//       city: ['', Validators.required],
//       state: ['', Validators.required],
//       zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]],
//       phone: ['', [Validators.required, Validators.pattern('^\\([0-9]{3}\\) [0-9]{3}-[0-9]{4}$')]],
//       email: ['', [Validators.required, Validators.email]],
//       preferences: ['']
//     });
//   }
  
//   ngOnInit(): void {}

//   onSubmit(): void {
//     if (this.registrationForm.valid) {
//       console.log(this.registrationForm.value);
//     }
//   }
// }



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
}