package com.bisa.controller;

import com.bisa.model.User;
import com.bisa.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import jakarta.validation.Valid;
import org.springframework.validation.annotation.Validated;
import com.bisa.model.Follow;
import com.bisa.repository.FollowRepository;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.http.HttpServletRequest;

@Validated
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;
    private final FollowRepository followRepository;
    public UserController(UserRepository userRepository, FollowRepository followRepository) {
        this.userRepository = userRepository;
        this.followRepository = followRepository;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public User createUser(@RequestBody @Valid User user) {
        return userRepository.save(user);
    }

    @PostMapping("/firebase")
    public ResponseEntity<User> createUserFromFirebase(HttpServletRequest request) {
        FirebaseToken firebaseToken = (FirebaseToken) request.getAttribute("firebaseToken");
        if (firebaseToken == null) {
            return ResponseEntity.status(401).body(null);
        }
        final String email = firebaseToken.getEmail();
        final String name = firebaseToken.getName();
        final String avatar = firebaseToken.getPicture();
        
        // Validate that we have required data
        if (email == null || email.trim().isEmpty()) {
            System.err.println("❌ Firebase token missing email");
            return ResponseEntity.badRequest().body(null);
        }
        
        // Sanitize inputs
        final String sanitizedEmail = email.trim().toLowerCase();
        final String sanitizedName = name != null ? name.trim() : null;
        final String sanitizedAvatar = avatar != null ? avatar.trim() : null;
        
        System.out.println("📧 Email from Firebase: " + sanitizedEmail);
        System.out.println("👤 Name from Firebase: " + sanitizedName);
        System.out.println("🖼️ Avatar from Firebase: " + sanitizedAvatar);
        System.out.println("🆔 Firebase UID: " + firebaseToken.getUid());

        // Check if user exists by email
        Optional<User> userOpt = userRepository.findAll().stream()
            .filter(u -> u.getEmail() != null && u.getEmail().equals(sanitizedEmail))
            .findFirst();

        User user;
        if (userOpt.isPresent()) {
            user = userOpt.get();
            System.out.println("✅ Found existing user: " + user.getEmail());
        } else {
            user = new User();
            user.setEmail(sanitizedEmail);
            user.setName(sanitizedName != null && !sanitizedName.isEmpty() ? sanitizedName : sanitizedEmail);
            user.setAvatar(sanitizedAvatar);
            user = userRepository.save(user);
            System.out.println("✅ Created new user: " + user.getEmail());
        }
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody @Valid User userDetails) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();
        User user = userOpt.get();
        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        user.setAvatar(userDetails.getAvatar());
        user.setCredentials(userDetails.getCredentials());
        return ResponseEntity.ok(userRepository.save(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) return ResponseEntity.notFound().build();
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/follow")
    public ResponseEntity<?> followUser(@PathVariable Long id, @RequestHeader("X-User-Id") Long followerId) {
        if (id.equals(followerId)) return ResponseEntity.badRequest().body("Cannot follow yourself");
        Optional<User> userOpt = userRepository.findById(id);
        Optional<User> followerOpt = userRepository.findById(followerId);
        if (userOpt.isEmpty() || followerOpt.isEmpty()) return ResponseEntity.notFound().build();
        Optional<Follow> followOpt = followRepository.findByFollowerIdAndFollowingId(followerId, id);
        if (followOpt.isPresent()) {
            followRepository.delete(followOpt.get());
            return ResponseEntity.ok("Unfollowed");
        } else {
            Follow follow = new Follow();
            follow.setFollower(followerOpt.get());
            follow.setFollowingId(id);
            follow.setType("user");
            followRepository.save(follow);
            return ResponseEntity.ok("Followed");
        }
    }
} 