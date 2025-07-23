package com.example.BACKEND_APIS.Repository;

import com.example.BACKEND_APIS.Model.Answer;
import com.example.BACKEND_APIS.Model.User;
import com.example.BACKEND_APIS.Model.Vote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote, Long> {

    Optional<Vote> findByUserAndAnswer(User user, Answer answer);
}
