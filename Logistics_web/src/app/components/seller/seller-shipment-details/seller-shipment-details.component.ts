import { Component, OnInit } from '@angular/core';
import { BuyerSellerProviderService } from 'src/app/services/buyer-seller-provider.service';

@Component({
  selector: 'app-seller-shipment-details',
  templateUrl: './seller-shipment-details.component.html',
  styleUrls: ['./seller-shipment-details.component.scss']
})
export class SellerShipmentDetailsComponent implements OnInit {

  changeStatus: boolean = false;
  testData: any[];
  timeRaster: any[];
  constructor(private buyerSellerProviderService: BuyerSellerProviderService) { }

  ngOnInit() {
    this.buyerSellerProviderService
    .getShipmentDetailsRoleBasedServerAPI(localStorage.getItem("loggedInRole").toLowerCase())
    .subscribe((response: any[]) => {
      this.testData = response;
      
      for(let timeRasterData of this.testData) {
        this.timeRaster = timeRasterData.timeRaster;
        console.log("timeRaster--"+JSON.stringify(this.timeRaster));
      }
      for(let result of this.testData){
        console.log(result.tempuratureBreach);
        if(result.tempuratureBreach == null) {
          result.tempuratureBreach = "NULL";
        }
      }
    });
  }
  changeStatusInStore(res) {
    let requestJson = {
      data:[]
    }
    requestJson["role"] = localStorage.getItem("loggedInRole").toLowerCase();
    res.status = "in-transit";
    requestJson.data.push(res);
    
    console.log(requestJson);

    console.log("---" + res);
    this.buyerSellerProviderService.changeSellerStatusServerAPI(requestJson)
    .subscribe((data: any) => {
      console.log("data--->>>" + data);
    });
  }

  modalRefresh(res) {
    this.timeRaster = res.timeRaster;
  }
}
