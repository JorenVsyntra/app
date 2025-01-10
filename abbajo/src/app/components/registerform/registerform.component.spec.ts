import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterformComponent } from './registerform.component';

describe('RegisterformComponent', () => {
  let component: RegisterformComponent;
  let fixture: ComponentFixture<RegisterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
