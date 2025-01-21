import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MytripsComponent } from './mytrips.component';

describe('MytripsComponent', () => {
  let component: MytripsComponent;
  let fixture: ComponentFixture<MytripsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MytripsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MytripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
