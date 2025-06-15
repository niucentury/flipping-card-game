package com.flippingcard.repository;

import com.flippingcard.model.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ScoreRepository extends JpaRepository<Score, Long> {
    List<Score> findByUserId(String userId);
    Score findByUserIdAndThemeAndDifficulty(String userId, String theme, String difficulty);
}
