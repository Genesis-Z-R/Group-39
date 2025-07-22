package com.example.BACKEND_APIS.Repository;

import com.example.BACKEND_APIS.Model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByQuestionId(Long questionId);
    List<Comment> findByAnswerId(Long answerId);
}
