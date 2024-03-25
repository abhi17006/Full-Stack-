import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';

// okta imports
import { OKTA_CONFIG, OktaAuthModule, OktaConfig } from '@okta/okta-angular';
import {OktaAuth} from '@okta/okta-auth-js';
import myAppConfig from './config/my-app-config';

// const oktaConfig = myAppConfig.oidc;
// const oktaAuth = new OktaAuth(oktaConfig);
// const moduleConfig: OktaConfig = {oktaAuth};

// function onAuthRequired(oktaAuth: OktaAuth, injector: Injector){
//   // Use injector to access any service available within your application
//   const router = injector.get(Router);

//   // Redirect the user to your custom login page
//   router.navigate(['/login']);
// }

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';
import { Router } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { MembersPageComponent } from './components/members-page/members-page.component';

const appBaseHref = '/';


@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent,
    MembersPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    OktaAuthModule.forRoot() //forRoot
  ],
  providers: [ProductService, 
    {
      provide: OKTA_CONFIG, 
      useFactory: () =>{
        const oktaAuth = new OktaAuth(myAppConfig.oidc);
        return{
          oktaAuth,
          onAuthRequired:(oktaAuthA: OktaAuth, injector: Injector) =>{

            //redirect the user to custom login page
            const router = injector.get(Router);
            router.navigate(['/login']);
          }
        }
      }
    }
    // {provide: APP_BASE_HREF, useValue: {appBaseHref}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
