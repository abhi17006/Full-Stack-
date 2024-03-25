package com.ecommercewebsite.config;

import com.ecommercewebsite.entity.Country;
import com.ecommercewebsite.entity.Product;
import com.ecommercewebsite.entity.ProductCategory;
import com.ecommercewebsite.entity.State;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    //allowed origins from property file
    @Value("${allowed.origins}")
    private String[] theAllowedOrigins;

    //JPA ENtity Manager

    @Autowired
    private EntityManager entityManager;

    public MyDataRestConfig(EntityManager entityManager){
        this.entityManager=entityManager;
    }
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

        //array of methods
        HttpMethod[] theUnsupportedActions = {HttpMethod.PUT, HttpMethod.POST,
                                            HttpMethod.DELETE, HttpMethod.PATCH};

        //disable HTTP methods for Products: put, post and Delete
        disableHttpMethods(Product.class,config, theUnsupportedActions);

        //disable HTTP methods for ProductCategory: put, post and Delete
        disableHttpMethods(ProductCategory.class,config, theUnsupportedActions);

        //disable HTTP methods for Country: put, post and Delete
        disableHttpMethods(Country.class, config, theUnsupportedActions);

        //disable HTTP methods for State: put, post and Delete
        disableHttpMethods(State.class, config, theUnsupportedActions);
        //internal helper method
        exposeIds(config);

        //configurer cors mapping for Spring Data Rest,now can remove form JPAREpository
        cors.addMapping(config.getBasePath() + "/**").allowedOrigins(theAllowedOrigins);
    }

    //disable HTTP methods : put, post and Delete
    private static void disableHttpMethods(Class theClass, RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {

        config.getExposureConfiguration()
                .forDomainType(theClass) //entity name
                .withItemExposure( (metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions));
    }

    private void exposeIds(RepositoryRestConfiguration config) {

        //expose entity ids using Spring Data REST

        //get a list of all entity classes from entity manager
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        //create an arrya of the entity types
        List<Class> entityClass = new ArrayList<>();

        //get the entity for the entities
        for (EntityType tempEntity : entities){
            entityClass.add(tempEntity.getJavaType());
        }

        //expose the entity ids for the array of entity/domain types
        Class[] domaintypes = entityClass.toArray(new Class[0]);
        config.exposeIdsFor(domaintypes);
    }
}
