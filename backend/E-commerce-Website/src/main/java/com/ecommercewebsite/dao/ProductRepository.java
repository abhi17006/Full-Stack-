package com.ecommercewebsite.dao;

import com.ecommercewebsite.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

//@Repository
@CrossOrigin("http://localhost:4200") //to access REST APIs into Angular
public interface ProductRepository extends JpaRepository<Product, Long> {
}
