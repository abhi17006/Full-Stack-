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
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  //properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

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
    //access value that passed from Search URL
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    //if data keywaord is present
    if(this.searchMode){
      this.handleSearchProducts();
    }else{
      this.handleListProducts();
    }
   
  }

  handleSearchProducts() {
    //using ! operator makes current field is assignable, and not null or undefined
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    //now search for products using keyword
    this.productService.searchProducts(theKeyword).subscribe(
      data =>{
        this.products = data;
      }
    )
  }

  handleListProducts(){
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

    //check if have a different category tan previous

    //
    //if we have a differnt category id than previous
    //then set thePageNumber back to 1
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber=1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`)


    //get the products for the given category id, angular pagination starts with 1, Spring DATA REST starts 0
    this.productService.getProductListPaginate(this.thePageNumber - 1, 
                                              this.thePageSize,
                                              this.currentCategoryId).subscribe(
      data =>{
        //left-side of assignment properties are defined in the class
        //right-side data from Spring Data REST JSON
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
    });
  }

  //updatePage size method
  updatePageSize(pageSize: string) {
    //console.log(+pageSize);
    //convertt string into integer
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();//refresh page based on new pageSize
    }
}
