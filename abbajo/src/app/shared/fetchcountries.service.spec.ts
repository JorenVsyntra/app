import { TestBed } from '@angular/core/testing';

import { FetchcountriesService } from './fetchcountries.service';

describe('FetchcountriesService', () => {
  let service: FetchcountriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchcountriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
