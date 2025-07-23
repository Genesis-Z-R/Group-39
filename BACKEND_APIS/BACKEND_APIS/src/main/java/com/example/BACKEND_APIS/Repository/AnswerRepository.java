package com.example.BACKEND_APIS.Repository;

import com.example.BACKEND_APIS.Model.Answer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Collection;

public interface AnswerRepository extends JpaRepository<Answer, Long>{
    List<Answer> findByQuestionId(Long questionId);

    Page<Answer> findByQuestionId(Long questionId, Pageable pageable);
}
