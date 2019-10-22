import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { BuyerShipmentDetailsComponent } from './components/buyer/buyer-shipment-details/buyer-shipment-details.component';
import { SellerShipmentDetailsComponent } from './components/seller/seller-shipment-details/seller-shipment-details.component';
import { ProviderShipmentDetailsComponent } from './components/provider/provider-shipment-details/provider-shipment-details.component';
import { SellerAddShipmentComponent } from './components/seller/seller-add-shipment/seller-add-shipment.component';


const routes: Routes = [
  { path: '', component: SigninComponent , pathMatch:'full' },
  { path: 'signin', component: SigninComponent },
  { path: 'buyer-shipment-details', component: BuyerShipmentDetailsComponent },
  { path: 'seller-shipment-details', component: SellerShipmentDetailsComponent },
  { path: 'seller-add-shipment', component: SellerAddShipmentComponent },
  { path: 'provider-shipment-details', component: ProviderShipmentDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
