import { TestBed } from '@angular/core/testing';

import { BuyerSellerProviderService } from './buyer-seller-provider.service';

describe('BuyerSellerProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BuyerSellerProviderService = TestBed.get(BuyerSellerProviderService);
    expect(service).toBeTruthy();
  });
});
