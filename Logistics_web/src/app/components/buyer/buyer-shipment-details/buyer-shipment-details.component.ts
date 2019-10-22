import { Component, OnInit } from '@angular/core';
import { BuyerSellerProviderService } from 'src/app/services/buyer-seller-provider.service';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-buyer-shipment-details',
  templateUrl: './buyer-shipment-details.component.html',
  styleUrls: ['./buyer-shipment-details.component.scss']
})
export class BuyerShipmentDetailsComponent implements OnInit {
  testData: any[];
  timeRaster: any[];
  constructor(private buyerSellerProviderService: BuyerSellerProviderService) { }

  ngOnInit() {
    this.buyerSellerProviderService
    .getShipmentDetailsRoleBasedServerAPI(localStorage.getItem("loggedInRole").toLowerCase())
    .subscribe((data: any[]) => {
      this.testData = data;
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
  changeStatusAccept(res) {
    let requestJson = {
      data:[]
    }
    requestJson["role"] = localStorage.getItem("loggedInRole").toLowerCase();
    res.status = "accepted";
    requestJson.data.push(res);
    
    console.log(requestJson);

    console.log("---" + res);
    this.buyerSellerProviderService.changeSellerStatusServerAPI(requestJson)
    .subscribe((data: any) => {
      console.log("data--->>>" + data);
    });
  }
  changeStatusReject(res) {
    let requestJson = {
      data:[]
    }
    requestJson["role"] = localStorage.getItem("loggedInRole").toLowerCase();
    res.status = "rejected";
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
