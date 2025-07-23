package com.example.BACKEND_APIS.Service;

import com.example.BACKEND_APIS.Model.Question;
import com.example.BACKEND_APIS.Model.User;
import com.example.BACKEND_APIS.Repository.QuestionRepository;
import com.example.BACKEND_APIS.Repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class QuestionServices {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Optional<Question> getQuestionById(Long id) {
        return questionRepository.findById(id);
    }

    public Question createQuestion(Question question, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        question.setUser(user);
        return questionRepository.save(question);
    }

    public Question updateQuestion(Long id, Question questionDetails) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        question.setTitle(questionDetails.getTitle());
        question.setContent(questionDetails.getContent());
        return questionRepository.save(question);
    }

    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }

    public Page<Question> getPaginatedQuestions(Pageable pageable) {
        return questionRepository.findAll(pageable);
    }

    public Page<Question> searchQuestions(String query, Pageable pageable) {
        return questionRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(query, query, pageable);
    }
}
