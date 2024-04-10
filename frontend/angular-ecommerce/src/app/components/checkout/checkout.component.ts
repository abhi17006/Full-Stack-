import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { every } from 'rxjs';
import { FormDataService } from '../../services/form-data.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { CustomValidators } from '../../validators/custom-validators';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';
import { SessionAPI } from '@okta/okta-auth-js';
import Stripe from 'stripe';
import { environment } from '../../../environments/environment';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentInfo } from '../../common/payment-info';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {


  checkoutFromGroup!: FormGroup;

  totalPrice: number=0;
  totalQuantity: number= 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  //set session storage
  storage: Storage = sessionStorage;

  //Intialize Stripe API 
  //stripe = loadStripe(environment.stripePublishableKey);
  stripe = window.Stripe(environment.stripePublishableKey);
  //stripe = new Stripe(environment.stripePublishableKey);
  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";
  constructor(private formBuilder: FormBuilder,
              private formDataService: FormDataService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router
    ){}

  ngOnInit(): void {
    //read the session storage email value
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);
    this.checkoutFromGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        //validation for each field, add custom validators
        firstName: ['', [Validators.required, 
                          Validators.minLength(2), 
                          CustomValidators.notOnlyWhitespace]
                    ],

        lastName: ['', [Validators.required, 
                        Validators.minLength(2), 
                        CustomValidators.notOnlyWhitespace]
                  ],
        //initail email value as loggedIn user' email
        email: [theEmail, [Validators.required, 
                      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
                      CustomValidators.notOnlyWhitespace]
                ]
      }),

      shippingAddress: this.formBuilder.group({
        street: ['', [Validators.required, 
                      Validators.minLength(2), 
                      CustomValidators.notOnlyWhitespace]
                ],
        city: ['', [Validators.required, 
                    Validators.minLength(2), 
                    CustomValidators.notOnlyWhitespace]
              ],
        state: ['', [Validators.required] ],
        zipcode: ['', [Validators.required, 
                      Validators.minLength(2), 
                      CustomValidators.notOnlyWhitespace]
                  ],
        country: ['', [Validators.required] ]
      }),

      billingAddress: this.formBuilder.group({
        street: ['', [Validators.required, 
                  Validators.minLength(2), 
                  CustomValidators.notOnlyWhitespace]
            ],
        city: ['', [Validators.required, 
                    Validators.minLength(2), 
                    CustomValidators.notOnlyWhitespace]
              ],
        state: ['', [Validators.required] ],
        zipcode: ['', [Validators.required, 
                  Validators.minLength(2), 
                  CustomValidators.notOnlyWhitespace]
              ],
        country: ['', [Validators.required] ]
      }),

      creditCard: this.formBuilder.group({
        // cardType: new FormControl('', [Validators.required]),
        // nameOnCard: ['', [Validators.required, 
        //                   Validators.minLength(2), 
        //                   CustomValidators.notOnlyWhitespace
        //                 ]
        //             ],
        // cardNumber: ['', [Validators.required, Validators.pattern('[0-9]{16}')]], //only 16 digits
        // securityCode: ['', [Validators.required, Validators.pattern('[0-9]{3}')]], //only 3 digits
        // exipreMonth: [''],
        // exipreYear: ['']
      }),
    });

    // //populate credit card months
    // const startMonth: number = new Date().getMonth() +1; //get current month JS months start with 0

    // console.log("startMonth: "+ startMonth);
    // this.formDataService.getCreditCardMonths(startMonth).subscribe(
    //   data => {
    //     console.log("retrived credit card months: "+ JSON.stringify(data));
    //     this.creditCardMonths = data;
    //   }
    // )
    // //populate credit card years
    // this.formDataService.getCreditCardYears().subscribe(
    //   data => {
    //     console.log("retrived credit card Years: "+ JSON.stringify(data));
    //     this.creditCardYears = data;
    //   }
    // );

    //populate countries
    this.formDataService.getCountries().subscribe(
      data =>{
        console.log("Retrived countries: "+ JSON.stringify(data));
        this.countries=data;
      }
    )

    //review cartDetails
    this.reviewCartDetails();

    //setup Stripe payment form
    this.setupStripePaymentForm();
  }
  
  
  

  //submit method
  onSubmit(){
    console.log("values: ");

    if(this.checkoutFromGroup.invalid){
      this.checkoutFromGroup.markAllAsTouched();
      //return
      return;
    }
    
    //setup order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    //get cart items
    const cartItems = this.cartService.cartItems;

    //create orderaitems from CartItems
    //long-way
    /* let orderItems: OrderItem[] = [];
    for(let i=0; i< cartItems.length; i++){
      orderItems[i] = new OrderItem(cartItems[i]);
    }*/

    //short-way
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem))

    //set up purchase
    let purchase = new Purchase();

    //populate purchase -customer
    purchase.customer = this.checkoutFromGroup.controls['customer'].value;
    
    //populate purchse shipping address
    purchase.shippingAddress = this.checkoutFromGroup.controls['shippingAddress'].value;

    //convert (parse - JSON into Object (dtringfy - JS value to JSON) )
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    //populate purchase  billing address
    purchase.billingAddress = this.checkoutFromGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    //populate purchase order and orderitems
    purchase.order = order;
    purchase.orderItems = orderItems;
    
    //compute the total amount
    this.paymentInfo.amount = Math.round(this.totalPrice * 100); //round and convert into cents
    this.paymentInfo.currency = "USD";

    console.log(`this.paymentInfo.amount: ${this.paymentInfo.amount}`);
    //call REST api via the CheckoutService
    
    /*if valid form then
      //create payment intent
      //confirm card payment
      //place order
    */
    if(!this.checkoutFromGroup.invalid && this.displayError.textContent === ""){
      //call springboot paymentIntent REST api
      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) =>{
          //Confirm a PaymentIntent by payment method
          this.stripe.confirmCardPayment(
            paymentIntentResponse.client_secret,
            {
              // Pass an object to confirm using data collected by a card or cardNumber Element
              payment_method:{
                card: this.cardElement
              }
            },
            {handleActions: false}
            ).then((result: any) => {
              if(result.error){
                //inform the customer about the error
                alert(`There was an error: ${result.error.message}`);
              }else{
                //call REST API via the CheckoutService to placeorder
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: (response : any) =>{
                    alert(`Your order has benn received. \nOrder tracking number: ${response.orderTrackingNumber}`);
                  
                    //reset the cart
                    this.resetCart();
                  },
                  error: (err:any) =>{
                    alert(`There was a error: ${err.message}`);
                  }
                })
              }
            })
        }
      );
    }else{
      //mark checkoutFromGroup as markAllastouched
      this.checkoutFromGroup.markAllAsTouched();
      return;
    }
  }

  //reset Cart method
  resetCart() {
    //reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems(); //update the storage with latest state of the cart
    //reset the form
    this.checkoutFromGroup.reset();

    //naviate back to the products page
    this.router.navigateByUrl("/products");
  }

  //add validation methods
  get firstName(){return this.checkoutFromGroup.get('customer.firstName');}
  get lastName(){return this.checkoutFromGroup.get('customer.lastName');}
  get email(){return this.checkoutFromGroup.get('customer.email');}

  get shippingAddStreet(){return this.checkoutFromGroup.get('shippingAddress.street');}
  get shippingAddCity(){return this.checkoutFromGroup.get('shippingAddress.city');}
  get shippingAddState(){return this.checkoutFromGroup.get('shippingAddress.state');}
  get shippingAddZipCode(){return this.checkoutFromGroup.get('shippingAddress.zipcode');}
  get shippingAddCountry(){return this.checkoutFromGroup.get('shippingAddress.country');}

  get billingAddStreet(){return this.checkoutFromGroup.get('billingAddress.street');}
  get billingAddCity(){return this.checkoutFromGroup.get('billingAddress.city');}
  get billingAddState(){return this.checkoutFromGroup.get('billingAddress.state');}
  get billingAddZipCode(){return this.checkoutFromGroup.get('billingAddress.zipcode');}
  get billingAddCountry(){return this.checkoutFromGroup.get('billingAddress.country');}

  get creditCardType(){return this.checkoutFromGroup.get('creditCard.cardType');}
  get creditCardNameOnCard(){return this.checkoutFromGroup.get('creditCard.nameOnCard');}
  get creditCardNumber(){return this.checkoutFromGroup.get('creditCard.cardNumber');}
  get creditCardSecurityCode(){return this.checkoutFromGroup.get('creditCard.securityCode');}
  

  //checkBox method
  copyShippingAddToBillingAdd(event:any) {
    //if checkbox is checked then copy shiiping address to billing address
    if(event.target.checked){
      this.checkoutFromGroup.controls['billingAddress']
                .setValue(this.checkoutFromGroup.controls['shippingAddress'].value);

      //copy StateAddress
      this.billingAddressStates = this.shippingAddressStates;
    }else{
      //reset data to empty
      this.checkoutFromGroup.controls['billingAddress'].reset();

      //reset array
      this.billingAddressStates = [];
    }
  }

  //handleMonthsAndYears for user selected Year
  handleMonthAndYears(){
    const creditCardFormGroup = this.checkoutFromGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.exipreYear);

    //if current year is selected year then start with current year

    let startMonth: number=0;
    //currentYear is not selected year then show month from 1
    if(currentYear !== selectedYear){
      startMonth = 1;
    }
    
    // if(currentYear !== selectedYear){
    //   startMonth = new Date().getMonth() + 1; //show only
    // }
    // else{
    //   startMonth = 1;
    // }

    this.formDataService.getCreditCardMonths(startMonth).subscribe(
        data => {
          console.log("retrived credit card months: "+ JSON.stringify(data));
          this.creditCardMonths = data;
        }
    )
  }

  getStates(formGroupName: string){
    //get fromGroupName
    const formGroup = this.checkoutFromGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.formDataService.getStates(countryCode).subscribe(
      data =>{
        //based current FromGroupName states are appered
        if(formGroupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        }else{
          this.billingAddressStates = data;
        }

        //select first item by defalt
        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }

  //review card Details
  reviewCartDetails() {
    //subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity= data
    );

    //subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    )
  }
  //method for Stripe payment form
  setupStripePaymentForm() {
    
    //get a handle to stripe elements
    const elements = this.stripe.elements();
    
    //create a card elements .. and hide the zip-code field
    this.cardElement = elements.create('card', {hidePostalCode:true});

    //add an instance of card UI component into the 'card-element' div
    this.cardElement.mount('#card-element');

    //add event binding for the change event on the card element
    this.cardElement.on('change', (event:any) => {
      //geta handle to card-errorss element
      this.displayError = document.getElementById('card-errors');

      if(event.complete){
        this.displayError.textContent = "";
      }else if(event.error){
        //show validation error to customer
        this.displayError.textContent = event.error.message;
      }
    })
  }
}







