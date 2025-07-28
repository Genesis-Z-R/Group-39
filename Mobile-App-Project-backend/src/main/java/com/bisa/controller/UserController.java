package com.bisa.controller;

import com.bisa.model.User;
import com.bisa.repository.UserRepository;
import com.bisa.dto.UserProfileResponse;
import com.bisa.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserProfileService userProfileService;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            User existingUser = user.get();
            existingUser.setName(userDetails.getName());
            existingUser.setEmail(userDetails.getEmail());
            existingUser.setAvatar(userDetails.getAvatar());
            existingUser.setCredentials(userDetails.getCredentials());
            existingUser.setBio(userDetails.getBio());
            existingUser.setLocation(userDetails.getLocation());
            existingUser.setWebsite(userDetails.getWebsite());
            return ResponseEntity.ok(userRepository.save(existingUser));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            userRepository.delete(user.get());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/firebase")
    public ResponseEntity<Map<String, Object>> createUserFromFirebase(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String name = request.get("name");
        String avatar = request.get("avatar");
        
        // Check if user already exists
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            return ResponseEntity.ok(Map.of(
                "message", "User already exists",
                "user", existingUser.get()
            ));
        }
        
        // Create new user
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setName(name);
        newUser.setAvatar(avatar);
        
        User savedUser = userRepository.save(newUser);
        
        return ResponseEntity.ok(Map.of(
            "message", "User created successfully",
            "user", savedUser
        ));
    }

    // UserProfile endpoints
    @GetMapping("/{id}/profile")
    public ResponseEntity<UserProfileResponse> getUserProfile(
            @PathVariable Long id,
            @RequestParam(required = false) Long currentUserId) {
        
        Optional<UserProfileResponse> profile = userProfileService.getUserProfile(id, currentUserId);
        return profile.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/posts")
    public ResponseEntity<Page<UserProfileResponse.UserPostSummary>> getUserPosts(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<UserProfileResponse.UserPostSummary> posts = userProfileService.getUserPosts(id, pageable);
        return ResponseEntity.ok(posts);
    }

    @PostMapping("/{id}/follow")
    public ResponseEntity<Map<String, Object>> followUser(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long followerId) {
        
        boolean success = userProfileService.followUser(followerId, id);
        
        if (success) {
            return ResponseEntity.ok(Map.of(
                "message", "Successfully followed user",
                "followedUserId", id,
                "followerId", followerId
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Failed to follow user. User might not exist or already being followed.",
                "followedUserId", id,
                "followerId", followerId
            ));
        }
    }

    @DeleteMapping("/{id}/unfollow")
    public ResponseEntity<Map<String, Object>> unfollowUser(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long followerId) {
        
        boolean success = userProfileService.unfollowUser(followerId, id);
        
        if (success) {
            return ResponseEntity.ok(Map.of(
                "message", "Successfully unfollowed user",
                "followedUserId", id,
                "followerId", followerId
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Failed to unfollow user. User might not exist or not being followed.",
                "followedUserId", id,
                "followerId", followerId
            ));
        }
    }

    @GetMapping("/{id}/followers")
    public ResponseEntity<Page<UserProfileResponse>> getUserFollowers(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<UserProfileResponse> followers = userProfileService.getFollowers(id, pageable);
        return ResponseEntity.ok(followers);
    }

    @GetMapping("/{id}/following")
    public ResponseEntity<Page<UserProfileResponse>> getUserFollowing(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<UserProfileResponse> following = userProfileService.getFollowing(id, pageable);
        return ResponseEntity.ok(following);
    }
} 