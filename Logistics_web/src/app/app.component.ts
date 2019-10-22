import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showhidesignin: boolean = false;
  showhidemain: boolean = false;
  constructor(private route: Router) {
    route.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event['url'] == '/signin' || event['url'] == '/') {
          this.showhidemain = false;
          this.showhidesignin = true;
        } else {
          this.showhidesignin = false;
          this.showhidemain = true;
        }
      }
    });
  }
}
