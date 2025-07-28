package com.bisa.repository;

import com.bisa.entity.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    Page<Question> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    @Query("SELECT q FROM Question q WHERE q.title LIKE %:searchTerm% OR q.content LIKE %:searchTerm%")
    Page<Question> findByTitleOrContentContaining(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT q FROM Question q JOIN q.tags t WHERE t IN :tags")
    Page<Question> findByTagsIn(@Param("tags") List<String> tags, Pageable pageable);
    
    List<Question> findByAuthorIdOrderByCreatedAtDesc(Long authorId);
    
    @Query("SELECT q FROM Question q WHERE q.isAnswered = :isAnswered ORDER BY q.createdAt DESC")
    Page<Question> findByIsAnswered(@Param("isAnswered") Boolean isAnswered, Pageable pageable);
} 