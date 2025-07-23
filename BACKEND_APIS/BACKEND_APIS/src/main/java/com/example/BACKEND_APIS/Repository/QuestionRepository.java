package com.example.BACKEND_APIS.Repository;

import com.example.BACKEND_APIS.Model.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
public interface QuestionRepository extends JpaRepository<Question, Long>{

    Page<Question> findAll(Pageable pageable);

    Page<Question> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(String title, String content, Pageable pageable);
}
