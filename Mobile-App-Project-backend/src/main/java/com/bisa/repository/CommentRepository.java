package com.bisa.repository;

import com.bisa.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.bisa.model.Post;
 
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPost(Post post);
} 