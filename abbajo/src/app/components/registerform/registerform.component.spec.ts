
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './registerform.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
      imports: [ ReactiveFormsModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form', () => {
    expect(component.registrationForm.valid).toBeFalsy();
    
    component.registrationForm.controls['firstName'].setValue('John');
    component.registrationForm.controls['lastName'].setValue('Doe');
    component.registrationForm.controls['streetAddress'].setValue('123 Main St');
    component.registrationForm.controls['city'].setValue('Anytown');
    component.registrationForm.controls['state'].setValue('California');
    component.registrationForm.controls['zipCode'].setValue('12345');
    component.registrationForm.controls['phone'].setValue('(123) 456-7890');
    component.registrationForm.controls['email'].setValue('john@example.com');
    
    expect(component.registrationForm.valid).toBeTruthy();
  });
});