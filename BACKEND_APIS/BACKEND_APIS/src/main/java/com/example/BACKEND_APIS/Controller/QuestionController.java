package com.example.BACKEND_APIS.Controller;

import com.example.BACKEND_APIS.Dto.QuestionRequest;
import com.example.BACKEND_APIS.Dto.QuestionResponse;
import com.example.BACKEND_APIS.Model.Question;
import com.example.BACKEND_APIS.Model.User;
import com.example.BACKEND_APIS.Repository.QuestionRepository;
import com.example.BACKEND_APIS.Repository.UserRepository;
import com.example.BACKEND_APIS.Service.QuestionServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/questions")
public class QuestionController {

    @Autowired
    private QuestionServices questionService;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<QuestionResponse> postQuestion(@Valid @RequestBody QuestionRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Question question = new Question();
        question.setTitle(request.getTitle());
        question.setContent(request.getContent());
        question.setUser(user);

        Question saved = questionRepository.save(question);

        return ResponseEntity.ok(new QuestionResponse(
                saved.getId(),
                saved.getTitle(),
                saved.getContent(),
                saved.getUser().getName()
        ));
    }

    @GetMapping
    public List<QuestionResponse> getAllQuestions() {
        return questionRepository.findAll().stream()
                .map(q -> new QuestionResponse(
                        q.getId(),
                        q.getTitle(),
                        q.getContent(),
                        q.getUser().getName()
                ))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionResponse> getQuestionById(@PathVariable Long id) {
        return questionRepository.findById(id)
                .map(q -> ResponseEntity.ok(new QuestionResponse(
                        q.getId(),
                        q.getTitle(),
                        q.getContent(),
                        q.getUser().getName()
                )))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public Question updateQuestion(@PathVariable Long id, @RequestBody Question questionDetails) {
        return questionService.updateQuestion(id, questionDetails);
    }

    @DeleteMapping("/{id}")
    public void deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
    }

    @GetMapping("/paged")
    public Page<Question> getPaginatedQuestions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return questionService.getPaginatedQuestions(pageable);
    }

    @GetMapping("/search")
    public Page<Question> searchQuestions(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return questionService.searchQuestions(query, pageable);
    }
}