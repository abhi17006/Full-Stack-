import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrl: './login-status.component.css'
})
export class LoginStatusComponent implements OnInit {

  isAuthenticatedV: boolean = false;
  userFullName: string = '';

  constructor(public oktaAuthService: OktaAuthStateService,
            @Inject(OKTA_AUTH) private oktaAuth: OktaAuth
    ){}

   async ngOnInit(){
    //subscribe to authentication state changes

    this.isAuthenticatedV = await this.oktaAuth.isAuthenticated();
    if(this.isAuthenticatedV){
      await this.getUserDetails();
    }
  }

  //method for get user details
  async getUserDetails() {
    //fetch the logged in user details (user's claims)

    //user full name is exposed as property name
    await this.oktaAuth.getUser().then(
      (res)=>{
        this.userFullName =  res.name as string;
      }
    );
  }

  async logout(){
    //terminate the session with Okta and remove the current tokens
     await this.oktaAuth.signOut();
  }
}
