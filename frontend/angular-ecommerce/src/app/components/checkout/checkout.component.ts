import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { every } from 'rxjs';
import { FormDataService } from '../../services/form-data.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { CustomValidators } from '../../validators/custom-validators';

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

  constructor(private formBuilder: FormBuilder,
              private formDataService: FormDataService
    ){}

  ngOnInit(): void {
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

        email: ['', [Validators.required, 
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
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: ['', [Validators.required, 
                          Validators.minLength(2), 
                          CustomValidators.notOnlyWhitespace
                        ]
                    ],
        cardNumber: ['', [Validators.required, Validators.pattern('[0-9]{16}')]], //only 16 digits
        securityCode: ['', [Validators.required, Validators.pattern('[0-9]{3}')]], //only 3 digits
        exipreMonth: [''],
        exipreYear: ['']
      }),
    });

    //populate credit card months
    const startMonth: number = new Date().getMonth() +1; //get current month JS months start with 0

    console.log("startMonth: "+ startMonth);
    this.formDataService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("retrived credit card months: "+ JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )
    //populate credit card years
    this.formDataService.getCreditCardYears().subscribe(
      data => {
        console.log("retrived credit card Years: "+ JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    //populate countries
    this.formDataService.getCountries().subscribe(
      data =>{
        console.log("Retrived countries: "+ JSON.stringify(data));
        this.countries=data;
      }
    )
  }

  onSubmit(){
    console.log("values: ");

    if(this.checkoutFromGroup.invalid){
      this.checkoutFromGroup.markAllAsTouched();
    }
    console.log(this.checkoutFromGroup.get('customer')?.value);
    console.log("The shipping address is " + this.checkoutFromGroup.get('shippingAddress')?.value.country.name);
    console.log("The shipping address is " + this.checkoutFromGroup.get('shippingAddress')?.value.state.name);
    
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
  //get creditCardType(){return this.checkoutFromGroup.get('creditCard.cardType');}

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
}
