import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerShipmentDetailsComponent } from './seller-shipment-details.component';

describe('SellerShipmentDetailsComponent', () => {
  let component: SellerShipmentDetailsComponent;
  let fixture: ComponentFixture<SellerShipmentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerShipmentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerShipmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
