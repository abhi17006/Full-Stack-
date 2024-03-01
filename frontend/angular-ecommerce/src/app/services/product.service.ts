import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
 
  private baseUrl = "http://localhost:8080/api/products";
  private categoryUrl = "http://localhost:8080/api/product-category";
  constructor(private httpClient: HttpClient) { }


  //method for get products page size and number
  getProductListPaginate(thePage: number, thePageSize: number, categoryId: number) : Observable<GetResponseProducts>{
    //url based on categoryId, page and size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`
                      + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }
  //method for get products
  getProductList(categoryId: number) : Observable<Product[]>{
    //url based on categoryId
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;

    return this.getProducts(searchUrl);
  }
  //search products
  searchProducts(theKyeword: string): Observable<Product[]> {
    //url based on search keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKyeword}`;

    return this.getProducts(searchUrl);
  }

  //internal method 
  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  //get product-categories
  getProductCategories() :  Observable<ProductCategory[]>{
    //returns an observable, maps the json data from SPring data REST to productCategory array
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  //get product By ID
  getProductById(theProductId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }

  
}
interface GetResponseProducts{
  // unwraps the JSON from Spring Data REST _embedded entry
  _embedded:{
    products: Product[];
  },
//metadata for pagination
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory{
  // unwraps the JSON from Spring Data REST _embedded entry
  _embedded:{
    productCategory: ProductCategory[];
  }
}
