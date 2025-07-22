package com.example.BACKEND_APIS.Service;

import com.example.BACKEND_APIS.Model.Answer;
import com.example.BACKEND_APIS.Model.Question;
import com.example.BACKEND_APIS.Model.User;
import com.example.BACKEND_APIS.Repository.AnswerRepository;
import com.example.BACKEND_APIS.Repository.QuestionRepository;
import com.example.BACKEND_APIS.Repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
@Service
public class AnswerServices {

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Answer> getAllAnswers() {
        return answerRepository.findAll();
    }

    public List<Answer> getAnswersByQuestionId(Long questionId) {
        return answerRepository.findByQuestionId(questionId);
    }

    public Optional<Answer> getAnswerById(Long id) {
        return answerRepository.findById(id);
    }

    public Answer createAnswer(Answer answer, Long questionId, Long userId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        answer.setQuestion(question);
        answer.setUser(user);

        return answerRepository.save(answer);
    }

    public Answer updateAnswer(Long id, Answer answerDetails) {
        Answer answer = answerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        answer.setContent(answerDetails.getContent());
        return answerRepository.save(answer);
    }

    public void deleteAnswer(Long id) {
        answerRepository.deleteById(id);
    }

    public Page<Answer> getPaginatedAnswersByQuestion(Long questionId, Pageable pageable) {
        return answerRepository.findByQuestionId(questionId, pageable);
    }

}
