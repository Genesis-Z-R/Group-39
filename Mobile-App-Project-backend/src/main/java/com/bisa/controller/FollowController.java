package com.bisa.controller;

import com.bisa.model.Follow;
import com.bisa.model.User;
import com.bisa.repository.FollowRepository;
import com.bisa.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/follows")
public class FollowController {
    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    
    public FollowController(FollowRepository followRepository, UserRepository userRepository) {
        this.followRepository = followRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Follow> getAllFollows() {
        return followRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Follow> getFollowById(@PathVariable Long id) {
        return followRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Follow createFollow(@RequestBody Follow follow) {
        return followRepository.save(follow);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Follow> updateFollow(@PathVariable Long id, @RequestBody Follow followDetails) {
        Optional<Follow> followOpt = followRepository.findById(id);
        if (followOpt.isEmpty()) return ResponseEntity.notFound().build();
        
        Follow follow = followOpt.get();
        follow.setType(followDetails.getType());
        
        // Update followed user if provided
        if (followDetails.getFollowedUser() != null) {
            follow.setFollowedUser(followDetails.getFollowedUser());
        }
        
        return ResponseEntity.ok(followRepository.save(follow));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFollow(@PathVariable Long id) {
        if (!followRepository.existsById(id)) return ResponseEntity.notFound().build();
        followRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
} 