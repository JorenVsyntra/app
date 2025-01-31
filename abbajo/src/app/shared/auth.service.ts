import { Injectable, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  user: any;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  
  private tokenSignal = signal<string | null>(localStorage.getItem('token'));
  private userIdSignal = signal<string | null>(localStorage.getItem('user_id'));

  isLoggedIn = computed(() => !!this.tokenSignal());
  userId = computed(() => this.userIdSignal());

  constructor(private http: HttpClient) {
    effect(() => {
      console.log('Token:', this.tokenSignal());
      console.log('User ID:', this.userIdSignal());
    });
  }

  async login(credentials: LoginCredentials) {
    try {
    const response = await firstValueFrom(
      this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
    );
    
    if (response && response.user) {
      localStorage.setItem('user_id', response.user.id);
      localStorage.setItem('token', response.token);
      
      this.tokenSignal.set(response.token);
      this.userIdSignal.set(response.user.id);
    }
    return response;
  } catch (error) {
    console.error('Login service error', error);
    throw error;
  }
}

  getUserId(): string | null {
    return this.userIdSignal();
  }

  logout() {
    localStorage.removeItem('user_id');
    localStorage.removeItem('joined_trips');  
    localStorage.removeItem('token');
    this.tokenSignal.set(null);
    this.userIdSignal.set(null);
    console.log('Logged out');
  }
}