import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BuyerSellerProviderService } from 'src/app/services/buyer-seller-provider.service';

@Component({
  selector: 'app-seller-add-shipment',
  templateUrl: './seller-add-shipment.component.html',
  styleUrls: ['./seller-add-shipment.component.scss']
})
export class SellerAddShipmentComponent implements OnInit {
shipmentAddedStatus : boolean = false;
  addShipmentForm: FormGroup;

  constructor(private buyerSellerProviderService: BuyerSellerProviderService) { }

  ngOnInit() {
    this.addShipmentForm = new FormGroup({
      shipmentId: new FormControl('', Validators.required),
      sellerLocation: new FormControl('', Validators.required),
      buyerId: new FormControl('', Validators.required),
      buyerLocation: new FormControl('', Validators.required),
      logisticID: new FormControl('', Validators.required),
      seller: new FormControl('', Validators.required)
    })
  }
  onAddShipmentSubmit(){
    this.addShipmentForm.value.status = "in-store";
    this.addShipmentForm.value.tempuratureBreach = null;
    // this.addShipmentForm.value.change_status = "0";
    console.log(this.addShipmentForm.value);
    this.buyerSellerProviderService.addShipmentDetailsServerAPI(this.addShipmentForm.value)
    .subscribe((data: any) => {
      console.log("Submitted-->" + data);
      this.shipmentAddedStatus = true;
      this.addShipmentForm.reset();
    });
    
  }
}
