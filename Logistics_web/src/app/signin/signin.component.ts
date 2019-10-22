import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BuyerSellerProviderService } from '../services/buyer-seller-provider.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  username: string;
  password: string;
  selectedRole: string;
  userLoginInId: string;
  roleList: any = [
    { id: 0, name: "--Select Role--" },
    { id: 1, name: "Buyer" },
    { id: 2, name: "Seller" },
    { id: 3, name: "Logistic" }
  ];
  //roleList;
  message: string;
  constructor(private router: Router, private buyerSellerProviderService: BuyerSellerProviderService) { }

  ngOnInit() {
    // this.buyerSellerProviderService.getUserRole().subscribe((data: any) => {
    //   this.roleList = data;
    // });
  }
  getRole(event: Event) {
    let selectedOptions = event.target['options'];
    let selectedIndex = selectedOptions.selectedIndex;
    this.selectedRole = (selectedOptions[selectedIndex].text).toLowerCase();
  }
  login(): void {
    localStorage.setItem("loggedInRole", this.selectedRole);
    this.buyerSellerProviderService.getUserLogin(this.username, this.password, this.selectedRole)
      .subscribe((data: any) => {
        if (data.length != 0) {
          if (this.selectedRole == ("buyer").toString()) {
            this.router.navigate(['./buyer-shipment-details']);
          } else if (this.selectedRole == ("seller").toString()) {
            this.router.navigate(['./seller-shipment-details']);
          } else if (this.selectedRole == ("logistic").toString()) {
            this.router.navigate(['./provider-shipment-details']);
          } else if (this.selectedRole == ("--select role--").toString() || this.selectedRole == undefined) {
            alert("Select Role...");
          }
        } else {
          alert('Invalid Credential');
          this.username = '';
          this.password = '';
        }
      });
  }
}
