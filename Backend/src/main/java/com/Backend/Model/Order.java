package com.Backend.Model;

import com.Backend.OrderStatus;
import jakarta.persistence.*;
import org.springframework.data.annotation.Id;

import java.time.Instant;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // or UUID manually
    private Long id;

    private String name;
    private String email;
    private String phone;
    private String description;
    private String material;
    private String color;
    private String size;

    private String imageUrl;

    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.NEW;

    private Instant createdAt;
    private Instant updatedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = Instant.now();
    }

    // getters/setters or Lombok @Data
}
