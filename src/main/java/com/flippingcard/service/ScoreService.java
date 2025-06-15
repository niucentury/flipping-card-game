package com.flippingcard.service;

import com.flippingcard.model.Score;
import com.flippingcard.repository.ScoreRepository;
import com.flippingcard.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ScoreService {
    private static final Logger logger = LoggerFactory.getLogger(ScoreService.class);
    private final ScoreRepository scoreRepository;
    private final UserRepository userRepository;

    public ScoreService(ScoreRepository scoreRepository, UserRepository userRepository) {
        this.scoreRepository = scoreRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Score updateScore(String userId, String theme, String difficulty, int score) {
        try {
            logger.debug("Updating score for user: {}, theme: {}, difficulty: {}, score: {}", 
                userId, theme, difficulty, score);
            
            Score existingScore = scoreRepository.findByUserIdAndThemeAndDifficulty(userId, theme, difficulty);
            
            if (existingScore != null) {
                logger.debug("Found existing score record, updating...");
                existingScore.setLastScore(score);
                if (score > existingScore.getHighScore()) {
                    existingScore.setHighScore(score);
                }
                Score updatedScore = scoreRepository.save(existingScore);
                logger.debug("Successfully updated score: {}", updatedScore);
                return updatedScore;
            } else {
                logger.debug("No existing score record found, creating new one...");
                Score newScore = new Score();
                newScore.setUser(userRepository.findById(userId)
                    .orElseThrow(() -> {
                        logger.error("User not found with ID: {}", userId);
                        return new RuntimeException("User not found");
                    }));
                newScore.setTheme(theme);
                newScore.setDifficulty(difficulty);
                newScore.setHighScore(score);
                newScore.setLastScore(score);
                Score savedScore = scoreRepository.save(newScore);
                logger.debug("Successfully created new score record: {}", savedScore);
                return savedScore;
            }
        } catch (Exception e) {
            logger.error("Failed to update score for user: {}, theme: {}, difficulty: {}: ", 
                userId, theme, difficulty, e);
            throw new RuntimeException("Failed to update score", e);
        }
    }
}
