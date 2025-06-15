package com.flippingcard.model;

import jakarta.persistence.*;
import java.util.Map;
import java.util.UUID;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    private String id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    private String avatar;
}
