import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderShipmentDetailsComponent } from './provider-shipment-details.component';

describe('ProviderShipmentDetailsComponent', () => {
  let component: ProviderShipmentDetailsComponent;
  let fixture: ComponentFixture<ProviderShipmentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderShipmentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderShipmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
