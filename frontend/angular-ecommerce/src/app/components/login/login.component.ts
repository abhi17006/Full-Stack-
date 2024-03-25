import { Component, Inject, OnInit, inject } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth, Tokens } from '@okta/okta-auth-js';
import OktaSignIn from '@okta/okta-signin-widget';
import myAppConfig from '../../config/my-app-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  oktaSignin: any;

  //inject OKTA auth service
  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth){
    this.oktaSignin = new OktaSignIn({
      
      //fetch info from myCOnfig class
      logo: 'assets/images/logo.png', //provide logo
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams: {
        pkce:true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes
      }
    });
  }


  async ngOnInit() {
    this.oktaSignin.remove(); //remove previous signIn
    this.oktaSignin.showSignInToGetTokens({
      el: '#okta-sign-in-widget',
      scopes: myAppConfig.oidc.scopes
    }).then((tokens: Tokens) =>{
      
      this.oktaAuth.handleLoginRedirect(tokens);
    }).catch((err: any) => {
      // Typically due to misconfiguration
      throw err;
    });
  }

  ngOnDestroy() {
    this.oktaSignin.remove();
  }
}
