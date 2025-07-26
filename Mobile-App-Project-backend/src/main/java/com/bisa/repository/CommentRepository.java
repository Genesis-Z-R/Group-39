package com.bisa.repository;

import com.bisa.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import com.bisa.model.Post;
 
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPost(Post post);
    
    List<Comment> findByPostOrderByCreatedAtDesc(Post post);
    
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.post = :post")
    int countByPost(@Param("post") Post post);
} 