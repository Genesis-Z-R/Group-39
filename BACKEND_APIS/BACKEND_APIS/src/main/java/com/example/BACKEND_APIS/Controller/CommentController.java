package com.example.BACKEND_APIS.Controller;


import com.example.BACKEND_APIS.Dto.CommentResponse;
import com.example.BACKEND_APIS.Service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/question/{questionId}")
    public ResponseEntity<String> commentOnQuestion(
            @RequestParam Long userId,
            @PathVariable Long questionId,
            @RequestBody String content
    ) {
        commentService.addCommentToQuestion(userId, questionId, content);
        return ResponseEntity.ok("Comment added to question.");
    }

    @PostMapping("/answer/{answerId}")
    public ResponseEntity<String> commentOnAnswer(
            @RequestParam Long userId,
            @PathVariable Long answerId,
            @RequestBody String content
    ) {
        commentService.addCommentToAnswer(userId, answerId, content);
        return ResponseEntity.ok("Comment added to answer.");
    }

    @GetMapping("/question/{questionId}")
    public ResponseEntity<List<CommentResponse>> getCommentsOnQuestion(@PathVariable Long questionId) {
        return ResponseEntity.ok(commentService.getCommentResponsesForQuestion(questionId));
    }

    @GetMapping("/answer/{answerId}")
    public ResponseEntity<List<CommentResponse>> getCommentsOnAnswer(@PathVariable Long answerId) {
        return ResponseEntity.ok(commentService.getCommentResponsesForAnswer(answerId));
    }
}
