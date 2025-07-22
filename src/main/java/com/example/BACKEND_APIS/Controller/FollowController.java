package com.example.BACKEND_APIS.Controller;


import com.example.BACKEND_APIS.Dto.UserResponse;
import com.example.BACKEND_APIS.Service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/follow")

public class FollowController {

    @Autowired
    private FollowService followService;

    @PostMapping("/follow")
    public ResponseEntity<String> follow(@RequestParam Long followerId, @RequestParam Long followingId) {
        return ResponseEntity.ok(followService.followUser(followerId, followingId));
    }

    @DeleteMapping("/unfollow")
    public ResponseEntity<String> unfollow(@RequestParam Long followerId, @RequestParam Long followingId) {
        return ResponseEntity.ok(followService.unfollowUser(followerId, followingId));
    }

    @GetMapping("/followers/{userId}")
    public ResponseEntity<List<UserResponse>> getFollowers(@PathVariable Long userId) {
        return ResponseEntity.ok(followService.getFollowers(userId));
    }

    @GetMapping("/following/{userId}")
    public ResponseEntity<List<UserResponse>> getFollowing(@PathVariable Long userId) {
        return ResponseEntity.ok(followService.getFollowing(userId));
    }


}
