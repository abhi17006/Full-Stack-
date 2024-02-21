import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];

  constructor(private productService: ProductService){}

  ngOnInit(): void {
    this.listProducts();  
  }

  listProducts() {
    //fetch data from Service Methods API
    this.productService.getProductList().subscribe(
      data =>{
        this.products = data;
    });
  }
}
