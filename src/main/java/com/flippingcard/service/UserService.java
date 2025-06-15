package com.flippingcard.service;

import com.flippingcard.model.User;
import com.flippingcard.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    public List<User> getAllUsers() {
        try {
            logger.debug("Fetching all users ordered by total score");
            List<User> users = userRepository.findAllByOrderByTotalScoreDesc();
            logger.debug("Successfully fetched {} users", users.size());
            return users;
        } catch (Exception e) {
            logger.error("Failed to fetch users: ", e);
            throw new RuntimeException("Failed to fetch users", e);
        }
    }

    public User getUserById(String id) {
        try {
            logger.debug("Fetching user by ID: {}", id);
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            logger.debug("Successfully fetched user: {}", user);
            return user;
        } catch (Exception e) {
            logger.error("Failed to fetch user with ID {}: ", id, e);
            throw new RuntimeException("Failed to fetch user", e);
        }
    }

    public User updateUserScore(String userId, int score) {
        try {
            logger.debug("Updating score for user {} with score {}", userId, score);
            User user = getUserById(userId);
            user.setTotalScore(user.getTotalScore() + score);
            User updatedUser = userRepository.save(user);
            logger.debug("Successfully updated user score: {}", updatedUser);
            return updatedUser;
        } catch (Exception e) {
            logger.error("Failed to update score for user {}: ", userId, e);
            throw new RuntimeException("Failed to update user score", e);
        }
    }

    public User saveUser(User user) {
        try {
            logger.debug("Saving user: {}", user);
            User savedUser = userRepository.save(user);
            logger.debug("Successfully saved user: {}", savedUser);
            return savedUser;
        } catch (Exception e) {
            logger.error("Failed to save user {}: ", user, e);
            throw new RuntimeException("Failed to save user", e);
        }
    }
}
