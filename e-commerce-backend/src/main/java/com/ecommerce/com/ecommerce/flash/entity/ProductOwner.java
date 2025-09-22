package com.ecommerce.com.ecommerce.flash.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.Table;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "product_owners")
public class ProductOwner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_owner_id")
    private Long productOwnerId;
    
    @NotBlank(message = "Product owner name is required")
    @JsonProperty("productOwnerName")
    @Column(name = "product_owner_name", nullable = false)
    private String productOwnerName;
    
    @NotBlank(message = "Product owner email is required")
    @JsonProperty("productOwnerEmail")
    @Column(name = "product_owner_email", nullable = false, unique = true)
    private String productOwnerEmail;
    
    @NotBlank(message = "Product owner password is required")
    @JsonProperty("productOwnerPassword")
    @Column(name = "product_owner_password", nullable = false)
    private String productOwnerPassword;
    
    @NotNull(message = "Product owner number is required")
    @JsonProperty("productOwnerNumber")
    @Column(name = "product_owner_number", nullable = false, unique = true)
    private long productOwnerNumber;
    
    // A ProductOwner can have multiple products
    @OneToMany(mappedBy = "productOwner", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Product> products;

    public Long getProductOwnerId() {
        return productOwnerId;
    }

    public void setProductOwnerId(Long productOwnerId) {
        this.productOwnerId = productOwnerId;
    }

    public @NotBlank(message = "Product owner name is required") String getProductOwnerName() {
        return productOwnerName;
    }

    public void setProductOwnerName(@NotBlank(message = "Product owner name is required") String productOwnerName) {
        this.productOwnerName = productOwnerName;
    }

    public @NotBlank(message = "Product owner email is required") String getProductOwnerEmail() {
        return productOwnerEmail;
    }

    public void setProductOwnerEmail(@NotBlank(message = "Product owner email is required") String productOwnerEmail) {
        this.productOwnerEmail = productOwnerEmail;
    }

    public @NotBlank(message = "Product owner password is required") String getProductOwnerPassword() {
        return productOwnerPassword;
    }

    public void setProductOwnerPassword(@NotBlank(message = "Product owner password is required") String productOwnerPassword) {
        this.productOwnerPassword = productOwnerPassword;
    }

    @NotNull(message = "Product owner number is required")
    public long getProductOwnerNumber() {
        return productOwnerNumber;
    }

    public void setProductOwnerNumber(@NotNull(message = "Product owner number is required") long productOwnerNumber) {
        this.productOwnerNumber = productOwnerNumber;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }
}
