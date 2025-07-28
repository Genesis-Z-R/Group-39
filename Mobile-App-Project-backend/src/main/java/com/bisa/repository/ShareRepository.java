package com.bisa.repository;

import com.bisa.model.Share;
import com.bisa.model.Post;
import com.bisa.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShareRepository extends JpaRepository<Share, Long> {
    List<Share> findByPostOrderBySharedAtDesc(Post post);
    List<Share> findByUserOrderBySharedAtDesc(User user);
    Optional<Share> findByPostAndUser(Post post, User user);
    
    @Query("SELECT COUNT(s) FROM Share s WHERE s.post = :post")
    long countByPost(@Param("post") Post post);
    
    @Query("SELECT COUNT(s) FROM Share s WHERE s.user = :user")
    long countByUser(@Param("user") User user);
    
    @Query("SELECT s.shareType, COUNT(s) FROM Share s WHERE s.post = :post GROUP BY s.shareType")
    List<Object[]> getShareTypeStats(@Param("post") Post post);
} 