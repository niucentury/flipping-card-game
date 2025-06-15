package com.flippingcard.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "scores")
@Data
public class Score {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String theme;
    
    @Column(nullable = false)
    private String difficulty;
    
    @Column(nullable = false)
    private int highScore;
    
    @Column(nullable = false)
    private int lastScore;
}
