package com.bisa.repository;

import com.bisa.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByQuestionIdOrderByIsAcceptedDescCreatedAtAsc(Long questionId);
    List<Answer> findByAuthorIdOrderByCreatedAtDesc(Long authorId);
} 