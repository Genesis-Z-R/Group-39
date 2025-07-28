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
    // Find follow relationship between two users
    Optional<Follow> findByFollowerAndFollowedUser(User follower, User followedUser);
    
    // Check if a user is following another user
    Optional<Follow> findByFollowerIdAndFollowedUserId(Long followerId, Long followedUserId);
    
    // Count followers for a user
    @Query("SELECT COUNT(f) FROM Follow f WHERE f.followedUser = :user")
    int countByFollowedUser(@Param("user") User user);
    
    // Count users that a user is following
    @Query("SELECT COUNT(f) FROM Follow f WHERE f.follower = :user")
    int countByFollower(@Param("user") User user);
    
    // Get followers of a user (paginated)
    Page<Follow> findByFollowedUserOrderByFollowedAtDesc(User user, Pageable pageable);
    
    // Get users that a user is following (paginated)
    Page<Follow> findByFollowerOrderByFollowedAtDesc(User user, Pageable pageable);
} 