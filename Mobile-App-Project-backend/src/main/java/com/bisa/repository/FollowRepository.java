package com.bisa.repository;

import com.bisa.model.Follow;
import com.bisa.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
 
public interface FollowRepository extends JpaRepository<Follow, Long> {
    Optional<Follow> findByFollowerIdAndFollowingId(Long followerId, Long followingId);
    
    // Additional methods for UserProfile functionality
    Optional<Follow> findByFollowerIdAndFollowedUserId(Long followerId, Long followedUserId);
    
    @Query("SELECT COUNT(f) FROM Follow f WHERE f.followedUser = :user")
    int countByFollowedUser(@Param("user") User user);
    
    @Query("SELECT COUNT(f) FROM Follow f WHERE f.follower = :user")
    int countByFollower(@Param("user") User user);
    
    Page<Follow> findByFollowedUserOrderByFollowedAtDesc(User user, Pageable pageable);
    
    Page<Follow> findByFollowerOrderByFollowedAtDesc(User user, Pageable pageable);
} 