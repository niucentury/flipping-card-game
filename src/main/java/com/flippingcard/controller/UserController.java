package com.flippingcard.controller;

import com.flippingcard.model.User;
import com.flippingcard.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;

    // @GetMapping
    // public List<User> getAllUsers() {
    //     return userService.getAllUsers();
    // }

    @GetMapping("/{id}")
    public User getUser(@PathVariable String id) {
        return userService.getUserById(id);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> saveUser(@RequestBody Map<String, Object> userData) {
        try {
            logger.debug("Received raw user data: {}", userData);
            logger.debug("Username: {}", userData.get("username"));
            logger.debug("Avatar: {}", userData.get("avatar"));
            
            if (userData.get("username") == null) {
                logger.error("Username is missing in request");
                throw new IllegalArgumentException("Username is required");
            }
            
            User user = new User();
            user.setUsername((String) userData.get("username"));
            user.setAvatar((String) userData.get("avatar"));
            
            User savedUser = userService.saveUser(user);
            Map<String, Object> response = Map.of(
                "id", savedUser.getId(),
                "username", savedUser.getUsername(),
                "avatar", savedUser.getAvatar()
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Failed to save user", e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid user data", e);
        }
    }
}
