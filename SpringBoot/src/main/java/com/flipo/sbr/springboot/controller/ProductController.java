package com.flipo.sbr.springboot.controller;

import com.flipo.sbr.springboot.dto.product.ProductRequest;
import com.flipo.sbr.springboot.dto.product.ProductResponse;
import com.flipo.sbr.springboot.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // GET /api/products — public
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAll() {
        return ResponseEntity.ok(productService.findAll());
    }

    // GET /api/products/{id} — public
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(productService.findById(id));
    }

    // GET /api/products/category/{categoryId} — public
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductResponse>> getByCategory(
            @PathVariable Long categoryId
    ) {
        return ResponseEntity.ok(productService.findByCategoryId(categoryId));
    }

    // GET /api/products/search?name=phone — public
    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice
    ) {
        // Combined name + category search
        if (name != null && categoryId != null) {
            return ResponseEntity.ok(
                    productService.searchByNameAndCategory(name, categoryId)
            );
        }
        // Name only search
        if (name != null) {
            return ResponseEntity.ok(productService.searchByName(name));
        }
        // Price range filter
        if (minPrice != null && maxPrice != null) {
            return ResponseEntity.ok(productService.findByPriceRange(minPrice, maxPrice));
        }
        // Category only
        if (categoryId != null) {
            return ResponseEntity.ok(productService.findByCategoryId(categoryId));
        }
        // No filters — return all
        return ResponseEntity.ok(productService.findAll());
    }

    // POST /api/products — admin only
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> create(
            @RequestBody ProductRequest request
    ) {
        return ResponseEntity.status(201).body(productService.create(request));
    }

    // PUT /api/products/{id} — admin only
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> update(
            @PathVariable Long id,
            @RequestBody ProductRequest request
    ) {
        return ResponseEntity.ok(productService.update(id, request));
    }

    // DELETE /api/products/{id} — admin only
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
