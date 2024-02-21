package com.ecommercewebsite.dao;

import com.ecommercewebsite.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

//to access data-rest api
@CrossOrigin("http://localhost:4200") //to access REST APIs into Angular
@RepositoryRestResource(collectionResourceRel = "productCategory", path = "product-category")
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
}
