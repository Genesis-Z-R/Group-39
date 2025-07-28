package com.bisa.repository;

import com.bisa.model.FactCheck;
import com.bisa.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FactCheckRepository extends JpaRepository<FactCheck, Long> {
    List<FactCheck> findByPostOrderByCheckedAtDesc(Post post);
    Optional<FactCheck> findFirstByPostOrderByCheckedAtDesc(Post post);
    boolean existsByPost(Post post);
} 