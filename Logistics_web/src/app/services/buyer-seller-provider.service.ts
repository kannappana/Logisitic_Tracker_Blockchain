import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BuyerSellerProviderService {

  UserLogin_API = "http://localhost:3000/login/";
  UserRole_API = "http://localhost:3000/role/";
  Buyer_API = "http://localhost:3000/buyer/";
  Seller_API = "http://localhost:3000/seller/";
  Provider_API = "http://localhost:3000/provider/";

  // Server API
  UserLogin_API_Server = "http://40.117.194.238:5000/login";
  Seller_API_Server = "http://40.117.194.238:5000/";

  constructor(private http: HttpClient) { }
  // Role
  getUserRole() {
    return this.http.get(this.UserRole_API);
  }

  // Login
  getUserLogin(username, password, selectedRole) {
    // return this.http.get(this.UserLogin_API + "?username=" + username + "&password=" + password);
    let loginServer = new URLSearchParams();
    loginServer.append('username', username);
    loginServer.append('password', password);
    loginServer.append('role', selectedRole);
    return this.http.post(this.UserLogin_API_Server, loginServer);
  }

  // Buyer
  getAllBuyerShipmentDetails() {
    return this.http.get(this.Buyer_API);
  }

  changeBuyerStatus(id, data) {
    return this.http.put(this.Buyer_API + id, data);
  }

  // Seller
  getAllSellerShipmentDetails() {
    return this.http.get(this.Seller_API);
  }

  changeSellerStatus(id, data) {
    return this.http.put(this.Seller_API + id, data);
  }

  addShipmentDetails(shipmentSubmitForm) {
    return this.http.post(this.Seller_API_Server + "addShipment", shipmentSubmitForm);
  }
  // Provider
  getAllProviderShipmentDetails() {
    return this.http.get(this.Provider_API);
  }

  changeProviderStatus(id, data) {
    return this.http.put(this.Provider_API + id, data);
  }

  // Server API
  addShipmentDetailsServerAPI(shipmentSubmitForm) {
    return this.http.post(this.Seller_API_Server + "addShipment", shipmentSubmitForm);
  }

  getShipmentDetailsRoleBasedServerAPI(selectedRole) {
    let params = new HttpParams();
    params = params.append('role',selectedRole);
    return this.http.get(this.Seller_API_Server + "getShipment",{
      params
    } );
  }

  changeSellerStatusServerAPI(data) {
    console.log("krishna");
    console.log("data" + JSON.stringify(data));
    return this.http.post(this.Seller_API_Server + "updateShipment", data);
  }
}
