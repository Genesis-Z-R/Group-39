package com.example.BACKEND_APIS.Service;


import com.example.BACKEND_APIS.Dto.CommentResponse;
import com.example.BACKEND_APIS.Model.Comment;
import com.example.BACKEND_APIS.Repository.AnswerRepository;
import com.example.BACKEND_APIS.Repository.CommentRepository;
import com.example.BACKEND_APIS.Repository.QuestionRepository;
import com.example.BACKEND_APIS.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private QuestionRepository questionRepo;
    @Autowired
    private AnswerRepository answerRepo;

    public void addCommentToQuestion(Long userId, Long questionId, String content) {
        Comment comment = new Comment();
        comment.setAuthor(userRepo.findById(userId).orElseThrow());
        comment.setQuestion(questionRepo.findById(questionId).orElseThrow());
        comment.setContent(content);
        comment.setCreatedAt(LocalDateTime.now());
        commentRepo.save(comment);
    }

    public void addCommentToAnswer(Long userId, Long answerId, String content) {
        Comment comment = new Comment();
        comment.setAuthor(userRepo.findById(userId).orElseThrow());
        comment.setAnswer(answerRepo.findById(answerId).orElseThrow());
        comment.setContent(content);
        comment.setCreatedAt(LocalDateTime.now());
        commentRepo.save(comment);
    }

    public List<CommentResponse> getCommentResponsesForQuestion(Long questionId) {
        return commentRepo.findByQuestionId(questionId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<CommentResponse> getCommentResponsesForAnswer(Long answerId) {
        return commentRepo.findByAnswerId(answerId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    private CommentResponse mapToResponse(Comment comment) {
        return new CommentResponse(
                comment.getId(),
                comment.getContent(),
                comment.getAuthor().getUsername(),
                comment.getCreatedAt()
        );

    }
}
