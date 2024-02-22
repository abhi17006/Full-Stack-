import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];

  currentCategoryId: number | undefined;

  //call ActivateRouter in the constructor
  constructor(private productService: ProductService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    //subscribe to router parametr ID
    this.route.paramMap.subscribe(
      ()=>{
        this.listProducts(); 
      }
    )
     
  }

  listProducts() {
    //fetch data from Service Methods API

    //check if id parameter is available
    const hasCategoryId : boolean= this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      //get the "id" param string. convert string to a number using the "+" symbol
      //  operator "!" non-null assertion operator"
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }else{
      //not category id available default to 1
      this.currentCategoryId=1;
    }

    //get the products for the given category id
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data =>{
        this.products = data;
    });
  }
}
