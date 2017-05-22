import { TestBed, inject } from '@angular/core/testing';

import { GoogleMapsService } from './google-maps.service';

describe('GoogleMapsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleMapsService]
    });
  });

  it('should ...', inject([GoogleMapsService], (service: GoogleMapsService) => {
    expect(service).toBeTruthy();
  }));
});
