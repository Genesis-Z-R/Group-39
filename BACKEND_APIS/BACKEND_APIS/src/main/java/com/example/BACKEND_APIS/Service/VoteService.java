package com.example.BACKEND_APIS.Service;

import com.example.BACKEND_APIS.Model.*;
import com.example.BACKEND_APIS.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
@Service
public class VoteService {

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AnswerRepository answerRepository;

    public void vote(Long answerId, Long userId, VoteType voteType) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        voteRepository.findByUserAndAnswer(user, answer).ifPresent(voteRepository::delete);

        Vote vote = new Vote(null, voteType, user, answer);
        voteRepository.save(vote);
    }
}
