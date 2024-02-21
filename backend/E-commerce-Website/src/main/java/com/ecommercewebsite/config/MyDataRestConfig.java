package com.ecommercewebsite.config;

import com.ecommercewebsite.entity.Product;
import com.ecommercewebsite.entity.ProductCategory;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

        //array of methods
        HttpMethod[] theUnsupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE};

        //disable HTTP methods for Products: put, post and Delete

        config.getExposureConfiguration()
                .forDomainType(Product.class) //entity name
                .withItemExposure( (metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions));



        //disable HTTP methods for ProductCategory: put, post and Delete

        config.getExposureConfiguration()
                .forDomainType(ProductCategory.class) //entity name
                .withItemExposure( (metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions));
    }
}
