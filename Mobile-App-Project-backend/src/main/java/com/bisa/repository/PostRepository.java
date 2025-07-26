package com.bisa.repository;

import com.bisa.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
 
public interface PostRepository extends JpaRepository<Post, Long> {
} 