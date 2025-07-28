package com.bisa.repository;

import com.bisa.model.Post;
import com.bisa.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
 
public interface PostRepository extends JpaRepository<Post, Long> {
    // Additional methods for UserProfile functionality
    @Query("SELECT COUNT(p) FROM Post p WHERE p.user = :user")
    int countByUser(@Param("user") User user);
    
    List<Post> findByUserOrderByCreatedAtDesc(User user);
    
    Page<Post> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
} 