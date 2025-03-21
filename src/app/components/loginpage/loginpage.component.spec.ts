import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginPageComponent } from './loginpage.component';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginPageComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
    expect(component.loginForm.get('rememberMe')?.value).toBe(false);
  });

  it('should validate required fields', () => {
    const form = component.loginForm;
    expect(form.valid).toBeFalsy();
    
    form.controls['email'].setValue('test@example.com');
    expect(form.controls['email'].valid).toBeTruthy();
    
    form.controls['password'].setValue('123456');
    expect(form.controls['password'].valid).toBeTruthy();
    
    expect(form.valid).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.loginForm.controls['email'];
    
    emailControl.setValue('invalid-email');
    expect(emailControl.errors?.['email']).toBeTruthy();
    
    emailControl.setValue('test@example.com');
    expect(emailControl.errors).toBeNull();
  });

  it('should validate password length', () => {
    const passwordControl = component.loginForm.controls['password'];
    
    passwordControl.setValue('12345');
    expect(passwordControl.errors?.['minlength']).toBeTruthy();
    
    passwordControl.setValue('123456');
    expect(passwordControl.errors).toBeNull();
  });

  it('should show loading state during form submission', fakeAsync(() => {
    component.loginForm.setValue({
      email: 'test@example.com',
      password: '123456',
      rememberMe: false
    });

    component.onSubmit();
    expect(component.isLoading).toBeTruthy();

    tick(1000);
    expect(component.isLoading).toBeFalsy();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));
});