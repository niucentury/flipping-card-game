package com.flippingcard.controller;

import java.util.Map;
import com.flippingcard.model.Score;
import com.flippingcard.service.ScoreService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class ScoreController {
    private final ScoreService scoreService;

    @PatchMapping("/{userId}/score")
    public ResponseEntity<Map<String, Object>> updateScore(
            @PathVariable String userId,
            @RequestBody Map<String, Object> requestBody) {
        String theme = (String) requestBody.get("theme");
        String difficulty = (String) requestBody.get("difficulty");
        int score = (Integer) requestBody.get("score");
        Score updatedScore = scoreService.updateScore(userId, theme, difficulty, score);
        
        Map<String, Object> response = Map.of(
            "id", updatedScore.getId(),
            "user", updatedScore.getUser(),
            "theme", updatedScore.getTheme(),
            "difficulty", updatedScore.getDifficulty(),
            "highScore", updatedScore.getHighScore(),
            "lastScore", updatedScore.getLastScore()
        );
        
        return ResponseEntity.ok(response);
    }
}
