package com.flipo.sbr.springboot.repository;

import com.flipo.sbr.springboot.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategoryId(Long categoryId);

    List<Product> findByNameContainingIgnoreCase(String name);

    List<Product> findByPriceBetween(Double minPrice, Double maxPrice);

    List<Product> findByNameContainingIgnoreCaseAndCategoryId(String name, Long categoryId);
}