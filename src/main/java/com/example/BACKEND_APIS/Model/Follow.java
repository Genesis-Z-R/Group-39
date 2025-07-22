package com.example.BACKEND_APIS.Model;

import jakarta.persistence.*;
import com.example.BACKEND_APIS.Model.User;

import lombok.Getter;

import java.time.LocalDateTime;
@Getter
@Entity
public class Follow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User follower;

    @ManyToOne
    private User following;

    private LocalDateTime followedAt;


    public void setId(Long id) {
        this.id = id;
    }

    public void setFollower(User follower) {
        this.follower = follower;
    }

    public void setFollowing(User following) {
        this.following = following;
    }

    public void setFollowedAt(LocalDateTime followedAt) {
        this.followedAt = followedAt;
    }
}
