package com.bisa.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "follows")
public class Follow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "follower_id")
    private User follower;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "followed_user_id")
    private User followedUser;

    private String type; // 'user', 'topic', 'space'
    private Instant followedAt;

    public Follow() {
        this.followedAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getFollower() { return follower; }
    public void setFollower(User follower) { this.follower = follower; }

    public User getFollowedUser() { return followedUser; }
    public void setFollowedUser(User followedUser) { this.followedUser = followedUser; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Instant getFollowedAt() { return followedAt; }
    public void setFollowedAt(Instant followedAt) { this.followedAt = followedAt; }
} 