import { Component, OnInit } from '@angular/core';
import { BuyerSellerProviderService } from 'src/app/services/buyer-seller-provider.service';

@Component({
  selector: 'app-provider-shipment-details',
  templateUrl: './provider-shipment-details.component.html',
  styleUrls: ['./provider-shipment-details.component.scss']
})
export class ProviderShipmentDetailsComponent implements OnInit {
  changeStatus: boolean = false;
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
  changeStatusInTransit(res) {
    // data.status = "delivered";
    // this.buyerSellerProviderService.changeSellerStatus(data.id, data).subscribe((data: any) => {
    //   console.log("Edited-->" + this.testData);
    // });
    // res.role = localStorage.getItem("loggedInRole").toLowerCase();
    // res.data[0].status = "delivered";
    // console.log(res);
    // this.buyerSellerProviderService.changeSellerStatus(res.id, res)
    // .subscribe((data: any) => {
    // });
    let requestJson = {
      data:[]
    }
    requestJson["role"] = localStorage.getItem("loggedInRole").toLowerCase();
    res.status = "delivered";
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
