package com.example.BACKEND_APIS.Repository;

import com.example.BACKEND_APIS.Model.Follow;
import com.example.BACKEND_APIS.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FollowRepository extends JpaRepository<Follow, Long> {

    boolean existsByFollowerAndFollowing(User follower, User following);
    void deleteByFollowerAndFollowing(User follower, User following);
    List<Follow> findAllByFollowing(User user);
    List<Follow> findAllByFollower(User user);
}
