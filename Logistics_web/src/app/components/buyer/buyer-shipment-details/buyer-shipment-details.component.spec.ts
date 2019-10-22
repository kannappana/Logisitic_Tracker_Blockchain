import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerShipmentDetailsComponent } from './buyer-shipment-details.component';

describe('BuyerShipmentDetailsComponent', () => {
  let component: BuyerShipmentDetailsComponent;
  let fixture: ComponentFixture<BuyerShipmentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerShipmentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerShipmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
