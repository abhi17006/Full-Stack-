package com.ecommercewebsite.dao;

import com.ecommercewebsite.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer,Long> {

    Customer findByEmail(String theEMail);
}
