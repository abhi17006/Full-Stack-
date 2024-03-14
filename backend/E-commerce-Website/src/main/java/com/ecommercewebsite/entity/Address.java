package com.ecommercewebsite.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "address")
@Getter
@Setter
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "street")
    private String street;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String State;

    @Column(name = "country")
    private String Country;

    @Column(name = "zip_code")
    private String zipcode;

    @OneToOne
    @PrimaryKeyJoinColumn //join using primary keys
    private Order order;


}
