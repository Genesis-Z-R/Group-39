package com.bisa.repository;

import com.bisa.model.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
 
public interface FollowRepository extends JpaRepository<Follow, Long> {
    Optional<Follow> findByFollowerIdAndFollowingId(Long followerId, Long followingId);
} 