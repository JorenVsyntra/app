import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css'],
  imports: [RouterOutlet, RouterLink,  ]
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  authService: any;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {

  }


  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      try {
        this.isLoading = true;
        

    const result = await this.authService.login(this.loginForm.value);
        console.log('Login result:', result);
        
        // Reset form after successful login
        this.loginForm.reset();
        this.loginForm.markAsUntouched();
        this.loginForm.markAsPristine()
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        

        this.router.navigate(['/dashboard']);
      } catch (error) {
        console.error('Login failed:', error);
      } finally {
        this.isLoading = false;
      }
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}
