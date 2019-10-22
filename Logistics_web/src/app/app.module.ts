import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './signin/signin.component';
import { HeaderComponent } from './_shared/header/header.component';
import { LeftMenuComponent } from './_shared/left-menu/left-menu.component';
import { NavComponent } from './_shared/nav/nav.component';
import { SellerShipmentDetailsComponent } from './components/seller/seller-shipment-details/seller-shipment-details.component';
import { ProviderShipmentDetailsComponent } from './components/provider/provider-shipment-details/provider-shipment-details.component';
import { BuyerShipmentDetailsComponent } from './components/buyer/buyer-shipment-details/buyer-shipment-details.component';
import { SellerAddShipmentComponent } from './components/seller/seller-add-shipment/seller-add-shipment.component';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    HeaderComponent,
    LeftMenuComponent,
    NavComponent,
    SellerShipmentDetailsComponent,
    ProviderShipmentDetailsComponent,
    BuyerShipmentDetailsComponent,
    SellerAddShipmentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
