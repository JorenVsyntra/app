import { TestBed } from '@angular/core/testing';

import { countriesService } from './countries.service';

describe('countriesService', () => {
  let service: countriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(countriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
